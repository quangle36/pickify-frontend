# Pickify frontend

React/Vite UI connected to the Fastify API.

- `pnpm --dir pickify-backend dev` (or `dev:api`) starts both the API and the worker. The worker is required for album import and permanent cleanup.
- `pnpm --dir pickify-backend dev:api-only` starts only the API for isolated debugging; album import and cleanup will remain queued.
- `pnpm --dir pickify-frontend dev` serves the UI on the `WEB_ORIGIN` port (5184 by default) and proxies `/api` to port 3001.
- `pnpm --dir pickify-frontend build` builds the frontend.
- `PICKIFY_API_TARGET` can override the local proxy target.

Dashboard and guest pages use authenticated API requests; the old in-memory store and demo toolbar have been removed. The landing page's interactive illustration remains a static product example.

## Album link previews (Messenger / Zalo)

Vercel rewrites `/album/:shareId` to Fastify before the SPA fallback. The local Vite proxy and the nginx deployment snippet use the same route. Fastify fetches the frontend's `/index.html` (cached for 60 seconds), inserts per-album Open Graph metadata, and returns the original React shell. `/index.html` must remain publicly reachable without authentication or redirects; set backend `WEB_ORIGIN` to the frontend origin and `API_ORIGIN` to the API origin. If the API deployment hostname changes, update both API and album rewrites in `vercel.json`.

Apply backend migration `202610020001_album_share_preview` before deploying the API (`pnpm --dir pickify-backend db:migrate`), then deploy the frontend rewrites/settings. No existing albums opt in automatically. In album settings, enable **Hiển thị tên và ảnh bìa khi chia sẻ** to publish the album title and first successfully imported photo in the preview. Disabled previews use a neutral Pickify JPEG and title, including for view-only links. Custom cover selection and custom share copy are not part of this implementation.

Preview JPEGs are served at `/api/public/albums/:shareId/preview.jpg`, resized to 1200×630 and backed by a server-side storage read rather than an expiring signed URL. Each request checks album availability and the current opt-in setting. HTML/images use `no-store` and album pages use `noindex`; these headers cannot remove previews already cached by Messenger or Zalo. The image URL version changes when the published album metadata/cover changes.

After deploying, check the raw HTML of an album link, verify the OG image URL responds with `image/jpeg`, and test fresh links in Messenger and Zalo (including `?mode=view`). Re-scrape with Facebook Sharing Debugger when needed. Verify opt-out, expiry and deletion; template fetch failures return 503 with Retry-After rather than a broken React shell.
