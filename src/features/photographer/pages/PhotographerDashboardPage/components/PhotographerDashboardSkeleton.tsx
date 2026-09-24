import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PhotographerDashboardSkeleton() {
  return (
    <main
      role="status"
      aria-label="Đang tải dữ liệu dashboard"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8"
    >
      <Card className="flex flex-col justify-between gap-6 rounded-3xl border-stone-200/90 bg-white p-6 shadow-xs sm:p-8 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-72 rounded-full" />
          <Skeleton className="h-9 w-64" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-4/5 max-w-lg" />
          </div>
        </div>
        <div className="grid shrink-0 grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-24 w-full min-w-24 rounded-2xl sm:min-w-28"
            />
          ))}
        </div>
      </Card>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-full rounded-2xl sm:w-96" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-2xl sm:w-64" />
            <Skeleton className="h-10 w-24 rounded-2xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Card
              key={index}
              className="overflow-hidden rounded-3xl border-stone-200 bg-white"
            >
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-9 flex-1 rounded-xl" />
                  <Skeleton className="h-9 w-20 rounded-xl" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Skeleton className="h-14 w-full rounded-2xl" />
    </main>
  );
}
