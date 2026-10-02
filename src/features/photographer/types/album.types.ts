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
  slug: string | null;
  status: AlbumStatus;
  totalPhotos: number;
  importedPhotos: number;
  selectedPhotosCount: number;
  selectionLimit: number | null;
  selectionLocked: boolean;
  sharePreviewEnabled?: boolean;
  createdAt: string;
  expiresAt: string | null;
  readyAt?: string;
  coverUrl: string;
  errorMessage?: string;
  guestSessionCount: number;
}

export interface PhotographerProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  activeAlbumsCount: number;
  maxPhotosLimit: number;
  albumLifespanDays: number;
}
