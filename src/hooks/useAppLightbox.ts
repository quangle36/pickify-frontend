import { useCallback, useState } from "react";
import { useApiData } from "@/lib/apiQueries";
import type { Photo } from "@/types";

export function useAppLightbox(albumId?: string) {
  const store = useApiData();
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null);
  const close = useCallback(() => setLightbox(null), []);

  return {
    open: (photos: Photo[], index: number) => setLightbox({ photos, index }),
    close,
    props: {
      photos: lightbox?.photos.map(
        (photo) => store.getPhotos(photo.albumId).find((live) => live.id === photo.id) ?? photo,
      ) ?? [],
      currentIndex: lightbox?.index ?? 0,
      isOpen: !!lightbox,
      onClose: close,
      onNavigate: (index: number) => setLightbox((value) => value && { ...value, index }),
      onToggleSelection: (id: string, selected: boolean) => {
        if (albumId) void store.toggleHeart(albumId, id, !selected);
      },
    },
  };
}
