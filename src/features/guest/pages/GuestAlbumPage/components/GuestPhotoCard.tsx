import { FC, MouseEvent } from "react";
import type { Photo } from "@/features/photo/types/photo.types";
import { Heart, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { preloadImage } from "@/features/photo/utils/imagePreloader";

interface GuestPhotoCardProps {
  photo: Photo;
  isFailed: boolean;
  isPending: boolean;
  onClick: () => void;
  onToggleHeart: (photo: Photo) => void;
  onRetrySave: (photo: Photo) => void;
  selectionEnabled?: boolean;
}

export const GuestPhotoCard: FC<GuestPhotoCardProps> = ({
  photo,
  isFailed,
  isPending,
  onClick,
  onToggleHeart,
  onRetrySave,
  selectionEnabled = true,
}) => {
  const handleHeartClick = (e: MouseEvent) => {
    e.stopPropagation();
    onToggleHeart(photo);
  };

  const handleRetryClick = (e: MouseEvent) => {
    e.stopPropagation();
    onRetrySave(photo);
  };

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
      className={`group relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-800 bg-stone-800 transition-all select-none ${photo.status === "ready" ? "cursor-pointer hover:border-brand-500" : "cursor-default"}`}
    >
      {photo.status === "processing" && (
        <div
          role="status"
          aria-label={`Đang xử lý ${photo.name}`}
          className="absolute inset-0 origin-center animate-skeleton-breathe bg-linear-to-br from-stone-800 via-stone-700 to-stone-800 motion-reduce:animate-none"
        />
      )}
      {photo.status === "ready" && (
        <img
          src={photo.displayUrl}
          alt={photo.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      )}

      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Heart Button Overlay (Tap target >= 44px) */}
      {photo.status === "ready" && selectionEnabled && (
        <div className="absolute top-1.5 right-1.5 z-10">
          <button
            type="button"
            onClick={handleHeartClick}
            disabled={isPending}
            aria-pressed={photo.isSelected}
            className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-85 ${
              photo.isSelected
                ? "bg-rose-500 text-white animate-heart-pop shadow-lg shadow-rose-500/40"
                : "bg-black/45 text-white/80 hover:bg-black/60"
            }`}
            aria-label={photo.isSelected ? "Bỏ tim" : "Thả tim"}
          >
            <Heart
              className={`w-5 h-5 ${photo.isSelected ? "fill-white" : ""}`}
            />
          </button>
        </div>
      )}

      {/* Unsaved warning badge per plan.md */}
      {selectionEnabled && isFailed && (
        <div
          onClick={handleRetryClick}
          className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-bold flex items-center gap-1 shadow-md cursor-pointer animate-pulse"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Chưa lưu • Bấm thử lại</span>
        </div>
      )}

      {/* Bottom name label */}
      <div className="pointer-events-none absolute right-2 bottom-1.5 left-2 text-[11px] font-mono text-stone-300">
        <span className="truncate">{photo.name}</span>
      </div>
    </Card>
  );
};
export default GuestPhotoCard;
