import { FC, useState } from "react";
import type { Album } from "@/features/photographer/types/album.types";
import { AlbumCard } from "./components/AlbumCard";
import { CreateAlbumCard } from "./components/CreateAlbumCard";
import { PhotographerDashboardSkeleton } from "./components/PhotographerDashboardSkeleton";
import { CreateAlbumModal } from "./components/CreateAlbumModal";
import { ShareAlbumModal } from "../AlbumDetailPage/components/ShareAlbumModal";
import { useUpdateAlbum } from "@/features/photographer/queries/album.mutations";
import { errorMessage } from "@/api/errors";

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
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [sharingAlbum, setSharingAlbum] = useState<Album | null>(null);
  const updateAlbum = useUpdateAlbum();
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
            onEdit={setEditingAlbum}
            onShare={setSharingAlbum}
          />
        ))}
      </div>

      {editingAlbum && (
        <CreateAlbumModal
          key={editingAlbum.id}
          album={editingAlbum}
          isOpen
          onClose={() => setEditingAlbum(null)}
          onSubmit={async (form) => {
            try {
              await updateAlbum.mutateAsync({
                albumId: editingAlbum.id,
                input: {
                  name: form.name,
                  slug: form.slug,
                  selectionLimit: form.selectionLimit,
                  ...(form.passcode ? { password: form.passcode } : {}),
                },
              });
              return { success: true };
            } catch (error) {
              return { success: false, error: errorMessage(error) };
            }
          }}
        />
      )}
      {sharingAlbum && (
        <ShareAlbumModal
          shareId={sharingAlbum.slug ?? sharingAlbum.shareId}
          albumTitle={sharingAlbum.title}
          open
          onOpenChange={(open) => !open && setSharingAlbum(null)}
        />
      )}
    </div>
  );
};

export default PhotographerDashboardPage;
