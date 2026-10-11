import { FC, useEffect, useState } from "react";
import type { Album } from "@/features/photographer/types/album.types";
import {
  RefreshCw,
  AlertCircle,
  Trash2,
  MoreHorizontal,
  Pencil,
  Share2,
  ImageIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ImportProgressRing, useCountUp } from "@/features/photographer/components/ImportProgressRing";
import { importPercent } from "@/features/photographer/utils/importProgress";

interface AlbumCardProps {
  album: Album;
  onSelect: (id: string) => void;
  onRetry: (id: string) => void;
  canRetry?: boolean;
  onDelete: (id: string) => void;
  onEdit: (album: Album) => void;
  onShare: (album: Album) => void;
}

export const AlbumCard: FC<AlbumCardProps> = ({
  album,
  onSelect,
  onRetry,
  canRetry = true,
  onDelete,
  onEdit,
  onShare,
}) => {
  const [coverFailed, setCoverFailed] = useState(false);

  useEffect(() => {
    setCoverFailed(false);
  }, [album.coverUrl]);

  const selectionLimit = album.selectionLimit ?? album.totalPhotos;
  const selectionProgress = selectionLimit > 0
    ? Math.min(100, Math.max(0, (album.selectedPhotosCount / selectionLimit) * 100))
    : 0;
  const processing = album.status === "scanning" || album.status === "importing";
  const imported = useCountUp(album.importedPhotos);
  const statusText = {
    scanning: "Đang quét Drive",
    importing: "Đang nhập ảnh",
    needs_attention: "Cần xử lý",
    expired: "Đã hết hạn",
    deleting: "Đang dọn dữ liệu",
    deleted: "Đã xóa",
    ready: "",
  }[album.status];

  const handleDelete = () => {
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
      className="album-card flex cursor-pointer flex-col rounded-2xl border-stone-200 bg-white shadow-none"
    >
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-t-[15px] bg-stone-100">
        {album.coverUrl && !coverFailed ? (
          <img
            src={album.coverUrl}
            alt={album.title}
            className="album-card-cover absolute inset-0 h-full w-full object-cover object-[center_35%]"
            loading="lazy"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-center text-xs text-stone-600">
            <ImageIcon className="h-6 w-6 text-stone-400" strokeWidth={1.5} aria-hidden="true" />
            <span>{processing ? "Đang tạo ảnh đại diện" : "Chưa có ảnh đại diện"}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex min-h-9 items-start gap-3">
          <h3 className="min-w-0 flex-1 sm:min-h-12">
            <Button
              type="button"
              variant="ghost"
              onClick={(event) => {
                event.stopPropagation();
                onSelect(album.id);
              }}
              className="min-h-9 w-full justify-start rounded-none p-0 text-left text-base font-semibold leading-6 text-stone-900 [text-wrap:balance] hover:bg-transparent hover:text-stone-900 hover:underline hover:underline-offset-4"
            >
              {album.title}
            </Button>
          </h3>
          <div className="shrink-0" onClick={(event) => event.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Thao tác với album ${album.title}`}
                  className="h-8 w-8 rounded-[10px] text-stone-500 sm:h-9 sm:w-9"
                >
                  <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
                <DropdownMenuItem onSelect={() => onEdit(album)}>
                  <Pencil />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onShare(album)}>
                  <Share2 />
                  Chia sẻ
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDelete} className="text-rose-700 focus:bg-rose-50 focus:text-rose-700">
                  <Trash2 />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
          <span>{album.totalPhotos.toLocaleString("vi-VN")} ảnh</span>
          <span className="whitespace-nowrap text-stone-700">
            <strong className="font-medium text-stone-900">{album.selectedPhotosCount.toLocaleString("vi-VN")} / {selectionLimit.toLocaleString("vi-VN")}</strong> đã chọn
          </span>
        </div>
        <div className="h-[3px] overflow-hidden rounded-sm bg-stone-100" aria-hidden="true">
          <div className="h-full rounded-sm bg-stone-400" style={{ width: `${selectionProgress}%` }} />
        </div>

        {statusText && (
          <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
            <Badge
              title={album.status === "needs_attention" ? album.errorMessage : undefined}
              className={`gap-1.5 rounded-md border-0 px-2 py-[3px] text-xs font-normal hover:bg-stone-100 ${
                processing
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                  : album.status === "needs_attention"
                    ? "bg-rose-50 text-rose-700 hover:bg-rose-50"
                    : "bg-stone-100 text-stone-600"
              }`}
            >
              {album.status === "importing" ? (
                <ImportProgressRing percent={importPercent(imported, album.totalPhotos)} className="h-4 w-4" />
              ) : processing && <RefreshCw className="h-4 w-4 animate-spin motion-reduce:animate-none" strokeWidth={1.5} aria-hidden="true" />}
              {album.status === "needs_attention" && <AlertCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />}
              {statusText}
            </Badge>
            {album.status === "needs_attention" && canRetry && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-h-8 rounded-lg px-2.5 py-[5px] sm:min-h-8 sm:px-2.5"
                onClick={(event) => {
                  event.stopPropagation();
                  onRetry(album.id);
                }}
              >
                Thử lại
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
export default AlbumCard;
