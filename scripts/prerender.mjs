import { renderHtml } from "./seo-html.mjs";
import { readFile, writeFile, rm } from "node:fs/promises";
import { publicPages, getPageSeo, renderPage, SITE_ORIGIN } from "../.prerender/prerender.js";

const template = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
for (const [pathname, page] of Object.entries(publicPages)) {
  const html = renderHtml(template, renderPage(pathname), getPageSeo(pathname), pathname);
  await writeFile(new URL(`../dist/${page.file}`, import.meta.url), html);
}
const notFoundSeo = { title: "Không tìm thấy trang — Lumipic", description: "", robots: "noindex,nofollow", canonical: null };
await writeFile(new URL("../dist/404.html", import.meta.url), renderHtml(template, renderPage("/404"), notFoundSeo, "/404"));

const urls = Object.keys(publicPages).map((path) => `  <url><loc>${SITE_ORIGIN}${path}</loc></url>`).join("\n");
await writeFile(new URL("../dist/sitemap.xml", import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
// Keep private page URLs crawlable so Google can read their noindex headers.
await writeFile(new URL("../dist/robots.txt", import.meta.url), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
await rm(new URL("../.prerender", import.meta.url), { recursive: true, force: true });
console.log(`Prerendered ${Object.keys(publicPages).length} public pages; generated robots.txt and sitemap.xml.`);
