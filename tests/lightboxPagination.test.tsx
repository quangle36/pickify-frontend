import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LightboxModal } from "../src/features/photo/components/LightboxModal";
import type { Photo } from "../src/features/photo/types/photo.types";

const photos: Photo[] = Array.from({ length: 60 }, (_, index) => ({
  id: `photo-${index}`,
  albumId: "album",
  position: index + 1,
  driveFileId: `drive-${index}`,
  name: `${index + 1}.jpg`,
  displayUrl: "/photo.jpg",
  originalUrl: "",
  isSelected: false,
  sizeBytes: 100,
  dimensions: { width: 640, height: 480 },
  status: "ready",
}));

describe("lightbox pagination boundary", () => {
  const render = (hasMorePhotos: boolean, loadingMorePhotos = false) =>
    renderToStaticMarkup(
      <LightboxModal
        photos={photos}
        totalPhotos={719}
        currentIndex={59}
        isOpen
        hasMorePhotos={hasMorePhotos}
        loadingMorePhotos={loadingMorePhotos}
        onLoadMorePhotos={async () => {}}
        onClose={() => {}}
        onNavigate={() => {}}
        onToggleSelection={() => {}}
      />,
    );

  it("keeps the forward button at photo 60 while the next page exists", () => {
    expect(render(true)).toContain('title="Ảnh tiếp theo (Phím →)"');
  });

  it("keeps the forward button visible with a loading indicator during pagination", () => {
    const html = render(true, true);
    expect(html).toContain('title="Ảnh tiếp theo (Phím →)"');
    expect(html).toContain('aria-busy="true"');
  });

  it("hides forward at the end of a filtered result even if the album has more photos", () => {
    expect(render(false)).not.toContain('title="Ảnh tiếp theo (Phím →)"');
  });
});
