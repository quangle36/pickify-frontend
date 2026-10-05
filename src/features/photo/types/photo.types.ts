import type { Album } from "@/features/photographer/types/album.types";

export interface Photo {
  id: string;
  albumId: string;
  position: number;
  driveFileId: string;
  name: string;
  displayUrl: string;
  originalUrl: string;
  isSelected: boolean;
  selectedAt?: string;
  commentCount?: number;
  sourceId?: string | null;
  sourceLabel?: string;
  capturedAt?: string | null;
  correctedCapturedAt?: string | null;
  captureTimeOverridden?: boolean;
  sizeBytes: number;
  dimensions: {
    width: number;
    height: number;
  };
  status: "processing" | "ready" | "error";
  errorReason?: string;
}

export interface PhotoPage {
  photos: Photo[];
  nextCursor: string | null;
  album: Partial<Album> & { id: string };
}

export interface PhotoFilters {
  selected: boolean;
  search: string;
}

export interface PhotoComment {
  id: string;
  photoId: string;
  content: string;
  createdAt: string;
}
export interface CommentPage {
  comments: PhotoComment[];
  nextCursor: string | null;
}
