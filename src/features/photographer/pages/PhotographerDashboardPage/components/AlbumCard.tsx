import { FC, useEffect, useState, MouseEvent } from "react";
import type { Album } from "@/features/photographer/types/album.types";
import {
  RefreshCw,
  AlertTriangle,
  Heart,
  Trash2,
  ChevronRight,
  Lock,
  ImageIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AlbumCardProps {
  album: Album;
  onSelect: (id: string) => void;
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AlbumCard: FC<AlbumCardProps> = ({
  album,
  onSelect,
  onRetry,
  onDelete,
}) => {
  const [coverFailed, setCoverFailed] = useState(false);

  useEffect(() => {
    setCoverFailed(false);
  }, [album.coverUrl]);

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

  return (
    <Card
      onClick={() => onSelect(album.id)}
      className="rounded-3xl border-stone-200 shadow-xs hover:shadow-xl hover:border-stone-300 transition-all duration-200 overflow-hidden flex flex-col group cursor-pointer bg-white"
    >
      {/* Top Media & Status Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        {album.coverUrl && !coverFailed ? (
          <img
            src={album.coverUrl}
            alt={album.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-stone-700 via-stone-800 to-stone-950 text-stone-400">
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="h-9 w-9" />
              <span className="text-[11px] font-semibold text-stone-300">
                {album.status === "scanning" || album.status === "importing"
                  ? "Đang tạo ảnh đại diện"
                  : "Chưa có ảnh đại diện"}
              </span>
            </div>
          </div>
        )}

        {/* Gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status Badge Top-Left */}
        <div className="absolute top-3 left-3 z-10">
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
              <span>Đang nhập ({album.totalPhotos} ảnh)</span>
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
              {album.selectedPhotosCount}/
              {album.selectionLimit ?? album.totalPhotos} đã chọn
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
      <div className="border-t border-stone-100 px-4 py-2.5 flex flex-col gap-2.5">
        {/* Progress bar if importing */}
        {album.status === "importing" && (
          <div className="space-y-1.5 bg-blue-50/70 p-3 rounded-2xl border border-blue-100">
            <div className="flex justify-between text-xs font-semibold text-blue-900">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                Đang tối ưu & lưu ảnh vào hệ thống
              </span>
            </div>
            <div className="h-1.5 w-full bg-blue-200/70 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-pulse w-full rounded-full" />
            </div>
            <p className="text-[11px] text-blue-700">
              Ảnh được xử lý ngầm, bấm vào album để xem các ảnh đã hoàn thành.
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

        {/* Card Footer Actions */}
        <div className="flex items-center justify-end gap-2">
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
