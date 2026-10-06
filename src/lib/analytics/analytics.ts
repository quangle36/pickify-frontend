import { getPageSeo, SITE_ORIGIN } from "@/app/seo";
import type { Metric } from "web-vitals";

type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
let initialized = false;

export function analyticsPage(pathname: string): string | null {
  if (getPageSeo(pathname).canonical) return pathname.replace(/\/+$/, "") || "/";
  if (/^\/dashboard(?:\/(?:sign-in|sign-up|album\/[^/]+))?$/.test(pathname)) return "/dashboard";
  return null;
}

export function metricParameters(metric: Metric) {
  return {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_id: metric.id,
    metric_rating: metric.rating,
    metric_delta: metric.delta,
    // GA4 event values are integers; CLS is scaled by 1000.
    value: Math.round(metric.name === "CLS" ? metric.delta * 1000 : metric.delta),
    non_interaction: true,
  };
}

export function initAnalytics() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
  const page = analyticsPage(location.pathname);
  if (initialized || !import.meta.env.PROD || location.origin !== SITE_ORIGIN || !/^G-[A-Z0-9]+$/.test(id || "") || !page) return;
  initialized = true;
  const target = window as AnalyticsWindow;
  target.dataLayer = target.dataLayer || [];
  target.gtag = function () { target.dataLayer!.push(arguments); };
  target.gtag("js", new Date());
  let referrer = "";
  try { referrer = document.referrer ? new URL(document.referrer).origin : ""; } catch { /* Invalid referrer. */ }
  target.gtag("config", id, {
    send_page_view: false,
    page_location: `${SITE_ORIGIN}${page}`,
    page_referrer: referrer,
    page_title: page === "/dashboard" ? "Dashboard — Lumipic" : getPageSeo(page).title,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  if (getPageSeo(page).canonical) target.gtag("event", "page_view");
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.append(script);
  if (getPageSeo(page).canonical) {
    void import("web-vitals").then(({ onCLS, onINP, onLCP }) => {
      const report = (metric: Metric) => target.gtag?.("event", "web_vitals", metricParameters(metric));
      onCLS(report); onINP(report); onLCP(report);
    }).catch(() => { /* Measurement must not interrupt the app. */ });
  }
}

export function trackAlbumCreated() {
  // Record success only, with no album names, IDs, Drive links or credentials.
  (window as AnalyticsWindow).gtag?.("event", "album_created", {
    page_location: `${SITE_ORIGIN}/dashboard`, page_title: "Dashboard — Lumipic",
  });
}
