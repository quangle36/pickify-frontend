import type { Album } from "@/features/photographer/types/album.types";

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

export interface PhotoPage {
  photos: Photo[];
  nextCursor: string | null;
  album: Partial<Album> & { id: string };
}

export interface PhotoFilters {
  selected: boolean;
  search: string;
}
