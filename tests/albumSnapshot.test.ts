import { describe, expect, it } from "vitest";
import { mergeOwnerAlbumSnapshot } from "../src/features/photographer/utils/mergeOwnerAlbumSnapshot";
import type { Album } from "../src/features/photographer/types/album.types";

const album: Album = {
  id: "album", title: "Album", folderUrl: "", folderId: "folder", shareId: "share",
  slug: null, status: "ready", totalPhotos: 10, importedPhotos: 10,
  selectedPhotosCount: 0, selectionLimit: 20, selectionLocked: true,
  createdAt: "", expiresAt: null, coverUrl: "",
  guestSessionCount: 0,
};

describe("owner album settings with a stale photo cache", () => {
  it.each([true, false])("keeps the saved selection lock %s while photo metadata stays cached", (enabled) => {
    const savedAlbum = { ...album, selectionLocked: enabled };
    const stalePhotoSnapshot = {
      selectionLocked: !enabled,
      selectedPhotosCount: 5,
      coverUrl: "/cover.jpg",
    };
    const displayed = mergeOwnerAlbumSnapshot(savedAlbum, stalePhotoSnapshot);
    expect(displayed.selectionLocked).toBe(enabled);
    expect(displayed.selectedPhotosCount).toBe(5);
    expect(displayed.coverUrl).toBe("/cover.jpg");
  });
});
