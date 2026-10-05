import { describe, expect, it } from "vitest";
import {
  captureTimeIso,
  localCaptureTimeInput,
  formatClockOffset,
} from "../src/features/photographer/utils/photoTime";
import { createAlbumSchema } from "../src/features/photographer/schemas/album.schema";
describe("camera clocks", () => {
  it("converts correction input using the shoot timezone rather than the browser timezone", () => {
    const value = "2026-10-04T08:01:02";
    expect(captureTimeIso(value)).toBe("2026-10-04T01:01:02.000Z");
    expect(localCaptureTimeInput(captureTimeIso(value))).toBe(value);
    expect(captureTimeIso("")).toBeNull();
    expect(formatClockOffset(-3661)).toBe("−1 giờ 1 phút 1 giây");
  });
  it("validates multi-camera links and rejects duplicate folders even with different URL aliases", () => {
    const base = { name: "Chụp cưới", password: "1234", selectionLimit: 50 };
    const first = {
      label: "Sony",
      folderUrl: "https://drive.google.com/drive/folders/abcdef123456",
    };
    const second = {
      label: "Canon",
      folderUrl:
        "https://drive.google.com/drive/u/1/folders/abcdef123456?resourcekey=key",
    };
    expect(
      createAlbumSchema.safeParse({ ...base, sources: [first, second] })
        .success,
    ).toBe(false);
    expect(
      createAlbumSchema.safeParse({
        ...base,
        sources: [
          first,
          {
            ...second,
            folderUrl: "https://drive.google.com/drive/folders/another12345",
          },
        ],
      }).success,
    ).toBe(true);
  });
});
