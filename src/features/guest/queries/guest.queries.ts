import { useQuery } from "@tanstack/react-query";
import type { Album } from "@/features/photographer/types/album.types";
import { guestService } from "../services/guest.service";
import { guestKeys } from "./guest.key";

export function useGuestAlbumQuery(shareId: string | null) {
  return useQuery({
    queryKey: guestKeys.album(shareId),
    enabled: !!shareId,
    queryFn: async ({ signal }) => {
      const metadata = await guestService.getAlbum(shareId!, signal);
      return {
        ...metadata,
        id: shareId!,
        status: "ready",
        coverUrl: "",
        totalPhotos: 0,
        importedPhotos: 0,
        selectedPhotosCount: 0,
        selectionLimit: metadata.selectionLimit ?? null,
        guestSessionCount: 0,
        folderUrl: "",
        folderId: "",
        createdAt: "",
        expiresAt: null,
      } as Album;
    },
  });
}
