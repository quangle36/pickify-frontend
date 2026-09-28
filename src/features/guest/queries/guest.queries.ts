import { useQuery } from "@tanstack/react-query";
import type { Album } from "@/features/photographer/types/album.types";
import { guestService } from "../services/guest.service";
import { guestKeys } from "./guest.key";

export function useGuestAlbumQuery(shareId: string | null, readOnly = false) {
  return useQuery({
    queryKey: guestKeys.album(shareId, readOnly),
    enabled: !!shareId,
    queryFn: async ({ signal }) => {
      const metadata = await guestService.getAlbum(shareId!, readOnly, signal);
      return {
        ...metadata,
        id: shareId!,
        slug: null,
        status: "ready",
        coverUrl: "",
        totalPhotos: 0,
        importedPhotos: 0,
        selectedPhotosCount: 0,
        selectionLimit: metadata.selectionLimit ?? null,
        selectionLocked: metadata.selectionLocked,
        guestSessionCount: 0,
        folderUrl: "",
        folderId: "",
        createdAt: "",
        expiresAt: null,
      } as Album;
    },
    refetchInterval: 10_000,
  });
}
