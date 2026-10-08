import { describe, expect, it } from "vitest";
import { getPageSeo, HOME_TITLE } from "../src/app/seo";

describe("page SEO policy", () => {
  it("uses the approved home title and a canonical without query parameters", () => {
    expect(getPageSeo("/")).toMatchObject({
      title: HOME_TITLE,
      canonical: "https://lumipic.space/",
      robots: "index,follow",
    });
  });

  it("gives legal pages their own metadata and normalizes trailing slashes", () => {
    expect(getPageSeo("/privacy/")).toMatchObject({
      title: "Chính sách quyền riêng tư - Lumipic",
      canonical: "https://lumipic.space/privacy",
      robots: "index,follow",
    });
    expect(getPageSeo("/terms").canonical).toBe("https://lumipic.space/terms");
  });

  it("makes only the sign-in page public inside the dashboard namespace", () => {
    expect(getPageSeo("/dashboard/sign-in")).toMatchObject({title: "Đăng nhập - Lumipic", canonical: "https://lumipic.space/dashboard/sign-in", robots: "index,follow"});
  });

  it.each(["/dashboard", "/dashboard/sign-up", "/dashboard/quotes", "/dashboard/album/123", "/album/private-album", "/missing"])(
    "keeps %s out of search and removes the public canonical",
    (path) => {
      expect(getPageSeo(path)).toMatchObject({ canonical: null, robots: "noindex,nofollow", description: "" });
    },
  );
});
