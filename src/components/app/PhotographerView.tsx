import type { AppController } from "@/hooks/useAppController";
import PhotographerDashboardPage from "@/features/photographer/pages/PhotographerDashboardPage";
import AlbumDetailPage from "@/features/photographer/pages/AlbumDetailPage";
import { PhotographerNavbar } from "@/features/photographer/components/PhotographerNavbar";
import { CreateAlbumModal } from "@/features/photographer/pages/PhotographerDashboardPage/components/CreateAlbumModal";
import { PublicDriveHelpModal } from "@/features/photographer/pages/PhotographerDashboardPage/components/PublicDriveHelpModal";
import { LoadMore } from "@/components/shared/LoadMore";
import { LightboxModal } from "@/components/shared/LightboxModal";

export function PhotographerView({
  app,
  isDetailView,
}: {
  app: AppController;
  isDetailView: boolean;
}) {
  const { profile, albums, album, photos, actions, lightbox, openGuestDemo } =
    app;
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
          <LoadMore albumId={album.id} />
        </>
      ) : (
        <PhotographerDashboardPage
          profile={profile}
          albums={albums}
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
