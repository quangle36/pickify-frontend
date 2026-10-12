import { Trash2 } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Card } from "@/components/ui/card";
import { FC, useRef, useState } from "react";
import { StorageUsage } from "@/features/photographer/components/StorageUsage";
import type { Album, PhotographerProfile } from "@/features/photographer/types/album.types";
import { AlbumCard } from "./components/AlbumCard";
import { CreateAlbumCard } from "./components/CreateAlbumCard";
import { CreateAlbumModal } from "./components/CreateAlbumModal";
import { ShareAlbumModal } from "../AlbumDetailPage/components/ShareAlbumModal";
import { useUpdateAlbum } from "@/features/photographer/queries/album.mutations";
import { errorMessage } from "@/api/errors";

interface PhotographerDashboardPageProps {
  albums: Album[];
  profile?: PhotographerProfile;
  onSelectAlbum: (albumId: string) => void;
  onRetryAlbum: (albumId: string) => void;
  onDeleteAlbum: (albumId: string) => Promise<boolean>;
  onCreateAlbum: () => void;
  canCreateAlbums?: boolean;
}

const PhotographerDashboardPage: FC<PhotographerDashboardPageProps> = ({
  albums,
  profile,
  onSelectAlbum,
  onRetryAlbum,
  onDeleteAlbum,
  onCreateAlbum,
  canCreateAlbums = false,
}) => {
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [sharingAlbum, setSharingAlbum] = useState<Album | null>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [deletingAlbum, setDeletingAlbum] = useState<Album | null>(null);
  const updateAlbum = useUpdateAlbum();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-7 sm:gap-5">
        <div>
          <h1 className="text-xl font-semibold leading-[1.4] text-stone-900">Album của bạn</h1>
          {albums.length > 0 && <p className="mt-[5px] text-xs text-stone-500">{albums.length.toLocaleString("vi-VN")} album</p>}
        </div>
        {albums.length > 0 && canCreateAlbums && (
          <div className="w-full sm:w-auto"><CreateAlbumCard onCreate={onCreateAlbum} /></div>
        )}
      </div>

      {profile && <div className="mb-6 max-w-xl"><StorageUsage profile={profile} /></div>}

      {albums.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 rounded-2xl border-stone-200 bg-white px-4 py-10 text-center shadow-none sm:px-6 sm:py-14">
          <h2 className="text-base font-semibold text-stone-900">Chưa có album nào</h2>
          <p className="text-sm text-stone-500">{canCreateAlbums ? 'Tạo album đầu tiên từ thư mục Google Drive của bạn.' : 'Album sẽ xuất hiện tại đây sau khi tài khoản được cấp quyền tạo album.'}</p>
          {canCreateAlbums && <CreateAlbumCard onCreate={onCreateAlbum} />}
        </Card>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-5 min-[701px]:grid-cols-2 min-[701px]:gap-6 lg:grid-cols-3">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onSelect={onSelectAlbum}
              onRetry={onRetryAlbum}
              canRetry={canCreateAlbums}
              onDelete={(_id, trigger) => { deleteTriggerRef.current = trigger; setDeletingAlbum(album); }}
              onEdit={setEditingAlbum}
              onShare={setSharingAlbum}
            />
          ))}
        </div>
      )}

      <ConfirmationModal
        open={deletingAlbum !== null}
        onOpenChange={(nextOpen) => { if (!nextOpen) setDeletingAlbum(null); }}
        returnFocusRef={deleteTriggerRef}
        title="Xóa album?"
        description={<><span className="font-medium text-stone-900">{deletingAlbum?.title}</span> và toàn bộ phiên chọn ảnh sẽ bị xóa vĩnh viễn. Khách hàng sẽ không thể truy cập album. Thao tác này không thể hoàn tác.</>}
        confirmLabel="Xóa album"
        variant="destructive"
        icon={<Trash2 className="h-5 w-5" strokeWidth={1.5} />}
        onConfirm={() => deletingAlbum ? onDeleteAlbum(deletingAlbum.id) : false}
      />
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
