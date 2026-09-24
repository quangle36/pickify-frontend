import { FC } from "react";
import type { Album } from "@/features/photographer/types/album.types";
import { Clock } from "lucide-react";
import { AlbumCard } from "./components/AlbumCard";
import { Button } from "@/components/ui/button";
import { CreateAlbumCard } from "./components/CreateAlbumCard";
import { PhotographerDashboardSkeleton } from "./components/PhotographerDashboardSkeleton";

interface PhotographerDashboardPageProps {
  albums: Album[];
  onSelectAlbum: (albumId: string) => void;
  onOpenGuestView: (shareId: string) => void;
  onRetryAlbum: (albumId: string) => void;
  onDeleteAlbum: (albumId: string) => void;
  onCreateAlbum: () => void;
  onOpenDriveModal: () => void;
  pending?: boolean;
}

const PhotographerDashboardPage: FC<PhotographerDashboardPageProps> = ({
  albums,
  onSelectAlbum,
  onOpenGuestView,
  onRetryAlbum,
  onDeleteAlbum,
  onCreateAlbum,
  onOpenDriveModal,
  pending = false,
}) => {
  if (pending) {
    return <PhotographerDashboardSkeleton onCreateAlbum={onCreateAlbum} />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CreateAlbumCard onCreate={onCreateAlbum} />
        {albums.map((album) => (
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
