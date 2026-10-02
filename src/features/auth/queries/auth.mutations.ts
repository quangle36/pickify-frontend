import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/app/stores/app.store";
import { usePhotoStore } from "@/features/photo/stores/photo.store";
import { useAlbumStore } from "@/features/photographer/stores/album.store";
import { authService } from "../services/auth.service";
import { authKeys } from "./auth.key";

export function useEmailAuthMutation(mode: "sign-in" | "sign-up") {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { email: string; password: string; name?: string }) =>
      authService.authenticateEmail(input, mode),
    onSuccess: async () => {
      const profile = await authService.getCurrentUser();
      client.setQueryData(authKeys.owner, profile);
    },
  });
}

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
