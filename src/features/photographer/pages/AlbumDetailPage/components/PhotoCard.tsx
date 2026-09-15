import { FC, MouseEvent } from "react";
import { Photo } from "@/types";
import { Heart } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PhotoCardProps {
  photo: Photo;
  pending: boolean;
  failed: boolean;
  onClick: () => void;
  onToggleHeart: (photoId: string, currentSelected: boolean) => void;
}

export const PhotoCard: FC<PhotoCardProps> = ({
  photo,
  pending,
  failed,
  onClick,
  onToggleHeart,
}) => {
  const handleHeartClick = (e: MouseEvent) => {
    e.stopPropagation();
    onToggleHeart(photo.id, photo.isSelected);
  };

  return (
    <Card
      onClick={photo.status === "ready" ? onClick : undefined}
      className={`group relative aspect-[9/16] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 transition-all select-none ${photo.status === "ready" ? "cursor-pointer hover:border-brand-500 hover:shadow-md" : "cursor-default"}`}
    >
      {photo.status === "processing" && (
        <div
          role="status"
          aria-label={`Đang xử lý ${photo.name}`}
          className="absolute inset-0 origin-center animate-skeleton-breathe bg-linear-to-br from-stone-100 via-stone-200 to-stone-100 motion-reduce:animate-none"
        />
      )}
      {photo.status === "ready" && (
        <img
          src={photo.displayUrl}
          alt={photo.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      )}

      {photo.status === "ready" && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />
      )}

      {/* Heart Button Top-Right */}
      {photo.status === "ready" && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            type="button"
            onClick={handleHeartClick}
            disabled={pending || photo.status !== "ready"}
            aria-label={photo.isSelected ? "Bỏ tim" : "Thả tim"}
            aria-pressed={photo.isSelected}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-90 shadow-md ${
              photo.isSelected
                ? "bg-rose-500 text-white animate-heart-pop"
                : "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white"
            }`}
            title={photo.isSelected ? "Khách đã thả tim" : "Chưa được chọn"}
          >
            <Heart
              className={`w-4 h-4 ${photo.isSelected ? "fill-white" : ""}`}
            />
          </button>
        </div>
      )}

      {(pending || failed || photo.status === "error") && (
        <span
          role="status"
          className="absolute top-2 left-2 bg-white text-stone-900 p-1 text-xs"
        >
          {pending
            ? "Đang lưu…"
            : failed
              ? "Chưa lưu — thử lại"
              : photo.errorReason}
        </span>
      )}
      {/* Bottom Label */}
      <div
        className={`absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono pointer-events-none ${photo.status === "ready" ? "text-stone-200" : "text-stone-600"}`}
      >
        <span className="truncate">{photo.name}</span>
        <Badge
          variant="outline"
          className="text-[10px] text-stone-400 bg-black/40 border-0 font-sans px-1.5 py-0"
        >
          {formatBytes(photo.sizeBytes)}
        </Badge>
      </div>
    </Card>
  );
};
export default PhotoCard;
