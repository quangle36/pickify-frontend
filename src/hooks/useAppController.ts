import { useApiData } from "@/lib/apiQueries";
import type { ViewRole } from "@/types";
import { useAppActions } from "./useAppActions";
import { useAppEffects } from "./useAppEffects";
import { useAppLightbox } from "./useAppLightbox";

interface AppRoute {
  pathname: string;
  currentRole: ViewRole;
  selectedAlbumId: string;
  isDetailView: boolean;
}

export function useAppController(route: AppRoute) {
  const store = useApiData();
  const profile = store.getProfile();
  const albums = store.getAlbums();
  const selectedAlbum = albums.find((album) => album.id === route.selectedAlbumId);
  const album = route.currentRole === "photographer" && route.isDetailView
    ? selectedAlbum
    : (selectedAlbum ?? albums[0]);
  const actions = useAppActions();
  const lightbox = useAppLightbox(album?.id);
  useAppEffects({ ...route, album, closeLightbox: lightbox.close });

  return {
    pending: store.pending,
    error: store.error,
    profile,
    albums,
    album,
    photos: album ? store.getPhotos(album.id) : [],
    verified: album ? store.isGuestVerified(album.shareId) : false,
    actions,
    lightbox,
    openGuestDemo: () => { if (album) actions.openGuest(album.shareId); },
  };
}

export type AppController = ReturnType<typeof useAppController>;
