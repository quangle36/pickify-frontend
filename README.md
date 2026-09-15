# Pickify frontend

React/Vite UI connected to the Fastify API. Install dependencies and run commands from the parent workspace; see [backend setup and tests](../README.md).

- `pnpm --dir pickify-frontend dev` serves the UI on port 5173 and proxies `/api` to port 3001.
- `pnpm --dir pickify-frontend build` builds the frontend.
- `PICKIFY_API_TARGET` can override the local proxy target.

Dashboard and guest pages use authenticated API requests; the old in-memory store and demo toolbar have been removed. The landing page's interactive illustration remains a static product example.
