import { FC } from "react";
import type { Album } from "@/features/photographer/types/album.types";
import { AlbumCard } from "./components/AlbumCard";
import { CreateAlbumCard } from "./components/CreateAlbumCard";
import { PhotographerDashboardSkeleton } from "./components/PhotographerDashboardSkeleton";

interface PhotographerDashboardPageProps {
  albums: Album[];
  onSelectAlbum: (albumId: string) => void;
  onRetryAlbum: (albumId: string) => void;
  onDeleteAlbum: (albumId: string) => void;
  onCreateAlbum: () => void;
  pending?: boolean;
}

const PhotographerDashboardPage: FC<PhotographerDashboardPageProps> = ({
  albums,
  onSelectAlbum,
  onRetryAlbum,
  onDeleteAlbum,
  onCreateAlbum,
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
            onRetry={onRetryAlbum}
            onDelete={onDeleteAlbum}
          />
        ))}
      </div>

    </div>
  );
};

export default PhotographerDashboardPage;
