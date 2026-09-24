import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/app/stores/app.store";
import { usePhotoStore } from "@/features/photo/stores/photo.store";
import { useAlbumStore } from "@/features/photographer/stores/album.store";
import { authService } from "../services/auth.service";

export function useLogoutMutation() {
  const client = useQueryClient();
  const resetApp = useAppStore((state) => state.reset);
  const resetAlbums = useAlbumStore((state) => state.reset);
  const resetPhotos = usePhotoStore((state) => state.reset);
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      resetApp();
      resetAlbums();
      resetPhotos();
      client.clear();
    },
  });
}
