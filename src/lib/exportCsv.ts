import type { Album, Photo } from '@/types';
export function exportSelectedPhotosToCsv(album: Album, _photos: Photo[]): void {
  window.location.assign(`/api/albums/${album.id}/export.csv`);
}
