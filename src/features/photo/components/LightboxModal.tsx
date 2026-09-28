import { FC, useEffect, useCallback } from "react";
import { usePhotoStore } from "../stores/photo.store";
import { Photo } from "../types/photo.types";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { preloadImage } from "../utils/imagePreloader";

interface LightboxModalProps {
  photos: Photo[];
  totalPhotos: number;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  onToggleSelection: (photoId: string, currentSelected: boolean) => void;
  selectionEnabled?: boolean;
}

export const LightboxModal: FC<LightboxModalProps> = ({
  photos,
  totalPhotos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  onToggleSelection,
  selectionEnabled = true,
}) => {
  const savingPhotos = usePhotoStore((state) => state.saving);
  const currentPhoto = photos[currentIndex];
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || !currentPhoto) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        if (currentIndex > 0) onNavigate(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        if (currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
      } else if (
        selectionEnabled &&
        (e.key === " " ||
          e.key === "l" ||
          e.key === "L" ||
          e.key === "h" ||
          e.key === "H")
      ) {
        e.preventDefault();
        if (savingPhotos[currentPhoto.id]) return;
        onToggleSelection(currentPhoto.id, currentPhoto.isSelected);
      }
    },
    [
      isOpen,
      currentPhoto,
      currentIndex,
      photos.length,
      onClose,
      onNavigate,
      onToggleSelection,
      selectionEnabled,
      savingPhotos,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isOpen || !currentPhoto) return;

    void preloadImage(currentPhoto.displayUrl, "high").catch(() => undefined);

    for (const index of [currentIndex - 1, currentIndex + 1]) {
      const adjacentPhoto = photos[index];
      if (adjacentPhoto) {
        void preloadImage(adjacentPhoto.displayUrl, "low").catch(
          () => undefined,
        );
      }
    }
  }, [currentIndex, currentPhoto, isOpen, photos]);

  if (!isOpen || !currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <div className="p-4 flex items-center justify-between text-white bg-gradient-to-b from-black/80 to-transparent z-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs sm:text-sm font-bold tracking-wider">
            {currentPhoto.name}
          </span>
          <Badge
            variant="outline"
            className="text-stone-400 border-stone-700 bg-stone-900/50"
            aria-label={`Ảnh ${currentPhoto.position} trên tổng ${totalPhotos} ảnh`}
          >
            Ảnh {currentPhoto.position} / {totalPhotos}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          {selectionEnabled ? (
            <Button
              size="icon"
              onClick={() =>
                onToggleSelection(currentPhoto.id, currentPhoto.isSelected)
              }
              aria-label={currentPhoto.isSelected ? "Bỏ tim" : "Thả tim"}
              aria-pressed={currentPhoto.isSelected}
              title={currentPhoto.isSelected ? "Bỏ tim" : "Thả tim"}
              variant={currentPhoto.isSelected ? "default" : "secondary"}
              className={`rounded-full transition-all ${
                currentPhoto.isSelected
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/40 animate-heart-pop"
                  : "bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 border-stone-700"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${currentPhoto.isSelected ? "fill-white" : ""}`}
              />
            </Button>
          ) : (
            <div
              role="img"
              aria-label={
                currentPhoto.isSelected
                  ? "Khách đã thả tim"
                  : "Khách chưa thả tim"
              }
              title={
                currentPhoto.isSelected
                  ? "Khách đã thả tim"
                  : "Chưa được chọn"
              }
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                currentPhoto.isSelected
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40"
                  : "bg-stone-800 text-stone-400"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${currentPhoto.isSelected ? "fill-white" : ""}`}
              />
            </div>
          )}

          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
            title="Đóng (Esc)"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        <img
          src={currentPhoto.displayUrl}
          alt={currentPhoto.name}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all"
        />

        {/* Previous Button */}
        {currentIndex > 0 && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onNavigate(currentIndex - 1)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs"
            title="Ảnh trước (Phím ←)"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}

        {/* Next Button */}
        {currentIndex < photos.length - 1 && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs"
            title="Ảnh tiếp theo (Phím →)"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        )}
      </div>

      {/* Bottom Footer Info & Keyboard Hints */}
      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400">
        <div className="flex items-center gap-3">
          <span>
            Kích thước: {currentPhoto.dimensions.width} ×{" "}
            {currentPhoto.dimensions.height} px
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] text-stone-400">
          <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700">
            ←
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700">
            →
          </kbd>
          <span>Chuyển ảnh</span>
          {selectionEnabled ? (
            <>
              <span className="mx-1">•</span>
              <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700">
                Space
              </kbd>
              <span>Thả tim</span>
            </>
          ) : null}
          <span className="mx-1">•</span>
          <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700">
            Esc
          </kbd>
          <span>Đóng</span>
        </div>
      </div>
    </div>
  );
};
export default LightboxModal;
