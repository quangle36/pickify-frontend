import { applyPublicSeo } from "../applyPublicSeo";
import { useEffect } from "react";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { getPageSeo, SITE_ORIGIN } from "../seo";

export function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isNotFound = useRouterState({
    select: (state) => state.matches.some((match) => match._notFound || match.status === "notFound"),
  });
  useEffect(() => {
    const seo = getPageSeo(pathname);
    applyPublicSeo(pathname);
    // Album titles are supplied by the API and album effects.
    if (isNotFound) document.title = "Không tìm thấy trang — Lumipic";
    else if (!pathname.startsWith("/album/")) document.title = seo.title;
    for (const [name, content] of [["description", seo.description], ["robots", seo.robots]]) {
      let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!content) {
        meta?.remove();
        continue;
      }
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.append(meta);
      }
      meta.content = content;
    }
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonicalUrl = seo.canonical || (pathname.startsWith("/album/") ? `${SITE_ORIGIN}${pathname}` : null);
    if (canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.append(canonical);
      }
      canonical.href = canonicalUrl;
    } else {
      canonical?.remove();
    }
  }, [pathname, isNotFound]);
  return <Outlet />;
}
