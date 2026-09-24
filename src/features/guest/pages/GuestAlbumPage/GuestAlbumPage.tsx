import { FC } from 'react';
import type { Photo } from '@/features/photo/types/photo.types';
import type { Album } from '@/features/photographer/types/album.types';
import { GuestPasscodeModal } from './components/GuestPasscodeModal';
import { GuestAlbumView } from './components/GuestAlbumView';

interface GuestAlbumPageProps {
  album: Album;
  photos: Photo[];
  hasMorePhotos: boolean;
  onLoadMorePhotos: () => Promise<unknown>;
  guestVerified: boolean;
  onVerified: () => void;
  onExitGuestView: () => void;
}

const GuestAlbumPage: FC<GuestAlbumPageProps> = ({
  album,
  photos,
  hasMorePhotos,
  onLoadMorePhotos,
  guestVerified,
  onVerified,
  onExitGuestView,
}) => {
  if (!guestVerified) {
    return (
      <GuestPasscodeModal
        album={album}
        onVerified={() => {
          onVerified();
        }}
      />
    );
  }

  return (
    <GuestAlbumView
      album={album}
      photos={photos}
      hasMorePhotos={hasMorePhotos}
      onLoadMorePhotos={onLoadMorePhotos}
      onExitGuestView={onExitGuestView}
    />
  );
};

export default GuestAlbumPage;
