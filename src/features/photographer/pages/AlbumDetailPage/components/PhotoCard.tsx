import { FC } from "react";
import type { Photo } from "@/features/photo/types/photo.types";
import { MessageSquare, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { preloadImage } from "@/features/photo/utils/imagePreloader";

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
}

export const PhotoCard: FC<PhotoCardProps> = ({ photo, onClick }) => {
  return (
    <Card
      onClick={photo.status === "ready" ? onClick : undefined}
      onPointerEnter={() => {
        if (photo.status === "ready") {
          void preloadImage(photo.displayUrl, "high").catch(() => undefined);
        }
      }}
      onTouchStart={() => {
        if (photo.status === "ready") {
          void preloadImage(photo.displayUrl, "high").catch(() => undefined);
        }
      }}
      className={`group relative aspect-[9/16] overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-100 transition-all select-none ${photo.status === "ready" ? "cursor-pointer hover:border-stone-400 hover:shadow-md" : "cursor-default"}`}
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
          decoding="async"
        />
      )}

      {photo.status === "ready" && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
      )}

      {/* Read-only guest selection indicator */}
      {photo.status === "ready" && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <div
            role="img"
            aria-label={
              photo.isSelected ? "Khách đã thả tim" : "Khách chưa thả tim"
            }
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-90 ${
              photo.isSelected
                ? "bg-rose-500 text-white shadow-xs shadow-rose-600/30 animate-heart-pop"
                : "bg-black/35 text-white/75 hover:bg-black/50"
            }`}
            title={photo.isSelected ? "Khách đã thả tim" : "Chưa được chọn"}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${photo.isSelected ? "fill-white" : ""}`}
            />
          </div>
        </div>
      )}

      {photo.status === "error" && (
        <span
          role="status"
          className="absolute top-2 left-2 bg-white text-stone-900 p-1 text-xs"
        >
          {photo.errorReason}
        </span>
      )}
      {!!photo.commentCount && (
        <div
          className="absolute bottom-7 left-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 text-xs text-white"
          aria-label={`${photo.commentCount} bình luận`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          {photo.commentCount}
        </div>
      )}

      {/* Bottom Label */}
      <div
        className={`absolute bottom-2 left-2.5 right-2.5 text-[11px] font-mono pointer-events-none ${photo.status === "ready" ? "text-stone-200" : "text-stone-600"}`}
      >
        <span className="block truncate">{photo.name}</span>
      </div>
    </Card>
  );
};
export default PhotoCard;
