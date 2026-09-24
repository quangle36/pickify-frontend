import { useState, useEffect, FC } from "react";
import { Link } from "@tanstack/react-router";
import type { Photo } from "@/features/photo/types/photo.types";
import type { Album } from "@/features/photographer/types/album.types";
import {
  ArrowLeft,
  Heart,
  FileSpreadsheet,
  Copy,
  Check,
  Lock,
  Search,
  Eye,
  Clock,
  RefreshCw,
} from "lucide-react";
import { getDaysRemaining } from "@/lib/utils";
import { exportSelectedPhotosToCsv } from "@/features/photographer/utils/exportCsv";
import {
  useRevokeAlbumSessions,
  useUpdateAlbumPasscode,
} from "@/features/photographer/queries/album.mutations";
import { usePhotoFilters } from "@/features/photo/queries/photo.queries";
import { usePhotoSelection } from "@/features/photo/queries/photo.mutations";
import { useAppStore } from "@/app/stores/app.store";
import { PhotoCard } from "./components/PhotoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface AlbumDetailPageProps {
  album: Album;
  photos: Photo[];
  onOpenGuestView: (shareId: string) => void;
  onOpenLightbox: (photos: Photo[], index: number) => void;
}

const AlbumDetailPage: FC<AlbumDetailPageProps> = ({
  album,
  photos,
  onOpenGuestView,
  onOpenLightbox,
}) => {
  const report = useAppStore((state) => state.report);
  const filterPhotos = usePhotoFilters(album.id);
  const photoSelection = usePhotoSelection("owner", null);
  const updatePasscode = useUpdateAlbumPasscode();
  const revokeSessions = useRevokeAlbumSessions();
  const [filterMode, setFilterMode] = useState<"all" | "selected" | "error">(
    "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [gridColumns, setGridColumns] = useState<3 | 4 | 6>(4);
  const [copiedLink, setCopiedLink] = useState(false);
  const [editingPasscode, setEditingPasscode] = useState(false);
  const [newPasscode, setNewPasscode] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      filterPhotos(filterMode === "selected", searchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [filterMode, filterPhotos, searchTerm]);

  const daysLeft = getDaysRemaining(album.expiresAt);
  const selectedCount = album.selectedPhotosCount;

  const handleCopyLink = () => {
    const guestUrl = `${window.location.origin}/album/${album.shareId}`;
    navigator.clipboard.writeText(guestUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportCsv = () => {
    exportSelectedPhotosToCsv(album, photos);
  };

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

  const handleRevokeSessions = async () => {
    if (
      window.confirm(
        "Thu hồi toàn bộ phiên khách đang mở? Khách sẽ phải nhập lại mật khẩu để tiếp tục.",
      )
    ) {
      try {
        await revokeSessions.mutateAsync(album.id);
      } catch (error) {
        report(error);
        return;
      }
      showNotice("Đã thu hồi tất cả phiên của khách.");
    }
  };

  const showNotice = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Only photos that have been successfully uploaded to DB
  const readyPhotos = photos.filter((p) => p.status === "ready");

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
            <span>Quay lại Danh sách Album</span>
          </Link>
        </Button>

        <div className="flex items-center flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onOpenGuestView(album.shareId)}
            className="rounded-xl text-xs gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span>Mở link Khách xem</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="rounded-xl text-xs gap-1.5 shadow-2xs"
          >
            {copiedLink ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedLink ? "Đã chép link!" : "Chép link chia sẻ"}</span>
          </Button>

          <Button
            size="sm"
            onClick={handleExportCsv}
            className="rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất CSV cho Lightroom ({selectedCount})</span>
          </Button>
        </div>
      </div>

      {/* Album Meta Banner */}
      <Card className="rounded-3xl p-6 sm:p-7 border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-[11px] text-stone-700">
              ID: {album.folderId}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Thời hạn: Còn {daysLeft} ngày (30 ngày)</span>
            </span>
          </div>

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
                <span>Đang xử lý ảnh ({readyPhotos.length}/{album.totalPhotos})</span>
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

            {/* Revoke session action */}
            <Button
              variant="link"
              size="sm"
              onClick={handleRevokeSessions}
              className="text-stone-500 hover:text-stone-900 text-xs font-medium underline underline-offset-2 p-0 h-auto"
              title="Đăng xuất toàn bộ các thiết bị khách hàng đang mở link"
            >
              Thu hồi tất cả phiên khách
            </Button>
          </div>
        </div>

        {/* Selected count pill */}
        <Card className="p-4 rounded-2xl bg-brand-50 border-brand-100 flex items-center gap-4 shrink-0 shadow-none">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/30">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <span className="text-xs font-bold text-brand-800 uppercase tracking-wider">
              Khách đã chọn
            </span>
            <div className="text-2xl font-black text-brand-700 font-mono">
              {selectedCount}{" "}
              <span className="text-sm font-medium text-brand-600/70">
                / {readyPhotos.length} ảnh
              </span>
            </div>
          </div>
        </Card>
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
              className="rounded-xl px-3.5 py-2 font-bold"
            >
              Tất cả ảnh ({readyPhotos.length})
            </TabsTrigger>
            <TabsTrigger
              value="selected"
              className="rounded-xl px-3.5 py-2 font-bold gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Khách đã tim ({selectedCount})</span>
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
              placeholder="Tìm theo tên file (DSC_...)"
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
      {filteredPhotos.length > 0 ? (
        <div
          className={`grid gap-3 sm:gap-4 ${
            gridColumns === 3
              ? "grid-cols-2 sm:grid-cols-3"
              : gridColumns === 4
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6"
          }`}
        >
          {filteredPhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              pending={photoSelection.isPending(photo.id)}
              failed={photoSelection.isFailed(photo.id)}
              onClick={() => onOpenLightbox(filteredPhotos, index)}
              onToggleHeart={(photoId, currentSelected) => {
                void photoSelection.toggle(
                  album.id,
                  photoId,
                  !currentSelected,
                );
              }}
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
                Ảnh sau khi tối ưu và tải lên thành công sẽ tự động xuất hiện tại đây.
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
    </div>
  );
};

export default AlbumDetailPage;
