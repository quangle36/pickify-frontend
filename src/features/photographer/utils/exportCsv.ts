import type { Photo } from '@/features/photo/types/photo.types';
import type { Album } from '../types/album.types';
export function exportSelectedPhotosToCsv(album: Album, _photos: Photo[]): void {
  window.location.assign(`/api/albums/${album.id}/export.csv`);
}
