import { InfinitePhotoLoader } from "@/features/photo/components/InfinitePhotoLoader";
import { FC, useState, useEffect, useRef } from "react";
import type { Photo } from "@/features/photo/types/photo.types";
import type { Album } from "@/features/photographer/types/album.types";
import {
  Heart,
  Search,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [gridCols, setGridCols] = useState<2 | 3>(2); // Mobile first: 2 or 3 cols
  const [failedSaves, setFailedSaves] = useState<Record<string, boolean>>({}); // photoId -> boolean
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const limitToast = useRef<ReturnType<typeof toast>>();

  useEffect(
    () => () => {
      limitToast.current?.dismiss();
    },
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      filterPhotos(filterOnlyHearts, searchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [filterOnlyHearts, filterPhotos, searchTerm]);

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
    if (
      searchTerm &&
      !p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (filterOnlyHearts) return p.isSelected;
    return true;
  });

  return (
    <div
      className={`min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans ${readOnly ? "pb-8" : "pb-24"}`}
    >
      {/* Sticky Mobile-First Header */}
      <header className="sticky top-0 z-30 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onExitGuestView}
              className="text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl"
              title="Thoát chế độ xem của khách"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-extrabold text-white truncate">
                {album.title}
              </h1>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  {readOnly ? "Chế độ chỉ xem" : "Lựa chọn được lưu tự động"}
                </span>
              </div>
            </div>
          </div>

          {/* Hearts Count Pill */}
          {!readOnly && (
            <Button
              size="sm"
              onClick={() => setFilterOnlyHearts(!filterOnlyHearts)}
              variant={filterOnlyHearts ? "default" : "secondary"}
              className={`rounded-2xl text-xs font-bold gap-1.5 shrink-0 ${
                filterOnlyHearts
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30"
                  : "bg-stone-800 text-stone-300 hover:text-white border-stone-700 hover:bg-stone-700"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  filterOnlyHearts
                    ? "fill-white text-white"
                    : "fill-rose-500 text-rose-500"
                }`}
              />
              <span>
                {selectedCount}/{selectionTarget}
              </span>
            </Button>
          )}
        </div>
      </header>

      {/* Locked selection notice */}
      {!readOnly && selectionLocked && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-3">
          <Alert className="rounded-2xl border-stone-700 bg-stone-800/90 p-3 text-stone-200">
            <Lock className="h-4 w-4 text-rose-400" />
            <AlertDescription className="text-xs text-stone-200">
              Album đã khóa lựa chọn. Bạn vẫn có thể xem lại những ảnh đã chọn.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Network Error Alert Notice if any */}
      {!readOnly && Object.values(failedSaves).some(Boolean) && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-3">
          <Alert className="bg-amber-950/80 border-amber-600/60 rounded-2xl text-xs text-amber-200 flex items-center justify-between gap-2 p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <AlertDescription className="text-xs text-amber-200">
                Kết nối mạng gián đoạn. Có ảnh chưa lưu vào máy chủ.
              </AlertDescription>
            </div>
            <span className="text-[11px] font-bold underline cursor-pointer">
              Bấm vào ảnh để thử lại
            </span>
          </Alert>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="max-w-4xl mx-auto w-full px-4 py-3 flex items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm mã ảnh (VD: 0012)..."
            className="pl-8 pr-3 h-9 rounded-xl bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500 text-xs font-mono focus:border-brand-500"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter & Grid Cols */}
        <div className="flex items-center gap-2">
          {!readOnly && (
            <Button
              size="sm"
              variant={filterOnlyHearts ? "default" : "outline"}
              onClick={() => setFilterOnlyHearts(!filterOnlyHearts)}
              className={`rounded-xl text-xs font-semibold gap-1.5 h-9 ${
                filterOnlyHearts
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : "bg-stone-800 text-stone-400 hover:text-white border-stone-700 hover:bg-stone-700"
              }`}
            >
              <span>Đã tim</span>
            </Button>
          )}

          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => setGridCols(gridCols === 2 ? 3 : 2)}
            className="h-9 w-9 rounded-xl bg-stone-800 border-stone-700 text-stone-400 hover:text-white hover:bg-stone-700"
            title="Đổi số cột hiển thị"
          >
            {gridCols === 2 ? (
              <Grid className="w-4 h-4" />
            ) : (
              <Columns className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Photo Grid */}
      <main className="max-w-4xl mx-auto w-full px-3 sm:px-4 flex-1">
        {filteredPhotos.length > 0 ? (
          <div
            className={`grid gap-2 sm:gap-3 ${
              gridCols === 2 ? "grid-cols-2" : "grid-cols-3"
            }`}
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
          <div className="py-20 text-center text-stone-500 space-y-3">
            <Heart className="w-12 h-12 mx-auto stroke-1 text-stone-600" />
            <p className="text-sm">Không tìm thấy ảnh nào.</p>
          </div>
        )}
        <InfinitePhotoLoader
          hasMore={hasMorePhotos}
          loading={loadingMorePhotos}
          onLoadMore={onLoadMorePhotos}
        />
      </main>

      {/* Floating Bottom Bar on Mobile */}
      {!readOnly && (
        <div className="fixed bottom-3 inset-x-0 z-20 flex justify-center px-4 pointer-events-none">
          <div className="bg-stone-800/95 text-white px-5 py-2.5 rounded-full shadow-2xl border border-stone-700/80 flex items-center gap-4 backdrop-blur-md pointer-events-auto">
            <div className="flex items-center gap-2 text-xs">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>
                Đã chọn <strong>{selectedCount}</strong> / {selectionTarget} ảnh
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox for Guest View */}
      <LightboxModal
        photos={filteredPhotos}
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
