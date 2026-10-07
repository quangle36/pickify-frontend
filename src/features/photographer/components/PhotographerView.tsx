import type { AppController } from "@/app/hooks/useAppController";
import PhotographerDashboardPage from "@/features/photographer/pages/PhotographerDashboardPage";
import AlbumDetailPage from "@/features/photographer/pages/AlbumDetailPage";
import { PhotographerNavbar } from "@/features/photographer/components/PhotographerNavbar";
import { CreateAlbumModal } from "@/features/photographer/pages/PhotographerDashboardPage/components/CreateAlbumModal";
import { PublicDriveHelpModal } from "@/features/photographer/pages/PhotographerDashboardPage/components/PublicDriveHelpModal";
import { InfinitePhotoLoader } from "@/features/photo/components/InfinitePhotoLoader";
import { LightboxModal } from "@/features/photo/components/LightboxModal";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function PhotographerView({
  app,
  isDetailView,
}: {
  app: AppController;
  isDetailView: boolean;
}) {
  const { profile, albums, album, photos, actions, lightbox } = app;
  if (app.pending.owner) return null;
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
      {!profile.canCreateAlbums && <div className="mx-auto mt-5 w-full max-w-7xl px-4 sm:px-8"><Alert><AlertDescription>
        {profile.emailVerified ? 'Tài khoản đang chờ quản trị viên cấp quyền tạo album. Bạn vẫn có thể quản lý album hiện có.' : 'Xác minh email bằng Google, sau đó chờ quản trị viên cấp quyền tạo album.'}
        {!profile.emailVerified && <><p className="mt-2 text-xs text-muted-foreground">Đăng nhập Google bằng {profile.email}. Để bảo vệ tài khoản, mật khẩu đăng ký chưa xác minh sẽ được thay bằng phương thức Google.</p><Button variant="outline" className="mt-3" onClick={() => location.assign('/api/auth/google/start?destination=dashboard')}>Xác minh bằng Google</Button></>}
      </AlertDescription></Alert></div>}
      {isDetailView && album ? (
        <>
          <AlbumDetailPage
            album={album}
            photos={photos}
            loadingPhotos={app.pending.photos}
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
          onSelectAlbum={actions.selectAlbum}
          onRetryAlbum={actions.retryAlbum}
          onDeleteAlbum={actions.deleteAlbum}
          onCreateAlbum={actions.openCreate}
          canCreateAlbums={!!profile.canCreateAlbums}
        />
      )}
      {profile.canCreateAlbums && <CreateAlbumModal {...actions.createModal} />}
      <PublicDriveHelpModal {...actions.driveModal} />
      <LightboxModal
        {...lightbox.props}
        selectionEnabled={false}
        commentsBasePath={album ? `/albums/${album.id}` : undefined}
      />
    </>
  );
}
