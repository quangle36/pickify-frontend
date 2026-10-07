import path from "path";
import { readFile } from "node:fs/promises";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { publicPages } from "./src/app/seo";
export default defineConfig(({ mode, command }) => {
  const env =
    command === "serve"
      ? loadEnv(mode, __dirname, "WEB_")
      : {};
  const origin = new URL(env.WEB_ORIGIN || "http://localhost:5184");
  return {
    plugins: [react(), {
      name: "public-page-preview",
      configurePreviewServer(server) {
        // Only the explicit application routes below may use the SPA shell.
        server.config.appType = "mpa";
        server.middlewares.use((req, res, next) => {
          const url = new URL(req.url || "/", "http://localhost");
          const pathname = url.pathname.replace(/\/+$/, "") || "/";
          const alias = url.pathname === "/home.html" ? "/" : Object.entries(publicPages).find(([, page]) => `/${page.file}` === url.pathname)?.[0];
          if (alias !== undefined || pathname !== url.pathname) {
            res.statusCode = 308;
            res.setHeader("Location", `${alias ?? pathname}${url.search}`);
            res.end();
            return;
          }
          const page = publicPages[pathname as keyof typeof publicPages];
          if (page) req.url = `/${page.file}${url.search}`;
          else if (/^\/dashboard(?:\/(?:sign-in|sign-up|admin|album\/[^/]+))?$/.test(pathname) || /^\/album\/[^/]+$/.test(pathname) || pathname === "/app.html") {
            res.setHeader("X-Robots-Tag", "noindex, nofollow");
            req.url = "/app.html";
          } else if (!pathname.startsWith("/assets/") && !pathname.startsWith("/images/") && !["/robots.txt", "/sitemap.xml", "/404.html", "/favicon.png", "/favicon.ico", "/apple-touch-icon.png"].includes(pathname)) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.setHeader("X-Robots-Tag", "noindex, nofollow");
            void readFile(path.resolve(__dirname, "dist/404.html")).then((html) => res.end(html), next);
            return;
          }
          next();
        });
      },
    }],
    build: { manifest: true },
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
    server: {
      port: Number(origin.port || 5184),
      strictPort: true,
      host: origin.hostname,
      proxy: {
        "/album": {
          target: process.env.PICKIFY_API_TARGET || "http://localhost:3001",
          changeOrigin: false,
        },
        "/api": {
          target: process.env.PICKIFY_API_TARGET || "http://localhost:3001",
          changeOrigin: false,
        },
      },
    },
  };
});
