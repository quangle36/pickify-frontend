import { useState, FC } from "react";
import { Album, PhotographerProfile } from "@/types";
import { Folder, Heart, Search, Plus, Clock } from "lucide-react";
import { AlbumCard } from "./components/AlbumCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PhotographerDashboardPageProps {
  profile: PhotographerProfile;
  albums: Album[];
  onSelectAlbum: (albumId: string) => void;
  onOpenGuestView: (shareId: string) => void;
  onRetryAlbum: (albumId: string) => void;
  onDeleteAlbum: (albumId: string) => void;
  onCreateAlbum: () => void;
  onOpenDriveModal: () => void;
}

const PhotographerDashboardPage: FC<PhotographerDashboardPageProps> = ({
  profile,
  albums,
  onSelectAlbum,
  onOpenGuestView,
  onRetryAlbum,
  onDeleteAlbum,
  onCreateAlbum,
  onOpenDriveModal,
}) => {
  const [filterTab, setFilterTab] = useState<
    "all" | "ready" | "processing" | "needs_attention"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const totalHeartsSelected = albums.reduce(
    (acc, a) => acc + a.selectedPhotosCount,
    0,
  );
  const totalPhotosAll = albums.reduce((acc, a) => acc + a.totalPhotos, 0);

  // Filter logic
  const filteredAlbums = albums.filter((album) => {
    // Search match
    if (
      searchTerm &&
      !album.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Tab match
    if (filterTab === "ready") return album.status === "ready";
    if (filterTab === "processing")
      return album.status === "scanning" || album.status === "importing";
    if (filterTab === "needs_attention")
      return album.status === "needs_attention";
    return true;
  });

  const readyCount = albums.filter((a) => a.status === "ready").length;
  const processingCount = albums.filter(
    (a) => a.status === "scanning" || a.status === "importing",
  ).length;
  const attentionCount = albums.filter(
    (a) => a.status === "needs_attention",
  ).length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Welcome Banner & Quota Summary */}
      <Card className="rounded-3xl p-6 sm:p-8 border-stone-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Không gian làm việc Nhiếp ảnh gia (Studio Workspace)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Xin chào, {profile.name} 👋
          </h1>
          <p className="text-sm text-stone-500 mt-2 max-w-xl leading-relaxed">
            Dán link Google Drive chứa ảnh JPEG để tạo album bảo mật cho khách
            hàng. Khách mở link trên smartphone và thả tim ❤️; mỗi lựa chọn được
            lưu ngay vào hệ thống.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
          <Card className="p-4 rounded-2xl bg-stone-50 border-stone-200/80 text-center shadow-none">
            <span className="text-xs text-stone-500 font-medium">
              Hạn mức Album
            </span>
            <div className="text-xl sm:text-2xl font-black text-stone-900 mt-1 font-mono">
              {profile.activeAlbumsCount}
              <span className="text-sm font-normal text-stone-400">
                /{profile.maxAlbumsLimit}
              </span>
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">
              MVP tối đa 3
            </span>
          </Card>

          <Card className="p-4 rounded-2xl bg-stone-50 border-stone-200/80 text-center shadow-none">
            <span className="text-xs text-stone-500 font-medium">
              Tổng số ảnh
            </span>
            <div className="text-xl sm:text-2xl font-black text-stone-900 mt-1 font-mono">
              {totalPhotosAll.toLocaleString()}
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">
              Max 1.500/album
            </span>
          </Card>

          <Card className="p-4 rounded-2xl bg-brand-50 border-brand-100 text-center shadow-none">
            <span className="text-xs text-brand-700 font-medium">
              Khách đã chọn
            </span>
            <div className="text-xl sm:text-2xl font-black text-brand-700 mt-1 flex items-center justify-center gap-1 font-mono">
              <Heart className="w-4 h-4 fill-brand-600 text-brand-600 inline" />
              {totalHeartsSelected}
            </div>
            <span className="text-[10px] text-brand-600/70 block mt-0.5">
              Đã lưu trong DB
            </span>
          </Card>
        </div>
      </Card>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <Tabs
            value={filterTab}
            onValueChange={(val) => setFilterTab(val as typeof filterTab)}
            className="w-full sm:w-auto"
          >
            <TabsList className="bg-stone-200/70 p-1 rounded-2xl gap-1">
              <TabsTrigger
                value="all"
                className="rounded-xl px-3.5 py-2 font-bold"
              >
                Tất cả ({albums.length})
              </TabsTrigger>
              <TabsTrigger
                value="ready"
                className="rounded-xl px-3.5 py-2 font-bold gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Sẵn sàng ({readyCount})</span>
              </TabsTrigger>
              <TabsTrigger
                value="processing"
                className="rounded-xl px-3.5 py-2 font-bold gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Đang xử lý ({processingCount})</span>
              </TabsTrigger>
              <TabsTrigger
                value="needs_attention"
                className="rounded-xl px-3.5 py-2 font-bold gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Cần xử lý ({attentionCount})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Box & Quick Create */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm album..."
                className="pl-9 pr-4 h-10 rounded-2xl bg-white border-stone-200 text-xs shadow-2xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <Button
              onClick={onCreateAlbum}
              disabled={profile.activeAlbumsCount >= profile.maxAlbumsLimit}
              variant={
                profile.activeAlbumsCount >= profile.maxAlbumsLimit
                  ? "secondary"
                  : "dark"
              }
              className="rounded-2xl text-xs font-bold gap-1.5 shrink-0"
              title="Tạo album mới"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tạo mới</span>
            </Button>
          </div>
        </div>

        {/* Album Cards Grid */}
        {filteredAlbums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onSelect={onSelectAlbum}
                onOpenGuestView={onOpenGuestView}
                onRetry={onRetryAlbum}
                onDelete={onDeleteAlbum}
              />
            ))}
          </div>
        ) : (
          <Card className="rounded-3xl p-12 text-center border-stone-200 shadow-2xs space-y-4 bg-white">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Folder className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Không tìm thấy album nào
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Không có album nào khớp với bộ lọc hoặc từ khóa tìm kiếm của
                bạn.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setFilterTab("all");
                setSearchTerm("");
              }}
              className="rounded-xl text-xs font-semibold"
            >
              Đặt lại bộ lọc
            </Button>
          </Card>
        )}
      </div>

      {/* Rules Notice Footer */}
      <div className="p-4 rounded-2xl bg-stone-100/80 border border-stone-200 text-xs text-stone-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-stone-400 shrink-0" />
          <span>
            Thời hạn mỗi album là 30 ngày kể từ lúc sẵn sàng. File CSV có thể
            tải bất kỳ lúc nào trước khi hết hạn.
          </span>
        </div>
        <Button
          variant="link"
          size="sm"
          onClick={onOpenDriveModal}
          className="text-stone-700 font-bold p-0 h-auto hover:underline shrink-0"
        >
          Xem chi tiết chính sách Google Drive →
        </Button>
      </div>
    </div>
  );
};

export default PhotographerDashboardPage;
