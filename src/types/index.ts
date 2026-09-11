export type AlbumStatus = 'scanning' | 'importing' | 'ready' | 'needs_attention';

export interface Album {
  id: string;
  title: string;
  folderUrl: string;
  folderId: string;
  shareId: string;
  passcode: string;
  status: AlbumStatus;
  totalPhotos: number;
  importedPhotos: number;
  selectedPhotosCount: number;
  createdAt: string;
  expiresAt: string;
  readyAt?: string;
  coverUrl: string;
  errorMessage?: string;
  guestSessionCount: number;
}

export interface Photo {
  id: string;
  albumId: string;
  driveFileId: string;
  name: string;
  thumbnailUrl: string;
  previewUrl: string;
  originalUrl: string;
  isSelected: boolean;
  selectedAt?: string;
  sizeBytes: number;
  dimensions: {
    width: number;
    height: number;
  };
  status: 'ready' | 'error';
  errorReason?: string;
}

export interface PhotographerProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  isDriveConnected: boolean;
  driveEmail: string;
  activeAlbumsCount: number;
  maxAlbumsLimit: number;
  maxPhotosLimit: number;
  albumLifespanDays: number;
}

export type ViewRole = 'landing' | 'photographer' | 'guest';

export interface SSEHeartEvent {
  albumId: string;
  photoId: string;
  photoName: string;
  isSelected: boolean;
  timestamp: string;
  totalSelected: number;
}
