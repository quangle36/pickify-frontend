import { describe, expect, it } from "vitest";
import { albumFormSchema } from "../src/features/photographer/schemas/album-form.schema";

const folder = "https://drive.google.com/drive/folders/1234567890";
const valid = {
  name: " Tiệc cưới ",
  slug: "",
  passcode: "1234",
  selectionLimit: "50",
  sortMode: "capture_time",
  multipleCameras: false,
  sources: [{ label: "", folderUrl: folder }],
};

describe("album form validation", () => {
  it("accepts one unnamed camera and normalizes the API values", () => {
    expect(
      albumFormSchema().parse({ ...valid, slug: " Đám cưới Tuấn Trang " }),
    ).toMatchObject({
      name: "Tiệc cưới",
      slug: "dam-cuoi-tuan-trang",
      selectionLimit: 50,
    });
  });
  it("reports each empty required input at its own field path", () => {
    const result = albumFormSchema().safeParse({
      ...valid,
      name: " ",
      passcode: "",
      selectionLimit: "",
      sources: [{ label: "", folderUrl: "" }],
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues.map((issue) => issue.path.join("."))).toEqual(
        expect.arrayContaining([
          "name",
          "passcode",
          "selectionLimit",
          "sources.0.folderUrl",
        ]),
      );
  });
  it.each(["", "0", "1501", "2.5", "abc"])(
    "rejects selection limit %j",
    (selectionLimit) => {
      expect(
        albumFormSchema().safeParse({ ...valid, selectionLimit }).success,
      ).toBe(false);
    },
  );
  it("rejects Drive file links and foreign domains", () => {
    for (const folderUrl of [
      "https://drive.google.com/file/d/1234567890/view",
      "https://evil.test/drive/folders/1234567890",
    ]) {
      expect(
        albumFormSchema().safeParse({
          ...valid,
          sources: [{ label: "", folderUrl }],
        }).success,
      ).toBe(false);
    }
  });
  it("requires camera names only when multiple cameras are enabled", () => {
    expect(
      albumFormSchema().safeParse({ ...valid, multipleCameras: true }).success,
    ).toBe(false);
    expect(
      albumFormSchema().safeParse({
        ...valid,
        multipleCameras: true,
        sources: [{ label: "Sony", folderUrl: folder }],
      }).success,
    ).toBe(true);
  });
  it("marks duplicate names and identical folder IDs on the second camera", () => {
    const result = albumFormSchema().safeParse({
      ...valid,
      multipleCameras: true,
      sources: [
        { label: "Sony", folderUrl: folder },
        {
          label: " sony ",
          folderUrl:
            "https://drive.google.com/drive/u/1/folders/1234567890?resourcekey=sample",
        },
      ],
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues.map((issue) => issue.path.join("."))).toEqual(
        expect.arrayContaining(["sources.1.label", "sources.1.folderUrl"]),
      );
  });
  it("ignores unfinished extra cameras while single camera mode is active", () => {
    expect(
      albumFormSchema().safeParse({
        ...valid,
        sources: [...valid.sources, { label: "", folderUrl: "wrong" }],
      }).success,
    ).toBe(true);
  });
  it("allows unchanged passwords on edit and protects existing selections", () => {
    const schema = albumFormSchema({ editing: true, selectedPhotosCount: 30 });
    expect(schema.safeParse({ ...valid, passcode: "" }).success).toBe(true);
    expect(schema.safeParse({ ...valid, passcode: "x" }).success).toBe(false);
    expect(schema.safeParse({ ...valid, selectionLimit: "29" }).success).toBe(
      false,
    );
  });
});
