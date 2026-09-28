import type { AppController } from "@/app/hooks/useAppController";
import PhotographerDashboardPage, {
  PhotographerDashboardSkeleton,
} from "@/features/photographer/pages/PhotographerDashboardPage";
import AlbumDetailPage from "@/features/photographer/pages/AlbumDetailPage";
import { PhotographerNavbar } from "@/features/photographer/components/PhotographerNavbar";
import { PhotographerNavbarSkeleton } from "@/features/photographer/components/PhotographerNavbarSkeleton";
import { CreateAlbumModal } from "@/features/photographer/pages/PhotographerDashboardPage/components/CreateAlbumModal";
import { PublicDriveHelpModal } from "@/features/photographer/pages/PhotographerDashboardPage/components/PublicDriveHelpModal";
import { InfinitePhotoLoader } from "@/features/photo/components/InfinitePhotoLoader";
import { LightboxModal } from "@/features/photo/components/LightboxModal";

export function PhotographerView({
  app,
  isDetailView,
}: {
  app: AppController;
  isDetailView: boolean;
}) {
  const { profile, albums, album, photos, actions, lightbox } = app;
  if (app.pending.owner) {
    return (
      <>
        <PhotographerNavbarSkeleton />
        <PhotographerDashboardSkeleton />
      </>
    );
  }
  if (!profile.id) {
    return (
      <div className="p-12 text-center">
        <button
          className="bg-stone-900 text-white rounded-xl px-6 py-3"
          onClick={actions.loginDashboard}
        >
          Đăng nhập với Google
        </button>
      </div>
    );
  }
  return (
    <>
      <PhotographerNavbar profile={profile} onLogout={actions.logout} />
      {isDetailView && album ? (
        <>
          <AlbumDetailPage
            album={album}
            photos={photos}
            photosPending={app.pending.photos}
            onOpenLightbox={lightbox.open}
          />
          <InfinitePhotoLoader
            hasMore={app.hasMorePhotos}
            loading={app.loadingMorePhotos}
            onLoadMore={app.loadMorePhotos}
          />
        </>
      ) : (
        <PhotographerDashboardPage
          albums={albums}
          pending={app.pending.albums}
          onSelectAlbum={actions.selectAlbum}
          onOpenGuestView={actions.openGuest}
          onRetryAlbum={actions.retryAlbum}
          onDeleteAlbum={actions.deleteAlbum}
          onCreateAlbum={actions.openCreate}
        />
      )}
      <CreateAlbumModal {...actions.createModal} />
      <PublicDriveHelpModal {...actions.driveModal} />
      <LightboxModal {...lightbox.props} selectionEnabled={false} />
    </>
  );
}
