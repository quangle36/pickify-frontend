import { describe, expect, it } from "vitest";
import { mergeOwnerAlbumSnapshot } from "../src/features/photographer/utils/mergeOwnerAlbumSnapshot";
import type { Album } from "../src/features/photographer/types/album.types";

const album: Album = {
  id: "album", title: "Album", folderUrl: "", folderId: "folder", shareId: "share",
  slug: null, status: "ready", totalPhotos: 10, importedPhotos: 10,
  selectedPhotosCount: 0, selectionLimit: 20, selectionLocked: true,
  sharePreviewEnabled: false, createdAt: "", expiresAt: null, coverUrl: "",
  guestSessionCount: 0,
};

describe("owner album settings with a stale photo cache", () => {
  it.each([true, false])("keeps the saved preview setting %s while photo metadata stays cached", (enabled) => {
    const savedAlbum = { ...album, sharePreviewEnabled: enabled };
    const stalePhotoSnapshot = {
      sharePreviewEnabled: !enabled,
      selectionLocked: false,
      selectedPhotosCount: 5,
      coverUrl: "/cover.jpg",
    };
    const displayed = mergeOwnerAlbumSnapshot(savedAlbum, stalePhotoSnapshot);
    expect(displayed.sharePreviewEnabled).toBe(enabled);
    expect(displayed.selectionLocked).toBe(true);
    expect(displayed.selectedPhotosCount).toBe(5);
    expect(displayed.coverUrl).toBe("/cover.jpg");
  });
});
