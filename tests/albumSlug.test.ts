import { describe, expect, it } from "vitest";
import {
  albumSlugSchema,
  createAlbumSchema,
  normalizeAlbumSlug,
} from "../src/features/photographer/schemas/album.schema";

const validAlbum = {
  name: "Tiệc cưới",
  password: "1234",
  selectionLimit: 50,
  folderUrl: "https://drive.google.com/drive/folders/1234567890",
};

describe("album slug", () => {
  it("normalizes Vietnamese text into a URL-safe slug", () => {
    expect(normalizeAlbumSlug("  Đám Cưới — Thu & Trang!!!  ")).toBe(
      "dam-cuoi-thu-trang",
    );
    expect(albumSlugSchema.parse("Tiệc cưới Thu Trang")).toBe(
      "tiec-cuoi-thu-trang",
    );
  });

  it("keeps slug optional and rejects ambiguous legacy identifiers", () => {
    expect(createAlbumSchema.parse({ ...validAlbum, slug: "" }).slug).toBe(
      undefined,
    );
    expect(
      albumSlugSchema.safeParse("abcdefabcdefabcdefabcdefabcdefab").success,
    ).toBe(false);
    expect(albumSlugSchema.safeParse("🎉").success).toBe(false);
  });
});
