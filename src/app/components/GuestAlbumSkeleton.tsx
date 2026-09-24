import { Skeleton } from "@/components/ui/skeleton";

export function GuestAlbumSkeleton() {
  return (
    <div
      role="status"
      aria-label="Đang tải album"
      aria-busy="true"
      className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-24" />
      </div>
      <Skeleton className="h-10 w-2/3" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="aspect-[4/3] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
