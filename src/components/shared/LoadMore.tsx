import { useState } from "react";
import { useApiData } from "@/lib/apiQueries";
export function LoadMore({ albumId }: { albumId: string }) {
  const store = useApiData();
  const [pending, setPending] = useState(false);
  if (!store.hasMore(albumId)) return null;
  return (
    <div className="p-6 text-center">
      <button
        disabled={pending}
        className="rounded-xl bg-white text-stone-900 border px-6 py-3"
        onClick={async () => {
          setPending(true);
          try {
            await store.loadPhotos(albumId);
          } catch (e) {
            store.report(e);
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
