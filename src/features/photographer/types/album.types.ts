export type PhotoSortMode = "source" | "capture_time";
export interface AlbumSourceInput {
  label: string;
  folderUrl: string;
}
export interface AlbumSource extends AlbumSourceInput {
  id: string;
  folderId: string;
  position: number;
  clockOffsetSeconds: number;
  photoCount: number;
  missingTimeCount: number;
  firstCapturedAt: string | null;
  lastCapturedAt: string | null;
  suspectClock: boolean;
}
export interface TimePhoto {
  id: string;
  name: string;
  capturedAt: string | null;
  correctedCapturedAt: string | null;
  captureTimeOverridden: boolean;
}

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
  sources?: AlbumSource[];
  sortMode?: PhotoSortMode;
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
