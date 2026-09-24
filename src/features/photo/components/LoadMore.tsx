import { useState } from "react";
import { useAppStore } from "@/app/stores/app.store";

interface LoadMoreProps {
  hasMore: boolean;
  onLoadMore: () => Promise<unknown>;
}

export function LoadMore({ hasMore, onLoadMore }: LoadMoreProps) {
  const report = useAppStore((state) => state.report);
  const [pending, setPending] = useState(false);
  if (!hasMore) return null;
  return (
    <div className="p-6 text-center">
      <button
        disabled={pending}
        className="rounded-xl bg-white text-stone-900 border px-6 py-3"
        onClick={async () => {
          setPending(true);
          try {
            await onLoadMore();
          } catch (e) {
            report(e);
          } finally {
            setPending(false);
          }
        }}
      >
        {pending ? "Đang tải…" : "Tải thêm ảnh"}
      </button>
    </div>
  );
}
