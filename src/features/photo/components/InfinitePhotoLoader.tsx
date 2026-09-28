import { useEffect, useRef } from "react";
import { LoaderCircle } from "lucide-react";
import { useAppStore } from "@/app/stores/app.store";

interface InfinitePhotoLoaderProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => Promise<unknown>;
}

export function InfinitePhotoLoader({
  hasMore,
  loading,
  onLoadMore,
}: InfinitePhotoLoaderProps) {
  const report = useAppStore((state) => state.report);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(onLoadMore);
  const inFlightRef = useRef(false);

  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || inFlightRef.current) return;
        inFlightRef.current = true;
        void loadMoreRef
          .current()
          .catch(report)
          .finally(() => {
            inFlightRef.current = false;
          });
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, report]);

  if (!hasMore) return null;
  return (
    <div
      ref={sentinelRef}
      role="status"
      aria-label="Đang tải thêm ảnh"
      className="flex min-h-20 items-center justify-center gap-2 p-6 text-sm text-stone-500"
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      <span className={loading ? "" : "sr-only"}>Đang tải thêm ảnh…</span>
    </div>
  );
}
