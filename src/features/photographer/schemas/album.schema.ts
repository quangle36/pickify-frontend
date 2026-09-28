import { z } from "zod";

function folderResourceKeyFromUrl(value: string): string | null {
  const key = new URL(value).searchParams.get("resourcekey");
  if (key && !/^[A-Za-z0-9_-]{1,256}$/.test(key)) {
    throw new Error("INVALID_RESOURCE_KEY");
  }
  return key;
}

function folderIdFromUrl(value: string): string {
  const url = new URL(value);
  const match = url.pathname.match(
    /^\/drive\/(?:u\/\d+\/)?folders\/([A-Za-z0-9_-]{10,128})\/?$/,
  );
  if (
    url.protocol !== "https:" ||
    url.hostname !== "drive.google.com" ||
    url.port ||
    url.username ||
    url.password ||
    !match
  ) {
    throw new Error("INVALID_FOLDER_URL");
  }
  folderResourceKeyFromUrl(value);
  return match[1];
}

export const albumSlugSchema = z
  .string()
  .max(200)
  .transform(normalizeAlbumSlug)
  .pipe(
    z
      .string()
      .min(3)
      .max(80)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .refine((value) => !/^[a-f0-9]{32}$/.test(value)),
  );

export const createAlbumSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    albumSlugSchema.optional(),
  ),
  password: z.string().min(4).max(128),
  selectionLimit: z.coerce.number().int().min(1).max(1500),
  folderUrl: z
    .string()
    .max(2048)
    .refine((value) => {
      try {
        folderIdFromUrl(value);
        return true;
      } catch {
        return false;
      }
    }, "Link folder Google Drive không hợp lệ"),
});

export function normalizeAlbumSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export type SelectionInput = {
  selected: boolean;
  clientMutationId: string;
};
