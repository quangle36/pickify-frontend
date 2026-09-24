import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAppStore } from "../stores/app.store";
import type { Album } from "@/features/photographer/types/album.types";
import type { ViewRole } from "../app.types";

interface AppEffectsOptions {
  pathname: string;
  currentRole: ViewRole;
  isDetailView: boolean;
  album: Album | undefined;
  closeLightbox: () => void;
}

export function useAppEffects({ pathname, currentRole, isDetailView, album, closeLightbox }: AppEffectsOptions) {
  const report = useAppStore((state) => state.report);
  const navigate = useNavigate();
  useEffect(() => {
    closeLightbox();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, closeLightbox]);
  useEffect(() => {
    if (new URLSearchParams(location.search).has("dashboard")) {
      void navigate({ to: "/dashboard", replace: true, search: {} });
    }
  }, [navigate]);
  useEffect(() => {
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.append(robots);
    }
    const isPrivateRoute = currentRole !== "landing";
    robots.content = isPrivateRoute ? "noindex,nofollow" : "index,follow";
    document.title =
      currentRole === "landing"
        ? "Pickify — Chọn ảnh từ Google Drive"
        : isDetailView && album
          ? `${album.title} — Pickify`
          : currentRole === "guest" && album
            ? `${album.title} — Pickify`
            : "Dashboard — Pickify";
  }, [currentRole, isDetailView, album]);
  useEffect(() => {
    const authError = new URLSearchParams(location.search).get("authError");
    if (authError) {
      report(
        new Error(
          authError === "OAUTH_DENIED"
            ? "Bạn đã hủy đăng nhập Google. Hãy thử lại khi sẵn sàng."
            : "Không thể đăng nhập Google. Vui lòng thử lại.",
        ),
      );
      void navigate({ to: "/", replace: true, search: {} });
    }
  }, [navigate, report]);
}
