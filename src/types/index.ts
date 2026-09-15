export type AlbumStatus =
  | "scanning"
  | "importing"
  | "ready"
  | "needs_attention"
  | "expired"
  | "deleting"
  | "deleted";

export interface Album {
  id: string;
  title: string;
  folderUrl: string;
  folderId: string;
  shareId: string;
  status: AlbumStatus;
  totalPhotos: number;
  importedPhotos: number;
  selectedPhotosCount: number;
  createdAt: string;
  expiresAt: string | null;
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
  displayUrl: string;
  originalUrl: string;
  isSelected: boolean;
  selectedAt?: string;
  sizeBytes: number;
  dimensions: {
    width: number;
    height: number;
  };
  status: "processing" | "ready" | "error";
  errorReason?: string;
}

export interface PhotographerProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  activeAlbumsCount: number;
  maxAlbumsLimit: number;
  maxPhotosLimit: number;
  albumLifespanDays: number;
}

export type ViewRole = "landing" | "photographer" | "guest";
