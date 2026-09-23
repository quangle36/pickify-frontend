import type { AppController } from "@/hooks/useAppController";
import PhotographerDashboardPage, {
  PhotographerDashboardSkeleton,
} from "@/features/photographer/pages/PhotographerDashboardPage";
import AlbumDetailPage from "@/features/photographer/pages/AlbumDetailPage";
import { PhotographerNavbar } from "@/features/photographer/components/PhotographerNavbar";
import { CreateAlbumModal } from "@/features/photographer/pages/PhotographerDashboardPage/components/CreateAlbumModal";
import { PublicDriveHelpModal } from "@/features/photographer/pages/PhotographerDashboardPage/components/PublicDriveHelpModal";
import { LoadMore } from "@/components/shared/LoadMore";
import { LightboxModal } from "@/components/shared/LightboxModal";
import { Skeleton } from "@/components/ui/skeleton";

function PhotographerNavbarSkeleton() {
  return (
    <header
      role="status"
      aria-label="Đang tải thông tin tài khoản"
      aria-busy="true"
      className="sticky top-0 z-30 border-b border-stone-200 bg-white/95"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <div className="hidden space-y-1.5 sm:block">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-2.5 w-28" />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="hidden h-9 w-32 rounded-xl sm:block" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>
    </header>
  );
}

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
          <LoadMore albumId={album.id} />
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
