import { renderHtml } from "./seo-html.mjs";
import { readFile, writeFile, rm } from "node:fs/promises";
import { publicPages, getPageSeo, renderPage, SITE_ORIGIN } from "../.prerender/prerender.js";

const template = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
await writeFile(new URL("../dist/app.html", import.meta.url), template);
// Start public hydration dependencies while the browser parses the HTML.
const manifest = JSON.parse(await readFile(new URL("../dist/.vite/manifest.json", import.meta.url), "utf8"));
const publicEntry = Object.entries(manifest).find(([key]) => key.endsWith("app/mountPublic.tsx"))?.[0];
if (!publicEntry) throw new Error("Missing public hydration entry in Vite manifest");
const preloadFiles = new Set();
function collectImports(key) {
  const chunk = manifest[key];
  if (preloadFiles.has(chunk.file)) return;
  preloadFiles.add(chunk.file);
  for (const dependency of chunk.imports || []) collectImports(dependency);
}
collectImports(publicEntry);
const publicTemplate = template.replace("</head>", [...preloadFiles].filter(file => !template.includes(`href="/${file}"`)).map(file => `<link rel="modulepreload" crossorigin href="/${file}" />`).join("\n") + "</head>");
for (const [pathname, page] of Object.entries(publicPages)) {
  // The landing page self-hosts its fonts (LandingPage.css); avoid loading unused Google Fonts.
  const pageTemplate = pathname === "/" ? publicTemplate.replace(/<link\b[^>]*href="https:\/\/(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>/g, "") : publicTemplate;
  const html = renderHtml(pageTemplate, renderPage(pathname), getPageSeo(pathname), pathname);
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
