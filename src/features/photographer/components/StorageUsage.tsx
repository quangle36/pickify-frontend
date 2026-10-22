import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { PhotographerProfile } from "../types/album.types";

function formatStorage(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const unit = bytes < 1024 ** 2 ? 1 : bytes < 1024 ** 3 ? 2 : 3;
  return `${(bytes / 1024 ** unit).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} ${["B", "KB", "MB", "GB"][unit]}`;
}

export function StorageUsage({ profile }: { profile: Pick<PhotographerProfile,
  "storageBytes" | "storageLimitBytes" | "storageReconciliationRequired"> }) {
  const { storageBytes: used, storageLimitBytes: limit, storageReconciliationRequired } = profile;
  if (storageReconciliationRequired) return (
    <p className="text-sm text-stone-600">Dung lượng đang chờ đối soát. Chưa thể tạo album mới.</p>
  );
  if (used === undefined || limit === undefined) return <Skeleton className="h-12 w-full" aria-label="Đang tải dung lượng" />;
  const remaining = Math.max(0, limit - used);
  const percent = limit > 0 ? Math.min(100, used / limit * 100) : 0;
  return (
    <div className="space-y-2 text-sm text-stone-600">
      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 tabular-nums">
        <span>Đã dùng {formatStorage(used)} / {formatStorage(limit)}</span>
        <span className="font-medium text-stone-900">Còn lại {formatStorage(remaining)}</span>
      </div>
      <Progress value={percent} aria-valuenow={percent}
        className="h-1.5" indicatorColor="bg-stone-900" aria-label="Dung lượng lưu trữ đã dùng" />
      {remaining === 0 && <p>Đã hết dung lượng. Hãy xoá album không còn dùng để giải phóng dung lượng.</p>}
    </div>
  );
}
