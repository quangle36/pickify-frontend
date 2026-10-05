import { FC, useState } from "react";
import type { Photo } from "@/features/photo/types/photo.types";
import { MessageSquare, Heart, RefreshCw, ImageOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  photo, isFailed, isPending, onClick, onToggleHeart, onRetrySave, selectionEnabled = true,
}) => {
  const [failedImageUrl, setFailedImageUrl] = useState<string>();
  const preload = () => {
    if (photo.status === "ready") void preloadImage(photo.displayUrl, "high").catch(() => undefined);
  };

  return (
    <figure className="min-w-0">
      <Card
        onPointerEnter={preload}
        onTouchStart={preload}
        className={`relative aspect-[3/4] overflow-hidden rounded-xl border-0 bg-muted shadow-none md:aspect-[3/2] ${photo.isSelected ? "ring-2 ring-inset ring-primary" : ""}`}
      >
        <Button
          variant="ghost"
          onClick={onClick}
          disabled={photo.status !== "ready"}
          aria-label={`Xem ảnh ${photo.name}`}
          className="absolute inset-0 h-full w-full rounded-xl border-0 p-0 text-muted-foreground hover:bg-transparent hover:text-foreground disabled:opacity-100"
        >
          {photo.status === "ready" && failedImageUrl !== photo.displayUrl ? (
            <img src={photo.displayUrl} alt={photo.name} onError={() => setFailedImageUrl(photo.displayUrl)} className="h-full w-full object-cover" loading="lazy" decoding="async" />
          ) : photo.status === "processing" ? (
            <span role="status" aria-label={`Đang xử lý ${photo.name}`} className="absolute inset-0 animate-skeleton-breathe bg-muted motion-reduce:animate-none" />
          ) : (
            <span className="flex flex-col items-center gap-2 p-3 text-xs"><ImageOff className="h-5 w-5" />Chưa tải được ảnh</span>
          )}
        </Button>
        {photo.isSelected && <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-inset ring-primary" />}
        {photo.status === "ready" && (selectionEnabled || photo.isSelected) && (
          selectionEnabled ? (
            <Button
              size="icon" variant="ghost" onClick={() => onToggleHeart(photo)} disabled={isPending} aria-busy={isPending}
              aria-pressed={photo.isSelected} aria-label={`${photo.isSelected ? "Bỏ tim" : "Thả tim"} ${photo.name}`}
              className={`absolute right-2 top-2 h-10 w-10 rounded-full md:right-3 md:top-3 ${photo.isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "border border-white/20 bg-stone-800/90 text-stone-50 hover:bg-stone-700 hover:text-white"}`}
            ><Heart className={`h-5 w-5 ${photo.isSelected ? "fill-current" : ""}`} /></Button>
          ) : (
            <span role="img" aria-label="Đã chọn" className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground md:right-3 md:top-3"><Heart className="h-5 w-5 fill-current" /></span>
          )
        )}
        {selectionEnabled && isFailed && (
          <Button onClick={() => onRetrySave(photo)} size="sm" className="absolute bottom-2 left-2 gap-1 rounded-lg bg-amber-200 px-2 text-xs text-amber-950 hover:bg-amber-100" aria-label={`Thử lưu lại ${photo.name}`}><RefreshCw className="h-3 w-3" />Thử lại</Button>
        )}
      </Card>
      <figcaption className="mt-2 flex min-h-6 items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="min-w-0 truncate" title={photo.name}>{photo.name}</span>
        {photo.isSelected && <span className="hidden shrink-0 text-primary md:inline">Đã chọn</span>}
        {!!photo.commentCount && <span className="flex shrink-0 items-center gap-1" aria-label={`${photo.commentCount} bình luận`}><MessageSquare className="h-3.5 w-3.5" />{photo.commentCount}</span>}
      </figcaption>
    </figure>
  );
};
export default GuestPhotoCard;
