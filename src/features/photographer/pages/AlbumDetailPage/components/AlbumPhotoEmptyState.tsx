import { Images, RefreshCw, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { apiMessages } from "@/api/errors";
import type { Album } from "@/features/photographer/types/album.types";

export function AlbumPhotoEmptyState({ album }: { album: Album }) {
  const scanning = album.status === "scanning";
  const processing = scanning || album.status === "importing";
  const failed = album.status === "needs_attention";
  const Icon = processing ? RefreshCw : failed ? AlertCircle : Images;
  return <Card className="rounded-2xl p-12 text-center border border-stone-200 shadow-xs space-y-3 bg-white max-w-md mx-auto my-8" role={processing ? "status" : failed ? "alert" : undefined}>
    <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-500">
      <Icon className={`w-6 h-6 ${processing ? "animate-spin" : ""}`} aria-hidden="true" />
    </div>
    <h3 className="text-sm font-bold text-stone-900">{scanning ? "Đang quét ảnh từ Google Drive…" : processing ? "Đang tạo preview cho album…" : failed ? "Chưa thể nhập ảnh" : "Không có ảnh nào phù hợp"}</h3>
    <p className="text-xs text-stone-500">
      {scanning ? "Đang đọc danh sách ảnh trong thư mục Drive. Ảnh sẵn sàng sẽ tự động xuất hiện tại đây." : processing ? `Đã nhập ${album.importedPhotos}/${album.totalPhotos} ảnh. Ảnh sẵn sàng sẽ tự động xuất hiện tại đây.` : failed ? (apiMessages[album.errorMessage ?? ""] ?? album.errorMessage ?? "Quá trình nhập ảnh chưa hoàn tất. Về danh sách album để thử nhập lại.") : "Thử thay đổi bộ lọc ảnh hoặc từ khóa tìm kiếm của bạn."}
    </p>
  </Card>;
}
