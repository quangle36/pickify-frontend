import type { AppController } from "@/app/hooks/useAppController";
import PhotographerDashboardPage, {
  PhotographerDashboardSkeleton,
} from "@/features/photographer/pages/PhotographerDashboardPage";
import AlbumDetailPage from "@/features/photographer/pages/AlbumDetailPage";
import { PhotographerNavbar } from "@/features/photographer/components/PhotographerNavbar";
import { PhotographerNavbarSkeleton } from "@/features/photographer/components/PhotographerNavbarSkeleton";
import { CreateAlbumModal } from "@/features/photographer/pages/PhotographerDashboardPage/components/CreateAlbumModal";
import { PublicDriveHelpModal } from "@/features/photographer/pages/PhotographerDashboardPage/components/PublicDriveHelpModal";
import { LoadMore } from "@/features/photo/components/LoadMore";
import { LightboxModal } from "@/features/photo/components/LightboxModal";

export function PhotographerView({
  app,
  isDetailView,
}: {
  app: AppController;
  isDetailView: boolean;
}) {
  const { profile, albums, album, photos, actions, lightbox, openGuestDemo } =
    app;
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
      <PhotographerNavbar
        profile={profile}
        onCreateAlbum={actions.openCreate}
        onOpenGuestDemo={openGuestDemo}
        onOpenDriveModal={actions.openDrive}
        onLogout={actions.logout}
      />
      {isDetailView && album ? (
        <>
          <AlbumDetailPage
            album={album}
            photos={photos}
            onOpenGuestView={actions.openGuest}
            onOpenLightbox={lightbox.open}
          />
          <LoadMore
            hasMore={app.hasMorePhotos}
            onLoadMore={app.loadMorePhotos}
          />
        </>
      ) : (
        <PhotographerDashboardPage
          profile={profile}
          albums={albums}
          pending={app.pending.albums}
          onSelectAlbum={actions.selectAlbum}
          onOpenGuestView={actions.openGuest}
          onRetryAlbum={actions.retryAlbum}
          onDeleteAlbum={actions.deleteAlbum}
          onCreateAlbum={actions.openCreate}
          onOpenDriveModal={actions.openDrive}
        />
      )}
      <CreateAlbumModal {...actions.createModal} />
      <PublicDriveHelpModal {...actions.driveModal} />
      <LightboxModal {...lightbox.props} />
    </>
  );
}
