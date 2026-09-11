import { useState, useEffect } from 'react';
import { Photo, ViewRole } from '@/types';
import { store } from '@/lib/mockStore';

// Pages
import LandingPage from '@/features/landing/pages/LandingPage';
import PhotographerDashboardPage from '@/features/photographer/pages/PhotographerDashboardPage';
import AlbumDetailPage from '@/features/photographer/pages/AlbumDetailPage';
import GuestAlbumPage from '@/features/guest/pages/GuestAlbumPage';

// Feature Shared & Modal Components
import { PhotographerNavbar } from '@/features/photographer/components/PhotographerNavbar';
import { CreateAlbumModal } from '@/features/photographer/pages/PhotographerDashboardPage/components/CreateAlbumModal';
import { DriveConnectModal } from '@/features/photographer/pages/PhotographerDashboardPage/components/DriveConnectModal';

// Shared Components
import { LightboxModal } from '@/components/shared/LightboxModal';
import { DemoToolbar } from '@/components/shared/DemoToolbar';

// Shadcn UI Feedback
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

export function App() {
  const { toast } = useToast();

  // Store reactive state
  const [profile, setProfile] = useState(store.getProfile());
  const [albums, setAlbums] = useState(store.getAlbums());

  // View state: 'landing' (default), 'photographer', 'guest'
  const [currentRole, setCurrentRole] = useState<ViewRole>('landing');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(albums[0]?.id || 'album_dalat_wedding');
  const [isDetailView, setIsDetailView] = useState(false);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [driveModalOpen, setDriveModalOpen] = useState(false);

  // Guest Passcode Verification
  const [guestVerified, setGuestVerified] = useState(false);

  // Photographer Lightbox state
  const [photographerLightboxOpen, setPhotographerLightboxOpen] = useState(false);
  const [photographerLightboxPhotos, setPhotographerLightboxPhotos] = useState<Photo[]>([]);
  const [photographerLightboxIndex, setPhotographerLightboxIndex] = useState(0);

  // Subscribe to store updates
  useEffect(() => {
    const handleStoreUpdate = () => {
      const p = store.getProfile();
      const a = store.getAlbums();
      setProfile(p);
      setAlbums(a);
      const currentAlbum = a.find((x) => x.id === selectedAlbumId);
      if (currentAlbum) {
        setGuestVerified(store.isGuestVerified(currentAlbum.shareId));
      }
    };

    const unsubscribe = store.subscribe(handleStoreUpdate);
    return () => unsubscribe();
  }, [selectedAlbumId]);

  // Selected Album
  const currentAlbum = albums.find((a) => a.id === selectedAlbumId) || albums[0];
  const currentPhotos = currentAlbum ? store.getPhotos(currentAlbum.id) : [];

  // Handlers
  const handleToggleDrive = () => {
    store.toggleDriveConnection();
    toast({
      title: 'Google Drive',
      description: 'Đã cập nhật trạng thái kết nối Google Drive (drive.readonly)',
    });
  };

  const handleCreateAlbum = (data: { name: string; folderUrl: string; passcode: string }) => {
    const res = store.createAlbum(data);
    if (res.success && res.album) {
      setSelectedAlbumId(res.album.id);
      toast({
        title: 'Tạo album thành công',
        description: `Đã tạo album "${data.name}" và bắt đầu quét ảnh.`,
      });
    }
    return res;
  };

  const handleRetryAlbum = (albumId: string) => {
    store.retryAlbum(albumId);
    toast({
      title: 'Quét lại ảnh',
      description: 'Đang quét và xử lý lại các ảnh chưa hoàn thành...',
    });
  };

  const handleDeleteAlbum = (albumId: string) => {
    store.deleteAlbum(albumId);
    toast({
      title: 'Xóa album',
      description: 'Đã xóa album thành công.',
    });
  };

  const handleOpenGuestView = (shareId: string) => {
    const target = albums.find((a) => a.shareId.toLowerCase() === shareId.toLowerCase());
    if (target) {
      setSelectedAlbumId(target.id);
    }
    setGuestVerified(store.isGuestVerified(shareId));
    setCurrentRole('guest');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Simulate incoming SSE event from another client
  const handleSimulateSSE = () => {
    if (!currentAlbum) return;
    const res = store.simulateIncomingSSE(currentAlbum.id);
    if (res) {
      toast({
        title: 'SSE Realtime',
        description: `Khách vừa ${res.isSelected ? 'thả tim ❤️' : 'bỏ tim'} ảnh ${res.photoName}`,
      });
    }
  };

  // Check URL pathname for /album/:shareId
  useEffect(() => {
    const pathname = window.location.pathname;
    const match = pathname.match(/^\/album\/([a-zA-Z0-9_-]+)/);
    if (match) {
      const shareId = match[1];
      const found = albums.find((a) => a.shareId.toLowerCase() === shareId.toLowerCase());
      if (found) {
        setSelectedAlbumId(found.id);
        setCurrentRole('guest');
        setGuestVerified(store.isGuestVerified(shareId));
      }
    }
  }, [albums]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Main View Router */}
      {currentRole === 'landing' ? (
        /* 1. Landing Page */
        <LandingPage
          onGoToDashboard={() => {
            setCurrentRole('photographer');
            setIsDetailView(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenGuestDemo={() => handleOpenGuestView('tuan-trang-wedding')}
        />
      ) : currentRole === 'guest' ? (
        /* 2. Guest View */
        currentAlbum && (
          <GuestAlbumPage
            album={currentAlbum}
            guestVerified={guestVerified}
            onVerified={() => setGuestVerified(true)}
            onExitGuestView={() => {
              setCurrentRole('photographer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )
      ) : (
        /* 3. Photographer Dashboard */
        <div className="flex-1 flex flex-col">
          <PhotographerNavbar
            profile={profile}
            onCreateAlbum={() => setCreateModalOpen(true)}
            onOpenGuestDemo={() => currentAlbum && handleOpenGuestView(currentAlbum.shareId)}
            onGoToLanding={() => {
              setCurrentRole('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenDriveModal={() => setDriveModalOpen(true)}
          />

          <main className="flex-1">
            {isDetailView && currentAlbum ? (
              <AlbumDetailPage
                album={currentAlbum}
                photos={currentPhotos}
                onBack={() => setIsDetailView(false)}
                onOpenGuestView={(shareId) => handleOpenGuestView(shareId)}
                onOpenLightbox={(photos, index) => {
                  setPhotographerLightboxPhotos(photos);
                  setPhotographerLightboxIndex(index);
                  setPhotographerLightboxOpen(true);
                }}
              />
            ) : (
              <PhotographerDashboardPage
                profile={profile}
                albums={albums}
                onSelectAlbum={(id) => {
                  setSelectedAlbumId(id);
                  setIsDetailView(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenGuestView={(shareId) => handleOpenGuestView(shareId)}
                onRetryAlbum={handleRetryAlbum}
                onDeleteAlbum={handleDeleteAlbum}
                onCreateAlbum={() => setCreateModalOpen(true)}
                onOpenDriveModal={() => setDriveModalOpen(true)}
              />
            )}
          </main>

          {/* Lightbox for Photographer View */}
          <LightboxModal
            photos={photographerLightboxPhotos}
            currentIndex={photographerLightboxIndex}
            isOpen={photographerLightboxOpen}
            onClose={() => setPhotographerLightboxOpen(false)}
            onNavigate={(idx) => setPhotographerLightboxIndex(idx)}
            onToggleSelection={(photoId, currentSelected) => {
              if (currentAlbum) {
                store.toggleHeart(currentAlbum.id, photoId, !currentSelected);
              }
            }}
          />

          {/* Create Album Modal */}
          <CreateAlbumModal
            isOpen={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateAlbum}
          />

          {/* Drive Connect Modal */}
          <DriveConnectModal
            isOpen={driveModalOpen}
            onClose={() => setDriveModalOpen(false)}
            profile={profile}
            onToggleDrive={handleToggleDrive}
          />
        </div>
      )}

      {/* Floating Demo Toolbar for convenient MVP testing */}
      <DemoToolbar
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          if (role === 'guest' && currentAlbum) {
            setGuestVerified(store.isGuestVerified(currentAlbum.shareId));
          }
        }}
        albums={albums}
        selectedAlbumId={selectedAlbumId}
        onSelectAlbum={(id) => {
          setSelectedAlbumId(id);
          const target = albums.find((a) => a.id === id);
          if (target) {
            setGuestVerified(store.isGuestVerified(target.shareId));
          }
        }}
        onSimulateSSE={handleSimulateSSE}
      />

      {/* Shadcn Toaster */}
      <Toaster />
    </div>
  );
}

export default App;
