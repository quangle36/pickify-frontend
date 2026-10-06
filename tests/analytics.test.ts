import { afterEach, describe, expect, it, vi } from "vitest";
import { analyticsPage, initAnalytics, metricParameters, trackAlbumCreated } from "../src/lib/analytics/analytics";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("analytics boundaries", () => {
  it("normalizes private owner routes and excludes guest URLs and unknown pages", () => {
    expect(analyticsPage("/dashboard/album/private-id")).toBe("/dashboard");
    expect(analyticsPage("/huong-dan/gui-anh-google-drive")).toBe("/huong-dan/gui-anh-google-drive");
    expect(analyticsPage("/album/private-share-id")).toBeNull();
    expect(analyticsPage("/missing")).toBeNull();
  });
  it("does not initialize without a Measurement ID", () => {
    vi.stubEnv("PROD", true); vi.stubEnv("VITE_GA_MEASUREMENT_ID", "");
    vi.stubGlobal("location", { pathname: "/", origin: "https://lumipic.space" });
    expect(() => initAnalytics()).not.toThrow(); // No window/document access or script request.
  });
  it("does not send local traffic even if an ID is configured", () => {
    vi.stubEnv("PROD", true); vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-TEST123");
    vi.stubGlobal("location", { pathname: "/", origin: "http://localhost:5184" });
    expect(() => initAnalytics()).not.toThrow();
  });
  it("reports creation with a normalized location and no album data", () => {
    const gtag = vi.fn(); vi.stubGlobal("window", { gtag });
    trackAlbumCreated();
    expect(gtag).toHaveBeenCalledWith("event", "album_created", {
      page_location: "https://lumipic.space/dashboard", page_title: "Dashboard — Lumipic",
    });
  });
  it("keeps raw CLS and scales only the integer GA event value", () => {
    expect(metricParameters({name:"CLS",value:0.025,delta:0.025,id:"test",rating:"good",entries:[],navigationType:"navigate"})).toMatchObject({metric_value:0.025,value:25});
  });
});
