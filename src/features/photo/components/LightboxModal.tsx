import { FC, useEffect, useCallback, useState, useRef } from "react";
import { usePhotoStore } from "../stores/photo.store";
import { Photo } from "../types/photo.types";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { preloadImage } from "../utils/imagePreloader";

import { formatShotTime } from "@/features/photographer/utils/photoTime";
import { PhotoCommentsPanel } from "./PhotoCommentsPanel";

interface LightboxModalProps {
  theme?: "light" | "dark";
  photos: Photo[];
  totalPhotos: number;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  onToggleSelection: (photoId: string, currentSelected: boolean) => void;
  selectionEnabled?: boolean;
  commentsBasePath?: string;
  canComment?: boolean;
  hasMorePhotos?: boolean;
  loadingMorePhotos?: boolean;
  onLoadMorePhotos?: () => Promise<unknown>;
}

export const LightboxModal: FC<LightboxModalProps> = ({
  theme = "dark",
  photos,
  totalPhotos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  onToggleSelection,
  selectionEnabled = true,
  commentsBasePath,
  canComment = false,
  hasMorePhotos = false,
  loadingMorePhotos = false,
  onLoadMorePhotos,
}) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [requestedIndex, setRequestedIndex] = useState<number | null>(null);
  const loadInFlight = useRef(false);
  const prefetchedTail = useRef<string | null>(null);
  const savingPhotos = usePhotoStore((state) => state.saving);
  const currentPhoto = photos[currentIndex];
  const canGoNext = currentIndex < photos.length - 1 || hasMorePhotos;
  const loadMore = useCallback(async () => {
    if (!onLoadMorePhotos || loadingMorePhotos || loadInFlight.current) return;
    loadInFlight.current = true;
    try {
      await onLoadMorePhotos();
    } catch {
      setRequestedIndex(null);
      toast({
        description: "Chưa tải được ảnh tiếp theo. Bấm mũi tên để thử lại.",
        variant: "destructive",
      });
    } finally {
      loadInFlight.current = false;
    }
  }, [onLoadMorePhotos, loadingMorePhotos]);

  const goPrevious = useCallback(() => {
    setRequestedIndex(null);
    if (currentIndex > 0) onNavigate(currentIndex - 1);
  }, [currentIndex, onNavigate]);

  const goNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      setRequestedIndex(null);
      onNavigate(currentIndex + 1);
    } else if (hasMorePhotos) {
      setRequestedIndex(currentIndex + 1);
      void loadMore();
    }
  }, [currentIndex, photos.length, hasMorePhotos, onNavigate, loadMore]);

  useEffect(() => {
    if (!isOpen) {
      setCommentsOpen(false);
      setRequestedIndex(null);
      prefetchedTail.current = null;
      return;
    }
    if (requestedIndex !== null && photos[requestedIndex]) {
      setRequestedIndex(null);
      onNavigate(requestedIndex);
    } else if (!hasMorePhotos && !loadingMorePhotos) {
      setRequestedIndex(null);
    }
  }, [
    isOpen,
    requestedIndex,
    photos,
    hasMorePhotos,
    loadingMorePhotos,
    onNavigate,
  ]);

  useEffect(() => {
    const tail = photos.at(-1)?.id;
    if (
      !isOpen ||
      !tail ||
      !hasMorePhotos ||
      loadingMorePhotos ||
      currentIndex < photos.length - 5 ||
      prefetchedTail.current === tail
    )
      return;
    prefetchedTail.current = tail;
    void loadMore();
  }, [isOpen, photos, currentIndex, hasMorePhotos, loadingMorePhotos, loadMore]);
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || !currentPhoto) return;
      if (e.defaultPrevented) return;
      if (commentsOpen) return;
      if (
        e.target instanceof HTMLElement &&
        e.target.closest("input, textarea, [contenteditable]")
      )
        return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        goPrevious();
      } else if (e.key === "ArrowRight") {
        goNext();
      } else if (
        selectionEnabled &&
        (e.key === " " ||
          e.key === "l" ||
          e.key === "L" ||
          e.key === "h" ||
          e.key === "H")
      ) {
        if (e.target instanceof HTMLElement && e.target.closest("button"))
          return;
        e.preventDefault();
        if (savingPhotos[currentPhoto.id]) return;
        onToggleSelection(currentPhoto.id, currentPhoto.isSelected);
      }
    },
    [
      isOpen,
      commentsOpen,
      currentPhoto,
      currentIndex,
      photos.length,
      onClose,
      onNavigate,
      onToggleSelection,
      selectionEnabled,
      savingPhotos,
      goPrevious,
      goNext,
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
    <div className={`fixed inset-0 z-50 flex flex-col justify-between select-none ${theme === "light" ? "guest-album bg-background text-foreground" : "bg-black/95"}`}>
      {/* Top Header Bar */}
      <div className={`p-4 flex items-center justify-between z-10 ${theme === "light" ? "border-b border-border bg-card text-foreground" : "text-white bg-gradient-to-b from-black/80 to-transparent"}`}>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="truncate max-w-[40vw] font-mono text-xs sm:text-sm font-bold tracking-wider">
            {currentPhoto.name}
          </span>
          <Badge
            variant="outline"
            className={`${theme === "light" ? "text-muted-foreground border-border bg-muted" : "text-stone-400 border-stone-700 bg-stone-900/50"}`}
            aria-label={`Ảnh ${currentPhoto.position} trên tổng ${totalPhotos} ảnh`}
          >
            Ảnh {currentPhoto.position} / {totalPhotos}
          </Badge>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {commentsBasePath && (
            <Popover open={commentsOpen} onOpenChange={setCommentsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Bình luận"
                  title="Bình luận / yêu cầu cho ảnh"
                  aria-expanded={commentsOpen}
                  className={`relative rounded-xl ${theme === "light" ? `text-muted-foreground hover:bg-muted hover:text-foreground ${commentsOpen ? "bg-muted text-foreground" : ""}` : `text-stone-200 hover:bg-stone-800 hover:text-white ${commentsOpen ? "bg-stone-800 text-white" : ""}`}`}
                >
                  <MessageSquare className="h-5 w-5" />
                  {!!currentPhoto.commentCount && (
                    <span className={`absolute -right-1 -top-1 rounded-full px-1 text-xs ${theme === "light" ? "bg-muted text-foreground" : "bg-stone-700"}`}>
                      {currentPhoto.commentCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PhotoCommentsPanel
                theme={theme}
                basePath={commentsBasePath}
                photoId={currentPhoto.id}
                photoName={currentPhoto.name}
                canComment={canComment}
                open={commentsOpen}
                onClose={() => setCommentsOpen(false)}
              />
            </Popover>
          )}
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
                  ? theme === "light" ? "bg-primary hover:bg-primary/90 text-primary-foreground animate-heart-pop" : "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/40 animate-heart-pop"
                  : theme === "light" ? "bg-muted text-muted-foreground hover:text-foreground hover:bg-secondary border-border" : "bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 border-stone-700"
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
                currentPhoto.isSelected ? "Khách đã thả tim" : "Chưa được chọn"
              }
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                currentPhoto.isSelected
                  ? theme === "light" ? "bg-primary text-primary-foreground" : "bg-rose-500 text-white shadow-lg shadow-rose-500/40"
                  : theme === "light" ? "bg-muted text-muted-foreground" : "bg-stone-800 text-stone-400"
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
            className={`rounded-full ${theme === "light" ? "text-muted-foreground hover:text-foreground hover:bg-muted" : "text-stone-400 hover:text-white hover:bg-stone-800"}`}
            title="Đóng (Esc)"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative min-h-0 flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
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
            onClick={goPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-stone-200 hover:bg-white text-stone-700 hover:text-stone-700"
            title="Ảnh trước (Phím ←)"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}

        {/* Next Button */}
        {canGoNext && (
          <Button
            size="icon"
            variant="ghost"
            onClick={goNext}
            isLoading={currentIndex >= photos.length - 1 && loadingMorePhotos}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-stone-200 hover:bg-white text-stone-700 hover:text-stone-700"
            title="Ảnh tiếp theo (Phím →)"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        )}
      </div>

      {/* Bottom Footer Info & Keyboard Hints */}
      <div className={`p-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs ${theme === "light" ? "border-t border-border bg-card text-muted-foreground" : "bg-gradient-to-t from-black/80 to-transparent text-stone-400"}`}>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span>
            {currentPhoto.sourceLabel ?? "Máy 1"} ·{" "}
            {formatShotTime(currentPhoto.correctedCapturedAt)}
          </span>
          <span>
            Kích thước: {currentPhoto.dimensions.width} ×{" "}
            {currentPhoto.dimensions.height} px
          </span>
        </div>

        <div className={`hidden md:flex items-center gap-2 text-[11px] ${theme === "light" ? "text-muted-foreground" : "text-stone-400"}`}>
          <kbd className={`px-1.5 py-0.5 rounded border ${theme === "light" ? "bg-muted text-foreground border-border" : "bg-stone-800 text-stone-200 border-stone-700"}`}>
            ←
          </kbd>
          <kbd className={`px-1.5 py-0.5 rounded border ${theme === "light" ? "bg-muted text-foreground border-border" : "bg-stone-800 text-stone-200 border-stone-700"}`}>
            →
          </kbd>
          <span>Chuyển ảnh</span>
          {selectionEnabled ? (
            <>
              <span className="mx-1">•</span>
              <kbd className={`px-1.5 py-0.5 rounded border ${theme === "light" ? "bg-muted text-foreground border-border" : "bg-stone-800 text-stone-200 border-stone-700"}`}>
                Space
              </kbd>
              <span>Thả tim</span>
            </>
          ) : null}
          <span className="mx-1">•</span>
          <kbd className={`px-1.5 py-0.5 rounded border ${theme === "light" ? "bg-muted text-foreground border-border" : "bg-stone-800 text-stone-200 border-stone-700"}`}>
            Esc
          </kbd>
          <span>Đóng</span>
        </div>
      </div>
    </div>
  );
};
export default LightboxModal;
