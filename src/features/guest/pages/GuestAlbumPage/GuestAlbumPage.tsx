import { FC } from 'react';
import { Album } from '@/types';
import { GuestPasscodeModal } from './components/GuestPasscodeModal';
import { GuestAlbumView } from './components/GuestAlbumView';

interface GuestAlbumPageProps {
  album: Album;
  guestVerified: boolean;
  onVerified: () => void;
  onExitGuestView: () => void;
}

const GuestAlbumPage: FC<GuestAlbumPageProps> = ({
  album,
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
      onExitGuestView={onExitGuestView}
    />
  );
};

export default GuestAlbumPage;
