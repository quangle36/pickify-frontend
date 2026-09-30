import { useState, useEffect, FC } from "react";
import { Link } from "@tanstack/react-router";
import type { Photo } from "@/features/photo/types/photo.types";
import type { Album } from "@/features/photographer/types/album.types";
import {
  ArrowLeft,
  Heart,
  Menu,
  Search,
  RefreshCw,
  FolderHeart,
  Images,
  Share2,
} from "lucide-react";
import { usePhotoFilters } from "@/features/photo/queries/photo.queries";
import { PhotoCard } from "./components/PhotoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlbumSettingsModal } from "./components/AlbumSettingsModal";
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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 self-start"
        >
          <Link to="/dashboard">
            <ArrowLeft className="w-4 h-4" />
            <span>Danh sách Album</span>
          </Link>
        </Button>

        <div className="flex items-center flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={album.status !== "ready" || selectedCount === 0}
            onClick={() => setLocalFilterOpen(true)}
            className="rounded-xl text-xs gap-1.5"
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
            variant="outline"
            size="sm"
            onClick={() => setShareModalOpen(true)}
            className="rounded-xl text-xs gap-1.5 shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Chia sẻ</span>
          </Button>
        </div>
      </div>

      {/* Album Meta Banner */}
      <Card className="rounded-3xl border-stone-200 bg-white p-6 shadow-xs sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {album.title}
            </h1>
            {album.status === "importing" && (
              <Badge
                variant="info"
                className="gap-1.5 px-3 py-1 shadow-xs bg-blue-500/95 text-white border-0"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>
                  Đang xử lý ảnh ({album.importedPhotos}/{album.totalPhotos})
                </span>
              </Badge>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setSettingsModalOpen(true)}
            aria-label="Mở cài đặt album"
            className="shrink-0 rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </Card>

      {/* Gallery Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <Tabs
          value={filterMode}
          onValueChange={(val) => setFilterMode(val as typeof filterMode)}
          className="w-full sm:w-auto"
        >
          <TabsList className="bg-stone-200/70 p-1 rounded-2xl">
            <TabsTrigger
              value="all"
              className="gap-1.5 rounded-xl px-3.5 py-2 font-bold"
              aria-label={`Tất cả ảnh (${album.totalPhotos})`}
            >
              <Images className="w-3.5 h-3.5" />
              <span>{album.totalPhotos}</span>
            </TabsTrigger>
            <TabsTrigger
              value="selected"
              className="rounded-xl px-3.5 py-2 font-bold gap-1.5"
              aria-label={`Ảnh đã tim (${selectedCount})`}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{selectedCount}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search & Grid Columns */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-56">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder=""
              className="pl-9 pr-3 h-10 rounded-2xl bg-white border-stone-200 text-xs font-mono shadow-2xs"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="hidden md:flex items-center gap-1 p-1 bg-stone-200/70 rounded-2xl text-xs font-bold text-stone-600">
            <button
              type="button"
              onClick={() => setGridColumns(3)}
              className={`px-2.5 py-1.5 rounded-xl ${gridColumns === 3 ? "bg-white text-stone-900 shadow-xs" : ""}`}
            >
              3 Cột
            </button>
            <button
              type="button"
              onClick={() => setGridColumns(4)}
              className={`px-2.5 py-1.5 rounded-xl ${gridColumns === 4 ? "bg-white text-stone-900 shadow-xs" : ""}`}
            >
              4 Cột
            </button>
            <button
              type="button"
              onClick={() => setGridColumns(6)}
              className={`px-2.5 py-1.5 rounded-xl ${gridColumns === 6 ? "bg-white text-stone-900 shadow-xs" : ""}`}
            >
              6 Cột
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
        <Card className="rounded-3xl p-12 text-center border-stone-200 shadow-2xs space-y-3 bg-white">
          {album.status === "importing" ? (
            <>
              <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
              <h3 className="text-base font-bold text-stone-900">
                Đang xử lý ảnh từ Google Drive...
              </h3>
              <p className="text-xs text-stone-500">
                Ảnh sau khi tối ưu và tải lên thành công sẽ tự động xuất hiện
                tại đây.
              </p>
            </>
          ) : (
            <>
              <Heart className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-900">
                Không có ảnh nào phù hợp
              </h3>
              <p className="text-xs text-stone-500">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
              </p>
            </>
          )}
        </Card>
      )}

      <LocalPhotoFilterModal
        albumId={album.id}
        open={localFilterOpen}
        onOpenChange={setLocalFilterOpen}
      />
      <ShareAlbumModal
        shareId={album.slug ?? album.shareId}
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
