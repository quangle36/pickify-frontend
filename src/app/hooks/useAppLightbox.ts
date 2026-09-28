import { useCallback, useState } from "react";
import type { Photo } from "@/features/photo/types/photo.types";

export function useAppLightbox(
  albumId: string | undefined,
  totalPhotos: number,
  livePhotos: Photo[],
  toggleSelection: (
    albumId: string,
    photoId: string,
    selected: boolean,
  ) => Promise<boolean>,
) {
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null);
  const close = useCallback(() => setLightbox(null), []);

  return {
    open: (photos: Photo[], index: number) => setLightbox({ photos, index }),
    close,
    props: {
      photos: lightbox?.photos.map(
        (photo) => livePhotos.find((live) => live.id === photo.id) ?? photo,
      ) ?? [],
      totalPhotos,
      currentIndex: lightbox?.index ?? 0,
      isOpen: !!lightbox,
      onClose: close,
      onNavigate: (index: number) => setLightbox((value) => value && { ...value, index }),
      onToggleSelection: (id: string, selected: boolean) => {
        if (albumId) void toggleSelection(albumId, id, !selected);
      },
    },
  };
}
