import { Skeleton } from "@/components/ui/skeleton";

export function GuestAlbumSkeleton() {
  return (
    <div
      role="status"
      aria-label="Đang tải album"
      aria-busy="true"
      className="guest-album min-h-screen w-full space-y-6 bg-background px-4 py-5 md:px-6 md:py-6"
    >
      <div className="mx-auto flex max-w-[1392px] items-center justify-between">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-24" />
      </div>
      <Skeleton className="mx-auto h-[420px] w-full max-w-[1392px] rounded-xl md:h-[480px]" />
      <Skeleton className="mx-auto h-11 w-full max-w-[1392px]" />
      <div className="mx-auto grid max-w-[1392px] grid-cols-2 gap-3 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="aspect-[3/4] rounded-xl md:aspect-[3/2]" />
        ))}
      </div>
    </div>
  );
}
