import { z } from "zod";
import {
  albumSlugSchema,
  driveFolderUrlSchema,
  MAX_ALBUM_SOURCES,
  normalizeAlbumSlug,
} from "./album.schema";

export function albumFormSchema({
  editing = false,
  selectedPhotosCount = 0,
}: { editing?: boolean; selectedPhotosCount?: number } = {}) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Nhập tên album.")
        .max(120, "Tên album tối đa 120 ký tự."),
      slug: z
        .string()
        .trim()
        .refine(
          (value) => !value || albumSlugSchema.safeParse(value).success,
          "Đường dẫn cần 3–80 ký tự, gồm chữ, số hoặc dấu gạch ngang.",
        )
        .transform(normalizeAlbumSlug),
      passcode: z
        .string()
        .max(128, "Mật khẩu tối đa 128 ký tự.")
        .refine(
          (value) => (editing && !value) || value.length >= 4,
          "Mật khẩu khách cần ít nhất 4 ký tự.",
        ),
      selectionLimit: z
        .string()
        .trim()
        .min(1, "Nhập số ảnh khách được chọn.")
        .pipe(
          z.coerce
            .number()
            .int("Nhập một số nguyên.")
            .min(1, "Số ảnh phải từ 1 đến 1.500.")
            .max(1500, "Số ảnh phải từ 1 đến 1.500."),
        )
        .refine(
          (value) => !editing || value >= selectedPhotosCount,
          `Giới hạn không được thấp hơn ${selectedPhotosCount} ảnh đã chọn.`,
        ),
      sortMode: z.enum(["capture_time", "source"]),
      multipleCameras: z.boolean(),
      sources: z
        .array(
          z.object({ label: z.string().trim(), folderUrl: z.string().trim() }),
        )
        .min(1)
        .max(MAX_ALBUM_SOURCES),
    })
    .superRefine((input, ctx) => {
      if (editing) return;
      const sources = input.multipleCameras
        ? input.sources
        : input.sources.slice(0, 1);
      const names = new Set<string>();
      const folders = new Set<string>();
      sources.forEach((source, index) => {
        const issue = (field: "label" | "folderUrl", message: string) =>
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["sources", index, field],
            message,
          });
        if (input.multipleCameras) {
          const name = source.label.toLocaleLowerCase();
          if (!name) issue("label", "Nhập tên máy ảnh.");
          else if (source.label.length > 60)
            issue("label", "Tên máy ảnh tối đa 60 ký tự.");
          else if (names.has(name))
            issue("label", "Tên máy ảnh này đã được dùng.");
          names.add(name);
        }
        if (!source.folderUrl)
          issue("folderUrl", "Dán link thư mục Google Drive.");
        else if (!driveFolderUrlSchema.safeParse(source.folderUrl).success)
          issue(
            "folderUrl",
            "Dùng link thư mục Google Drive, không phải link một ảnh.",
          );
        else {
          // Resource keys and account prefixes do not make a folder a new source.
          const folder = new URL(source.folderUrl).pathname
            .split("/")
            .filter(Boolean)
            .slice(-1)[0];
          if (folders.has(folder))
            issue("folderUrl", "Thư mục này đã được dùng cho máy khác.");
          folders.add(folder);
        }
      });
    });
}

export type AlbumFormInput = z.input<ReturnType<typeof albumFormSchema>>;
export type AlbumFormOutput = z.output<ReturnType<typeof albumFormSchema>>;
