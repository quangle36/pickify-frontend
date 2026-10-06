import { InfinitePhotoLoader } from "@/features/photo/components/InfinitePhotoLoader";
import { FC, useState, useEffect, useRef } from "react";
import type { Photo } from "@/features/photo/types/photo.types";
import type { Album } from "@/features/photographer/types/album.types";
import {
  Heart,
  ArrowLeft,
  AlertCircle,
  Lock,
  Columns,
  Grid,
} from "lucide-react";
import { usePhotoFilters } from "@/features/photo/queries/photo.queries";
import { usePhotoSelection } from "@/features/photo/queries/photo.mutations";
import { LightboxModal } from "@/features/photo/components/LightboxModal";
import { GuestPhotoCard } from "./GuestPhotoCard";
import { GuestAlbumCover } from "./GuestAlbumCover";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";

interface GuestAlbumViewProps {
  album: Album;
  photos: Photo[];
  hasMorePhotos: boolean;
  loadingMorePhotos: boolean;
  onLoadMorePhotos: () => Promise<unknown>;
  onExitGuestView: () => void;
  readOnly: boolean;
}

export const GuestAlbumView: FC<GuestAlbumViewProps> = ({
  album,
  photos,
  hasMorePhotos,
  loadingMorePhotos,
  onLoadMorePhotos,
  onExitGuestView,
  readOnly,
}) => {
  const photoSelection = usePhotoSelection("guest", album.shareId);
  const filterPhotos = usePhotoFilters(album.shareId);
  const [filterOnlyHearts, setFilterOnlyHearts] = useState(false);
  const [gridCols, setGridCols] = useState<2 | 3>(2); // Mobile first: 2 or 3 cols
  const [failedSaves, setFailedSaves] = useState<Record<string, boolean>>({}); // photoId -> boolean
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const coverFallback = useRef<{ albumId: string; url?: string }>({
    albumId: album.id,
  });
  if (coverFallback.current.albumId !== album.id)
    coverFallback.current = { albumId: album.id };
  if (!coverFallback.current.url)
    coverFallback.current.url = photos.find(
      (photo) => photo.status === "ready",
    )?.displayUrl;
  const galleryRef = useRef<HTMLDivElement>(null);
  const limitToast = useRef<ReturnType<typeof toast>>();

  useEffect(
    () => () => {
      limitToast.current?.dismiss();
    },
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      filterPhotos(filterOnlyHearts);
    }, 200);
    return () => clearTimeout(timer);
  }, [filterOnlyHearts, filterPhotos]);

  const selectedCount = album.selectedPhotosCount;
  const selectionTarget = album.selectionLimit ?? album.totalPhotos;
  const selectionLocked = album.selectionLocked;
  const selectionLimitReached =
    album.selectionLimit !== null && selectedCount >= album.selectionLimit;

  const showLimitNotice = () => {
    limitToast.current?.dismiss();
    limitToast.current = toast({
      description: `Album chỉ cho phép chọn tối đa ${album.selectionLimit} ảnh. Hãy bỏ chọn một ảnh trước khi chọn ảnh khác.`,
      duration: 3000,
    });
  };

  const handleToggleHeart = async (photo: Photo) => {
    if (readOnly || selectionLocked) return;
    if (photoSelection.isPending(photo.id)) return;
    if (!photo.isSelected && selectionLimitReached) {
      showLimitNotice();
      return;
    }
    const success = await photoSelection.toggle(
      album.id,
      photo.id,
      !photo.isSelected,
    );
    setFailedSaves((previous) => ({ ...previous, [photo.id]: !success }));
  };
  const handleRetrySave = async (photo: Photo) => {
    const success = await photoSelection.retry(album.id, photo.id);
    setFailedSaves((previous) => ({ ...previous, [photo.id]: !success }));
  };

  const filteredPhotos = photos.filter((p) => {
    if (filterOnlyHearts) return p.isSelected;
    return true;
  });

  const showSelectedPhotos = () => {
    setFilterOnlyHearts(true);
    galleryRef.current?.scrollIntoView({ block: "start" });
  };

  return (
    <div
      className={`guest-album min-h-screen bg-background text-foreground flex flex-col ${readOnly ? "pb-8" : "pb-28"}`}
    >
      <header className="border-b border-border bg-card px-4 py-3 md:px-6 md:py-4">
        <div className="mx-auto flex max-w-[1392px] items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Heart className="h-5 w-5 text-primary" />
            Lumipic
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExitGuestView}
            className="h-10 w-10 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Rời album"
            title="Rời album"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pt-5 md:px-6 md:pt-6">
        <GuestAlbumCover
          album={album}
          fallbackUrl={coverFallback.current.url}
          readOnly={readOnly}
        />
        {!readOnly && selectionLocked && (
          <Alert className="mb-4 rounded-xl border-border bg-muted text-foreground">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <AlertDescription>
              Album đã khóa lựa chọn. Bạn vẫn có thể xem lại những ảnh đã chọn.
            </AlertDescription>
          </Alert>
        )}
        {!readOnly && Object.values(failedSaves).some(Boolean) && (
          <Alert className="mb-4 rounded-xl border-amber-200 bg-amber-50 text-amber-900">
            <AlertCircle className="h-4 w-4 text-amber-700" />
            <AlertDescription>
              Kết nối mạng gián đoạn. Có ảnh chưa lưu vào máy chủ. Bấm “Thử lại”
              trên ảnh để lưu lại.
            </AlertDescription>
          </Alert>
        )}

        <div id="guest-gallery" ref={galleryRef} className="scroll-mt-4">
          <div className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-t border-border bg-background py-4 md:gap-3">
            <div
              className="flex min-w-0 items-center gap-1"
              role="group"
              aria-label="Lọc ảnh"
            >
              <Button
                variant="ghost"
                aria-pressed={!filterOnlyHearts}
                onClick={() => setFilterOnlyHearts(false)}
                className={`min-h-10 gap-2 px-3 hover:text-foreground ${!filterOnlyHearts ? "bg-muted text-foreground hover:bg-foreground/10" : "text-muted-foreground hover:bg-foreground/5"}`}
              >
                Tất cả{" "}
                <span className="text-xs font-normal tabular-nums text-muted-foreground">
                  {album.totalPhotos}
                </span>
              </Button>
              {!readOnly && (
                <Button
                  variant="ghost"
                  aria-pressed={filterOnlyHearts}
                  onClick={() => setFilterOnlyHearts(true)}
                  className={`min-h-10 gap-2 px-3 hover:text-foreground ${filterOnlyHearts ? "bg-muted text-foreground hover:bg-foreground/10" : "text-muted-foreground hover:bg-foreground/5"}`}
                >
                  Đã chọn{" "}
                  <span className="text-xs font-normal tabular-nums text-muted-foreground">
                    {selectedCount}
                  </span>
                </Button>
              )}
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setGridCols(gridCols === 2 ? 3 : 2)}
              className="ml-auto h-10 w-10 shrink-0 border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Đổi số cột ảnh"
              title="Đổi số cột ảnh"
            >
              {gridCols === 2 ? (
                <Grid className="h-5 w-5" />
              ) : (
                <Columns className="h-5 w-5" />
              )}
            </Button>
          </div>

          {filteredPhotos.length > 0 ? (
            <div
              className={`grid gap-3 ${gridCols === 2 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-3 md:grid-cols-4"}`}
            >
              {filteredPhotos.map((photo, index) => (
                <GuestPhotoCard
                  key={photo.id}
                  photo={photo}
                  isFailed={photoSelection.isFailed(photo.id)}
                  isPending={photoSelection.isPending(photo.id)}
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                  onToggleHeart={handleToggleHeart}
                  onRetrySave={handleRetrySave}
                  selectionEnabled={!readOnly && !selectionLocked}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card px-5 py-16 text-center">
              <h2 className="text-lg font-semibold">
                {filterOnlyHearts ? "Chưa có ảnh đã chọn" : "Album chưa có ảnh"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {filterOnlyHearts
                  ? "Thả tim trên ảnh để thêm vào lựa chọn của bạn."
                  : "Ảnh sẽ xuất hiện ở đây khi album sẵn sàng."}
              </p>
              {filterOnlyHearts && (
                <Button
                  variant="outline"
                  className="mt-5 border-border bg-muted text-foreground hover:bg-card hover:text-foreground"
                  onClick={() => {
                    setFilterOnlyHearts(false);
                  }}
                >
                  Xem tất cả ảnh
                </Button>
              )}
            </div>
          )}
          <InfinitePhotoLoader
            hasMore={hasMorePhotos}
            loading={loadingMorePhotos}
            onLoadMore={onLoadMorePhotos}
          />
        </div>
      </main>

      {!readOnly && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[max(12px,env(safe-area-inset-bottom))] z-30 flex justify-center px-4 md:bottom-4 md:px-6">
          <div className="pointer-events-auto flex w-full max-w-[520px] items-center justify-between gap-3 rounded-2xl border border-border bg-muted p-3 md:gap-6 md:px-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold tabular-nums">
                Đã chọn <span className="text-primary">{selectedCount}</span> /{" "}
                {selectionTarget}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {selectionLocked ? "Lựa chọn đã khóa" : "Tự động lưu"}
              </p>
            </div>
            <Button
              variant={selectionLocked ? "outline" : "default"}
              onClick={showSelectedPhotos}
              className={`shrink-0 gap-2 px-3 md:px-4 ${selectionLocked ? "border-border bg-card text-foreground hover:bg-background hover:text-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
            >
              <Heart className="h-4 w-4" />
              Xem {selectedCount} ảnh
            </Button>
          </div>
        </div>
      )}

      {/* Lightbox for Guest View */}
      <LightboxModal
        theme="light"
        commentsBasePath={
          readOnly ? undefined : `/public/albums/${album.shareId}`
        }
        canComment={!readOnly}
        photos={filteredPhotos}
        hasMorePhotos={hasMorePhotos}
        loadingMorePhotos={loadingMorePhotos}
        onLoadMorePhotos={onLoadMorePhotos}
        totalPhotos={album.totalPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
        onToggleSelection={(photoId, currentSelected) => {
          if (readOnly || selectionLocked) return;
          if (!currentSelected && selectionLimitReached) {
            showLimitNotice();
            return;
          }
          void photoSelection.toggle(album.id, photoId, !currentSelected);
        }}
        selectionEnabled={!readOnly && !selectionLocked}
      />
    </div>
  );
};
export default GuestAlbumView;
