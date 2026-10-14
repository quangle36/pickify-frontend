import type { Album } from "../types/album.types";

export function mergeOwnerAlbumSnapshot(
  album: Album,
  photoAlbum: Partial<Album>,
): Album {
  return {
    ...album,
    ...photoAlbum,
    // Settings mutations refresh the album query independently of paginated photos.
    selectionLocked: album.selectionLocked,
    imageProtectionEnabled: album.imageProtectionEnabled,
    selectionLimit: album.selectionLimit,
  };
}
