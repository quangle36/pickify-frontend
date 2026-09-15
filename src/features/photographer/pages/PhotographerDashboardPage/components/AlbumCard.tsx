import { FC, useState, MouseEvent } from "react";
import { Album } from "@/types";
import {
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Heart,
  Clock,
  Copy,
  Check,
  Trash2,
  ChevronRight,
  FileSpreadsheet,
  Lock,
  Eye,
} from "lucide-react";
import { getDaysRemaining } from "@/lib/utils";
import { useApiData } from "@/lib/apiQueries";
import { exportSelectedPhotosToCsv } from "@/lib/exportCsv";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface AlbumCardProps {
  album: Album;
  onSelect: (id: string) => void;
  onOpenGuestView: (shareId: string) => void;
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AlbumCard: FC<AlbumCardProps> = ({
  album,
  onSelect,
  onOpenGuestView,
  onRetry,
  onDelete,
}) => {
  const store = useApiData();
  const [copied, setCopied] = useState(false);
  const daysLeft = getDaysRemaining(album.expiresAt);

  const handleCopy = (e: MouseEvent) => {
    e.stopPropagation();
    const guestUrl = `${window.location.origin}/album/${album.shareId}`;
    navigator.clipboard.writeText(guestUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = (e: MouseEvent) => {
    e.stopPropagation();
    const photos = store.getPhotos(album.id);
    exportSelectedPhotosToCsv(album, photos);
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa album "${album.title}" không? Khách hàng sẽ không thể truy cập nữa.`,
      )
    ) {
      onDelete(album.id);
    }
  };

  const importPercentage =
    album.totalPhotos > 0
      ? Math.round((album.importedPhotos / album.totalPhotos) * 100)
      : 0;

  return (
    <Card
      onClick={() => onSelect(album.id)}
      className="rounded-3xl border-stone-200 shadow-xs hover:shadow-xl hover:border-stone-300 transition-all duration-200 overflow-hidden flex flex-col justify-between group cursor-pointer bg-white"
    >
      {/* Top Media & Status Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* Gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status Badge Top-Left */}
        <div className="absolute top-3 left-3 z-10">
          {album.status === "ready" && (
            <Badge
              variant="success"
              className="gap-1.5 px-3 py-1 shadow-md backdrop-blur-xs bg-emerald-500/95 text-white border-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Sẵn sàng</span>
            </Badge>
          )}

          {album.status === "scanning" && (
            <Badge
              variant="info"
              className="gap-1.5 px-3 py-1 shadow-md backdrop-blur-xs bg-purple-500/95 text-white border-0 animate-pulse"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Đang quét Drive</span>
            </Badge>
          )}

          {album.status === "importing" && (
            <Badge
              variant="info"
              className="gap-1.5 px-3 py-1 shadow-md backdrop-blur-xs bg-blue-500/95 text-white border-0"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>
                Đang nhập ({album.importedPhotos}/{album.totalPhotos})
              </span>
            </Badge>
          )}

          {album.status === "needs_attention" && (
            <Badge
              variant="destructive"
              className="gap-1.5 px-3 py-1 shadow-md backdrop-blur-xs bg-rose-600/95 text-white border-0"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Cần xử lý</span>
            </Badge>
          )}
        </div>

        {["expired", "deleting", "deleted"].includes(album.status) && (
          <Badge className="absolute top-3 left-3">
            {album.status === "expired" ? "Đã hết hạn" : "Đang dọn dữ liệu"}
          </Badge>
        )}
        {/* Expiry Pill Top-Right */}
        <div className="absolute top-3 right-3 z-10">
          <Badge
            variant="outline"
            className="gap-1.5 px-2.5 py-1 bg-stone-900/80 text-stone-200 text-[11px] font-medium backdrop-blur-md border-stone-700/50"
          >
            <Clock className="w-3 h-3 text-stone-400" />
            <span>
              {album.expiresAt
                ? `Còn ${daysLeft} ngày`
                : "30 ngày từ khi sẵn sàng"}
            </span>
          </Badge>
        </div>

        {/* Title and bottom info over image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-extrabold text-base sm:text-lg line-clamp-1 group-hover:text-amber-200 transition-colors">
            {album.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-stone-300 mt-1 font-medium">
            <span>{album.totalPhotos} ảnh</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-rose-400 font-bold">
              <Heart className="w-3.5 h-3.5 fill-rose-400" />
              {album.selectedPhotosCount} đã chọn
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-stone-300 font-mono text-[11px]">
              <Lock className="w-3 h-3 text-stone-400" />
              {"••••"}
            </span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        {/* Progress bar if importing */}
        {album.status === "importing" && (
          <div className="space-y-1.5 bg-blue-50/70 p-3 rounded-2xl border border-blue-100">
            <div className="flex justify-between text-xs font-semibold text-blue-900">
              <span>Tiến độ tạo ảnh xem trước</span>
              <span>{importPercentage}%</span>
            </div>
            <Progress
              value={importPercentage}
              indicatorColor="bg-blue-600"
              className="h-2 bg-blue-200/70"
            />
            <p className="text-[11px] text-blue-700">
              Đang tạo ảnh display 1.600px dùng chung cho lưới và lightbox...
            </p>
          </div>
        )}

        {/* Error message if needs attention */}
        {album.status === "needs_attention" && (
          <div className="space-y-2 bg-rose-50 p-3.5 rounded-2xl border border-rose-200 text-xs">
            <p className="text-rose-800 font-medium leading-relaxed">
              {album.errorMessage ||
                "Phát hiện ảnh lỗi hoặc vượt quá giới hạn 50MB."}
            </p>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRetry(album.id);
              }}
              className="gap-1.5 rounded-xl font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thử lại phần chưa hoàn thành</span>
            </Button>
          </div>
        )}

        {/* Ready Album Summary: Share Link & Passcode */}
        {album.status === "ready" && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex items-center gap-2 truncate text-stone-600 font-mono text-[11px]">
                <span className="text-stone-400 select-none">/album/</span>
                <span className="font-bold text-stone-900 truncate">
                  {album.shareId}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleCopy}
                className="hover:bg-white text-stone-600 hover:text-stone-900"
                title="Sao chép link gửi khách"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {album.status === "ready" && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenGuestView(album.shareId);
                  }}
                  className="rounded-xl text-xs gap-1"
                  title="Mở giao diện khách hàng thả tim"
                >
                  <Eye className="w-3.5 h-3.5 text-stone-500" />
                  <span>Khách xem</span>
                </Button>

                {album.selectedPhotosCount > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExport}
                    className="rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 gap-1"
                    title="Xuất file CSV danh sách ảnh đã chọn cho Lightroom/Excel"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CSV</span>
                  </Button>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDelete}
              className="text-stone-400 hover:text-rose-600 hover:bg-rose-50"
              title="Xóa album"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="p-1.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default AlbumCard;
