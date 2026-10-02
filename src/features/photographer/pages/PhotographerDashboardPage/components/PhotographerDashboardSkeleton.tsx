import { Skeleton } from "@/components/ui/skeleton";
import { CreateAlbumCard } from "./CreateAlbumCard";

interface PhotographerDashboardSkeletonProps {
  onCreateAlbum?: () => void;
}

export function PhotographerDashboardSkeleton({ onCreateAlbum }: PhotographerDashboardSkeletonProps) {
  return (
    <main
      role="status"
      aria-label="Đang tải dữ liệu dashboard"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-8"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-7 sm:gap-5">
        <div>
          <h1 className="text-xl font-semibold leading-[1.4] text-stone-900">Album của bạn</h1>
          <p className="mt-[5px] text-xs text-stone-500">Đang tải album…</p>
        </div>
        {onCreateAlbum && <div className="w-full sm:w-auto"><CreateAlbumCard onCreate={onCreateAlbum} /></div>}
      </div>
      <section className="grid grid-cols-1 items-stretch gap-5 min-[701px]:grid-cols-2 min-[701px]:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-[18px] w-[70%]" />
              <Skeleton className="h-3 w-[55%]" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
