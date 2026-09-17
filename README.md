# Pickify frontend

React/Vite UI connected to the Fastify API.

- `pnpm --dir pickify-backend dev` (or `dev:api`) starts both the API and the worker. The worker is required for album import and permanent cleanup.
- `pnpm --dir pickify-backend dev:api-only` starts only the API for isolated debugging; album import and cleanup will remain queued.
- `pnpm --dir pickify-frontend dev` serves the UI on the `WEB_ORIGIN` port (5184 by default) and proxies `/api` to port 3001.
- `pnpm --dir pickify-frontend build` builds the frontend.
- `PICKIFY_API_TARGET` can override the local proxy target.

Dashboard and guest pages use authenticated API requests; the old in-memory store and demo toolbar have been removed. The landing page's interactive illustration remains a static product example.
