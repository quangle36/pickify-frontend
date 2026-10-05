import { useState, useEffect, FC } from "react";
import { Link } from "@tanstack/react-router";
import type { Photo } from "@/features/photo/types/photo.types";
import type { Album } from "@/features/photographer/types/album.types";
import {
  ArrowLeft,
  Heart,
  Search,
  RefreshCw,
  FolderHeart,
  Images,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { usePhotoFilters } from "@/features/photo/queries/photo.queries";
import { PhotoCard } from "./components/PhotoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlbumSettingsModal } from "./components/AlbumSettingsModal";
import { PhotoTimeSettingsModal } from "./components/PhotoTimeSettingsModal";
import { LocalPhotoFilterModal } from "./components/LocalPhotoFilterModal";
import { ShareAlbumModal } from "./components/ShareAlbumModal";

interface AlbumDetailPageProps {
  album: Album;
  photos: Photo[];
  photosPending: boolean;
  onOpenLightbox: (photos: Photo[], index: number) => void;
}

const AlbumDetailPage: FC<AlbumDetailPageProps> = ({
  album,
  photos,
  photosPending,
  onOpenLightbox,
}) => {
  const filterPhotos = usePhotoFilters(album.id);
  const [filterMode, setFilterMode] = useState<"all" | "selected" | "error">(
    "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [gridColumns, setGridColumns] = useState<3 | 4 | 6>(4);
  const [localFilterOpen, setLocalFilterOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      filterPhotos(filterMode === "selected", searchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [filterMode, filterPhotos, searchTerm]);

  const [timeSettingsOpen, setTimeSettingsOpen] = useState(false);
  const selectedCount = album.selectedPhotosCount;

  // Filtered photos
  const filteredPhotos = photos.filter((p) => {
    if (filterMode === "error") {
      if (p.status !== "error") return false;
    } else {
      if (p.status !== "ready") return false;
    }
    if (
      searchTerm &&
      !p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (filterMode === "selected") return p.isSelected;
    return true;
  });

  const photoGridClassName = `grid gap-3 sm:gap-4 ${
    gridColumns === 3
      ? "grid-cols-2 sm:grid-cols-3"
      : gridColumns === 4
        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6"
  }`;

  const skeletonVisibility = (index: number) => {
    if (index < 2) return "";
    if (gridColumns === 3) return index === 2 ? "hidden sm:block" : "hidden";
    if (gridColumns === 4) {
      if (index === 2) return "hidden sm:block";
      return index === 3 ? "hidden lg:block" : "hidden";
    }
    return index < 4 ? "hidden sm:block" : "hidden lg:block";
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      {/* Unified Minimalist Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
          >
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Album</span>
            </Link>
          </Button>
          <div className="h-4 w-px bg-stone-200 hidden sm:block" />
          <h1 className="text-base sm:text-xl font-bold text-stone-900 truncate">
            {album.title}
          </h1>
          {album.status === "importing" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>
                Đang tải ({album.importedPhotos}/{album.totalPhotos})
              </span>
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            disabled={!["ready", "needs_attention"].includes(album.status)}
            onClick={() => setTimeSettingsOpen(true)}
          >
            Sắp xếp & đồng bộ giờ
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={album.status !== "ready" || selectedCount === 0}
            onClick={() => setLocalFilterOpen(true)}
            className="h-8.5 px-3.5 rounded-xl text-xs font-semibold shadow-xs"
            title={
              selectedCount === 0
                ? "Chưa có ảnh nào được khách thả tim"
                : album.status !== "ready"
                  ? "Album chưa sẵn sàng"
                  : "Sao chép ảnh đã tim từ thư mục trên máy"
            }
          >
            <FolderHeart className="w-3.5 h-3.5 text-stone-500" />
            <span>Lọc ảnh</span>
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setShareModalOpen(true)}
            className="h-8.5 px-3.5 rounded-xl bg-stone-900 text-white text-xs font-bold shadow-xs hover:bg-stone-800 active:scale-[0.98]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Chia sẻ</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setSettingsModalOpen(true)}
            aria-label="Mở cài đặt album"
            aria-haspopup="dialog"
            aria-expanded={settingsModalOpen}
            className="h-8.5 w-8.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 flex items-center justify-center"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Clean Toolstrip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <Tabs
          value={filterMode}
          onValueChange={(val) => setFilterMode(val as typeof filterMode)}
          className="w-full sm:w-auto"
        >
          <TabsList className="bg-stone-200/70 p-1 rounded-xl h-auto">
            <TabsTrigger
              value="all"
              className="gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-stone-950 data-[state=active]:shadow-xs"
              aria-label={`Tất cả ảnh (${album.totalPhotos})`}
            >
              <Images className="w-3.5 h-3.5" />
              <span>Tất cả · {album.totalPhotos}</span>
            </TabsTrigger>
            <TabsTrigger
              value="selected"
              className="gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-stone-950 data-[state=active]:shadow-xs"
              aria-label={`Ảnh đã tim (${selectedCount})`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  selectedCount > 0
                    ? "fill-rose-500 text-rose-500"
                    : "text-stone-400"
                }`}
              />
              <span>
                Đã tim · {selectedCount}
                {album.selectionLimit ? `/${album.selectionLimit}` : ""}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search & Grid Columns */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên ảnh..."
              className="pl-9 pr-3 h-8.5 rounded-xl border border-stone-200 bg-white text-xs font-mono text-stone-900 shadow-2xs"
            />
          </div>

          <div className="hidden md:inline-flex p-1 bg-stone-200/70 rounded-xl text-xs font-bold text-stone-600">
            <button
              type="button"
              onClick={() => setGridColumns(3)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                gridColumns === 3
                  ? "bg-white text-stone-900 shadow-xs"
                  : "hover:text-stone-900"
              }`}
            >
              3
            </button>
            <button
              type="button"
              onClick={() => setGridColumns(4)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                gridColumns === 4
                  ? "bg-white text-stone-900 shadow-xs"
                  : "hover:text-stone-900"
              }`}
            >
              4
            </button>
            <button
              type="button"
              onClick={() => setGridColumns(6)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                gridColumns === 6
                  ? "bg-white text-stone-900 shadow-xs"
                  : "hover:text-stone-900"
              }`}
            >
              6
            </button>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      {photosPending ? (
        <div
          role="status"
          aria-label="Đang tải ảnh"
          aria-busy="true"
          className={photoGridClassName}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton
              key={index}
              className={`aspect-[9/16] rounded-2xl ${skeletonVisibility(index)}`}
            />
          ))}
        </div>
      ) : filteredPhotos.length > 0 ? (
        <div className={photoGridClassName}>
          {filteredPhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={() => onOpenLightbox(filteredPhotos, index)}
            />
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl p-12 text-center border border-stone-200 shadow-xs space-y-3 bg-white max-w-md mx-auto my-8">
          {album.status === "importing" ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-900">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">
                Đang quét ảnh từ Google Drive...
              </h3>
              <p className="text-xs text-stone-500">
                Đã nhập {album.importedPhotos}/{album.totalPhotos} ảnh. Ảnh sẵn
                sàng sẽ tự động xuất hiện tại đây.
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Images className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">
                Không có ảnh nào phù hợp
              </h3>
              <p className="text-xs text-stone-500">
                Thử thay đổi bộ lọc ảnh hoặc từ khóa tìm kiếm của bạn.
              </p>
            </>
          )}
        </Card>
      )}

      <PhotoTimeSettingsModal
        key={album.id}
        album={album}
        open={timeSettingsOpen}
        onOpenChange={setTimeSettingsOpen}
      />
      <LocalPhotoFilterModal
        albumId={album.id}
        sources={album.sources}
        open={localFilterOpen}
        onOpenChange={setLocalFilterOpen}
      />
      <ShareAlbumModal
        shareId={album.slug ?? album.shareId}
        albumTitle={album.title}
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
      />
      <AlbumSettingsModal
        album={album}
        open={settingsModalOpen}
        onOpenChange={setSettingsModalOpen}
      />
    </div>
  );
};

export default AlbumDetailPage;
