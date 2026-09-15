import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useApiData } from "@/lib/apiQueries";
import type { Album, ViewRole } from "@/types";

interface AppEffectsOptions {
  pathname: string;
  currentRole: ViewRole;
  isDetailView: boolean;
  album: Album | undefined;
  closeLightbox: () => void;
}

export function useAppEffects({ pathname, currentRole, isDetailView, album, closeLightbox }: AppEffectsOptions) {
  const store = useApiData();
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
      store.report(
        new Error(
          authError === "OAUTH_DENIED"
            ? "Bạn đã hủy đăng nhập Google. Hãy thử lại khi sẵn sàng."
            : "Không thể đăng nhập Google. Vui lòng thử lại.",
        ),
      );
      void navigate({ to: "/", replace: true, search: {} });
    }
  }, [navigate, store]);
  const albumId = album?.id;
  const albumStatus = album?.status;
  useEffect(() => {
    store.setPhotoTarget(
      currentRole === "photographer" &&
        isDetailView &&
        albumId &&
        ["scanning", "importing", "ready", "needs_attention"].includes(
          albumStatus ?? "",
        )
        ? { id: albumId, status: albumStatus! }
        : null,
    );
  }, [albumId, albumStatus, currentRole, isDetailView, store.setPhotoTarget]);
}
