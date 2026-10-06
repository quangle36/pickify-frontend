import { getPageSeo } from "./seo";

export function applyPublicSeo(pathname: string) {
  const seo = getPageSeo(pathname);
  if (!("socialImage" in seo)) return;
  const tags = {
    "og:type": "website", "og:site_name": "Lumipic", "og:locale": "vi_VN",
    "og:title": seo.title, "og:description": seo.description,
    "og:url": seo.canonical, "og:image": seo.socialImage,
    "og:image:width": "1200", "og:image:height": "630",
    "og:image:alt": "Lumipic — chọn ảnh nhanh từ Google Drive",
    "twitter:card": "summary_large_image", "twitter:title": seo.title,
    "twitter:description": seo.description, "twitter:image": seo.socialImage,
  };
  for (const [name, content] of Object.entries(tags)) {
    const attribute = name.startsWith("og:") ? "property" : "name";
    let meta = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
    if (!meta) { meta = document.createElement("meta"); meta.setAttribute(attribute, name); document.head.append(meta); }
    meta.content = content;
  }
  let schema = document.querySelector<HTMLScriptElement>('script[data-website-schema]');
  if (seo.websiteSchema) {
    if (!schema) {
      schema = document.createElement("script"); schema.type = "application/ld+json";
      schema.dataset.websiteSchema = ""; document.head.append(schema);
    }
    schema.textContent = JSON.stringify(seo.websiteSchema);
  } else schema?.remove();
}
