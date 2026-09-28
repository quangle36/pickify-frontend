import { useState, useEffect, FC } from "react";
import { Link } from "@tanstack/react-router";
import type { Photo } from "@/features/photo/types/photo.types";
import type { Album } from "@/features/photographer/types/album.types";
import {
  ArrowLeft,
  Heart,
  Copy,
  Check,
  Lock,
  LockOpen,
  Search,
  RefreshCw,
  FolderHeart,
  Images,
  Share2,
} from "lucide-react";
import {
  useSetAlbumSelectionLocked,
  useUpdateAlbumPasscode,
} from "@/features/photographer/queries/album.mutations";
import { usePhotoFilters } from "@/features/photo/queries/photo.queries";
import { useAppStore } from "@/app/stores/app.store";
import { PhotoCard } from "./components/PhotoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  const report = useAppStore((state) => state.report);
  const filterPhotos = usePhotoFilters(album.id);
  const updatePasscode = useUpdateAlbumPasscode();
  const selectionLock = useSetAlbumSelectionLocked();
  const [filterMode, setFilterMode] = useState<"all" | "selected" | "error">(
    "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [gridColumns, setGridColumns] = useState<3 | 4 | 6>(4);
  const [editingPasscode, setEditingPasscode] = useState(false);
  const [newPasscode, setNewPasscode] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [localFilterOpen, setLocalFilterOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      filterPhotos(filterMode === "selected", searchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [filterMode, filterPhotos, searchTerm]);

  const selectedCount = album.selectedPhotosCount;

  const handleSavePasscode = async () => {
    if (!newPasscode || newPasscode.length < 4) {
      alert("Mật khẩu phải có ít nhất 4 ký tự.");
      return;
    }
    try {
      await updatePasscode.mutateAsync({
        albumId: album.id,
        password: newPasscode,
      });
    } catch (error) {
      report(error);
      return;
    }
    setEditingPasscode(false);
    showNotice(
      "Đã đổi mật khẩu và thu hồi toàn bộ phiên đăng nhập cũ của khách hàng.",
    );
  };

  const handleSelectionEditingChange = async (editable: boolean) => {
    try {
      await selectionLock.mutateAsync({
        albumId: album.id,
        locked: !editable,
      });
      showNotice(
        editable
          ? "Đã cho phép khách tiếp tục chỉnh sửa lựa chọn."
          : "Đã khóa chỉnh sửa lựa chọn của khách.",
      );
    } catch (error) {
      report(error);
    }
  };

  const showNotice = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

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
      {/* Toast Notice */}
      {toastMsg && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none animate-fade-in">
          <div className="bg-stone-900 text-white text-xs font-semibold px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 pointer-events-auto">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

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
      <Card className="rounded-3xl p-6 sm:p-7 border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white">
        <div>
          <div className="flex flex-wrap items-center gap-3">
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

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            {/* Passcode Setting */}
            <div className="inline-flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-stone-500">Mật khẩu khách:</span>
              {editingPasscode ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="text"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    className="w-16 h-7 px-1.5 py-0.5 rounded border-brand-400 text-xs font-mono font-bold"
                  />
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleSavePasscode}
                    className="text-[11px] font-bold text-emerald-600 hover:underline p-0 h-auto"
                  >
                    Lưu
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setNewPasscode("");
                      setEditingPasscode(false);
                    }}
                    className="text-[11px] text-stone-400 hover:underline p-0 h-auto"
                  >
                    Hủy
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-stone-900">
                    {"••••"}
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setEditingPasscode(true)}
                    className="text-[11px] text-brand-600 hover:underline font-bold p-0 h-auto"
                  >
                    Đổi
                  </Button>
                </div>
              )}
            </div>

            <div
              className={`inline-flex items-center gap-2.5 rounded-xl border px-3 py-1.5 transition-colors ${
                album.selectionLocked
                  ? "border-rose-200 bg-rose-50"
                  : "border-emerald-200 bg-emerald-50"
              }`}
            >
              {!album.selectionLocked ? (
                <LockOpen className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Lock className="h-3.5 w-3.5 text-rose-500" />
              )}
              <Label
                htmlFor={`selection-editing-${album.id}`}
                className="cursor-pointer text-xs font-semibold text-stone-700"
              >
                Cho phép chỉnh sửa
              </Label>
              <Switch
                id={`selection-editing-${album.id}`}
                checked={!album.selectionLocked}
                onCheckedChange={handleSelectionEditingChange}
                disabled={album.status !== "ready" || selectionLock.isPending}
                aria-label={
                  album.selectionLocked
                    ? "Cho phép khách chỉnh sửa lựa chọn"
                    : "Ngừng cho phép khách chỉnh sửa lựa chọn"
                }
                className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-stone-300"
              />
            </div>
          </div>
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
    </div>
  );
};

export default AlbumDetailPage;
