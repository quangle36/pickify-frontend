import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(({ mode, command }) => {
  const env =
    command === "serve"
      ? loadEnv(mode, __dirname, "WEB_")
      : {};
  const origin = new URL(env.WEB_ORIGIN || "http://localhost:5184");
  return {
    plugins: [react()],
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
