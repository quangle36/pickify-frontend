import { Skeleton } from "@/components/ui/skeleton";

export function AlbumPhotoGridSkeleton({ className }: { className: string }) {
  return (
    <div role="status" aria-busy="true" aria-label="Đang tải ảnh album">
      <span className="sr-only">Đang tải ảnh album…</span>
      <div className={className} aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <Skeleton
            key={index}
            className="aspect-[9/16] rounded-2xl border border-stone-200/90"
          />
        ))}
      </div>
    </div>
  );
}
