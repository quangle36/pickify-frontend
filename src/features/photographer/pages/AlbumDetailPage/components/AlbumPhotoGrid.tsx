import { startTransition, useEffect, useRef, useState } from "react";
import type { Photo } from "@/features/photo/types/photo.types";
import { PhotoCard } from "./PhotoCard";

interface AlbumPhotoGridProps {
  photos: Photo[];
  className: string;
  onOpenLightbox: (photos: Photo[], index: number) => void;
}

const PHOTO_BATCH_SIZE = 48;

export function AlbumPhotoGrid({
  photos,
  className,
  onOpenLightbox,
}: AlbumPhotoGridProps) {
  // Cached albums can contain hundreds of photos. Mount only the first batch
  // on a filter change so the tab animation does not wait for the entire grid.
  const [visibleCount, setVisibleCount] = useState(PHOTO_BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = visibleCount < photos.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        startTransition(() => {
          setVisibleCount((count) => count + PHOTO_BATCH_SIZE);
        });
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, visibleCount]);

  return (
    <>
      <div className={className}>
        {photos.slice(0, visibleCount).map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => onOpenLightbox(photos, index)}
          />
        ))}
      </div>
      {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}
    </>
  );
}
