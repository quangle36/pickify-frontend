import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AlbumPhotoEmptyState } from "../src/features/photographer/pages/AlbumDetailPage/components/AlbumPhotoEmptyState";
import type { Album } from "../src/features/photographer/types/album.types";

const album: Album = {
  id: "album", title: "Glamping", folderUrl: "", folderId: "folder", shareId: "share",
  slug: null, status: "scanning", totalPhotos: 0, importedPhotos: 0,
  selectedPhotosCount: 0, selectionLimit: 20, selectionLocked: false,
  createdAt: "", expiresAt: null, coverUrl: "", guestSessionCount: 0,
};
describe("album with no displayable photos", () => {
  it("reports an active scan instead of incorrectly suggesting filter changes", () => {
    const html = renderToStaticMarkup(<AlbumPhotoEmptyState album={album} />);
    expect(html).toContain('role="status"');
    expect(html).toContain("Đang quét ảnh từ Google Drive");
    expect(html).not.toContain("Không có ảnh nào phù hợp");
    expect(html).not.toContain("0/0");
  });
  it("reports preview progress while importing", () => {
    const html = renderToStaticMarkup(<AlbumPhotoEmptyState album={{ ...album, status: "importing", totalPhotos: 100, importedPhotos: 12 }} />);
    expect(html).toContain("Đã nhập 12/100 ảnh");
  });
  it("explains a failed scan instead of presenting it as an empty search", () => {
    const html = renderToStaticMarkup(<AlbumPhotoEmptyState album={{ ...album, status: "needs_attention", errorMessage: "NO_JPEG" }} />);
    expect(html).toContain('role="alert"');
    expect(html).toContain("Folder không có ảnh JPEG.");
  });
  it("keeps filter guidance for ready albums with no matching photos", () => {
    const html = renderToStaticMarkup(<AlbumPhotoEmptyState album={{ ...album, status: "ready" }} />);
    expect(html).toContain("Không có ảnh nào phù hợp");
    expect(html).toContain("Thử thay đổi bộ lọc");
  });
});
