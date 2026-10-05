import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AlbumPhotoGrid } from "../src/features/photographer/pages/AlbumDetailPage/components/AlbumPhotoGrid";
import type { Photo } from "../src/features/photo/types/photo.types";

function makePhotos(count: number): Photo[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `photo-${index}`,
    albumId: "album",
    position: index,
    driveFileId: `drive-${index}`,
    name: `photo-${index}.jpg`,
    displayUrl: `/photo-${index}.jpg`,
    originalUrl: `/original-${index}.jpg`,
    isSelected: false,
    sizeBytes: 1000,
    dimensions: { width: 1067, height: 1600 },
    status: "ready",
  }));
}

describe("album photo grid initial render", () => {
  it("bounds the card mount work when returning to a large cached album", () => {
    const html = renderToStaticMarkup(
      <AlbumPhotoGrid photos={makePhotos(719)} className="grid" onOpenLightbox={() => {}} />,
    );
    const imageCount = (html.match(/<img /g) ?? []).length;
    expect(imageCount).toBeGreaterThan(0);
    expect(imageCount).toBeLessThanOrEqual(100);
    expect(html).toContain('alt="photo-0.jpg"');
    expect(html).not.toContain('alt="photo-718.jpg"');
  });

  it("renders every photo in a small result without changing the order", () => {
    const html = renderToStaticMarkup(
      <AlbumPhotoGrid photos={makePhotos(3)} className="grid" onOpenLightbox={() => {}} />,
    );
    expect((html.match(/<img /g) ?? []).length).toBe(3);
    expect(html.indexOf('alt="photo-0.jpg"')).toBeLessThan(html.indexOf('alt="photo-2.jpg"'));
  });
});
