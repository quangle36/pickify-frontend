# Lumipic frontend

React/Vite UI connected to the Fastify API.

- `pnpm --dir pickify-backend dev` (or `dev:api`) starts both the API and the worker. The worker is required for album import and permanent cleanup.
- `pnpm --dir pickify-backend dev:api-only` starts only the API for isolated debugging; album import and cleanup will remain queued.
- `pnpm --dir pickify-frontend dev` serves the UI on the `WEB_ORIGIN` port (5184 by default) and proxies `/api` to port 3001.
- `pnpm --dir pickify-frontend build` builds the frontend.
- `PICKIFY_API_TARGET` can override the local proxy target.

Dashboard and guest pages use authenticated API requests; the old in-memory store and demo toolbar have been removed. The landing page's interactive illustration remains a static product example.

## Public page SEO

The global loading overlay lives in `GlobalLoadingProvider` above the route outlet. Route and Suspense indicators register loading requests so auth, module, and album-loading handoffs preserve the spinner DOM and animation. Run `pnpm exec playwright install chromium` once, then `pnpm test:loading` for the production-build navigation regression check (mocked API, normal/reduced motion, and unauthenticated redirect).

`pnpm build` renders `/`, `/privacy`, `/terms`, and `/huong-dan/gui-anh-google-drive` into static HTML using the same React components, and generates `dist/robots.txt` and `dist/sitemap.xml`. Titles, descriptions and canonical URLs share the policy in `src/app/seo.ts`; the canonical origin is `https://lumipic.space`. Vercel rewrites the public routes to `home.html`, `privacy.html`, `terms.html`, and `gui-anh-google-drive.html`. `pnpm preview` applies the same public route mapping, permanent redirects for HTML aliases and trailing slashes, and HTTP 404 for unknown routes. Vercel falls back to the React shell only for known dashboard routes; `404.html` uses the existing 404 page. Public pages hydrate with the same `PublicPage` tree used at build time, while private routes load a separate application entry.

`dist/index.html` remains the empty React shell used by dashboard routes and the API's album preview renderer. It includes `noindex` from the initial HTML; Vercel also sends `X-Robots-Tag` for dashboard and album URLs. Do not rewrite the public home route to this shell or apply its `noindex` response header to public HTML. The nginx example mirrors these routes. Robots allows private page crawling so Google can read `noindex`, while excluding `/api/`; private URLs are absent from the sitemap.

`pnpm build` validates the generated HTML and fails if an insertion point, H1, canonical or FAQ answer is missing. Run `pnpm test:seo` after building for negative build-validation tests and HTTP checks against the preview server (including redirects, unknown paths, sitemap and private routes).

After deployment, inspect raw HTML at `/`, `/privacy`, `/terms`, and `/dashboard/sign-in`, confirm `/robots.txt` and `/sitemap.xml` return their files, and verify album previews still use the shell without landing content. Submit `https://lumipic.space/sitemap.xml` in Google Search Console and inspect the home URL. The static HTML improves crawlability; indexing is determined by Google.

## Album link previews (Messenger / Zalo)

Vercel rewrites `/album/:shareId` to Fastify before the SPA fallback. The local Vite proxy and the nginx deployment snippet use the same route. Fastify fetches the frontend's `/index.html` (cached for 60 seconds), inserts per-album Open Graph metadata, and returns the original React shell. `/index.html` must remain publicly reachable without authentication or redirects; set backend `WEB_ORIGIN` to the frontend origin and `API_ORIGIN` to the API origin. If the API deployment hostname changes, update both API and album rewrites in `vercel.json`.

Available albums always publish their title and first successfully imported photo in link previews, including existing albums with the legacy `sharePreviewEnabled` database value set to false. The legacy API field remains accepted for older clients but is ignored on updates and returned as true. The settings switch has been removed. Both selection and view-only links use only the album name as the title, with no description metadata. Default description and Twitter metadata from the frontend shell are removed. If no cover is available or storage cannot serve it, previews use a neutral Lumipic JPEG. Custom cover selection and custom share copy are not part of this implementation.

Preview JPEGs are served at `/api/public/albums/:shareId/preview.jpg`, resized to 1200×630 and backed by a server-side storage read rather than an expiring signed URL. Each request checks album availability. HTML/images use `no-store` and album pages use `noindex`; these headers cannot remove previews already cached by Messenger or Zalo. The image URL version changes when the published album metadata/cover changes.

After deploying, check the raw HTML of an album link, verify the OG image URL responds with `image/jpeg`, and test fresh links in Messenger and Zalo (including `?mode=view`). Re-scrape with Facebook Sharing Debugger when needed. Verify existing albums, name-only titles and absent descriptions, missing covers, expiry and deletion; template fetch failures return 503 with Retry-After rather than a broken React shell.

## Drive selection guide

`/huong-dan/gui-anh-google-drive` is a public, prerendered seven-step guide linked from the landing navigation and footer. Copy and screenshot metadata live under `src/features/landing/pages/DriveSelectionGuidePage/`. The six JPEG screenshots in `public/images/guides/gui-anh-google-drive/` were captured from the local UI using the existing `grad 3` album, plus a create-album form that was canceled without submission. The guest screenshot shows the password entry screen; no album password is embedded. Retake screenshots when the workflow changes. The SEO HTTP check verifies the guide, its canonical, redirects, and every image response.

SEO/GA4/Search Console setup: [docs/seo-measurement.md](docs/seo-measurement.md).

## Báo giá

`/dashboard/quotes` is an authenticated quotation editor linked from the photographer navigation. It supports a minimal theme, custom studio/logo, days and services, live totals, and PNG export at 1600 px wide. Drafts are stored only in this browser under `lumipic:quotation:v1:<ownerId>`; there is no server persistence or cross-device sync. A storage failure does not prevent editing or export.

Form data and draft validation live in the `quotation` feature. The editor follows the Studio Split layout: a 440 px sidebar with collapsible form sections, a dotted canvas, zoom/Fit/100% controls and a pinned export header. Both the editor and exported document use `ui-sans-serif, system-ui, sans-serif`. Optional quotation codes are supported; older drafts without codes still restore. The theme registry shares a renderer between the scaled preview and export, so adding a theme does not require duplicating form logic. Exports use a frozen validated snapshot with system fonts and a locally embedded logo. Vite preview, Vercel and the nginx example explicitly serve this route through `app.html` with `noindex`.
