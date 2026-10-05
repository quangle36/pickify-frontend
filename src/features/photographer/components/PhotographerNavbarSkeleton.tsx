import { Skeleton } from "@/components/ui/skeleton";

export function PhotographerNavbarSkeleton() {
  return (
    <header
      role="status"
      aria-label="Đang tải thông tin tài khoản"
      aria-busy="true"
      className="sticky top-0 z-30 border-b border-stone-200 bg-white/95"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="hidden space-y-1.5 sm:block">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-2.5 w-28" />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="hidden h-9 w-32 rounded-xl sm:block" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>
    </header>
  );
}
