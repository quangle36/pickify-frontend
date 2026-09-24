import { Skeleton } from "@/components/ui/skeleton";
import { CreateAlbumCard } from "./CreateAlbumCard";

interface PhotographerDashboardSkeletonProps {
  onCreateAlbum?: () => void;
}

export function PhotographerDashboardSkeleton({
  onCreateAlbum,
}: PhotographerDashboardSkeletonProps) {
  return (
    <main
      role="status"
      aria-label="Đang tải dữ liệu dashboard"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8"
    >
      <section className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
        {onCreateAlbum ? (
          <CreateAlbumCard onCreate={onCreateAlbum} />
        ) : (
          <Skeleton className="min-h-[360px] rounded-3xl" />
        )}
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="min-h-[360px] overflow-hidden rounded-3xl border border-stone-200 bg-white"
          >
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </section>
      <Skeleton className="h-14 w-full rounded-2xl" />
    </main>
  );
}
