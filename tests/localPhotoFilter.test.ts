import { describe, expect, it } from "vitest";
import {
  copyMatches,
  createMatchPlan,
  normalizedStem,
  type PhotoMatch,
} from "../src/features/photographer/utils/localPhotoFilter";

function sourceHandle(name: string, content = name) {
  return {
    kind: "file",
    name,
    getFile: async () => ({ stream: () => new Blob([content]).stream() }),
  } as unknown as FileSystemFileHandle;
}

function destinationHandle(existing: string[] = [], failing: string[] = []) {
  const files = new Set(existing);
  const removed: string[] = [];
  const written: string[] = [];
  const handle = {
    kind: "directory",
    name: "destination",
    async getFileHandle(name: string, options?: { create?: boolean }) {
      if (!files.has(name) && !options?.create)
        throw new DOMException("Missing", "NotFoundError");
      if (options?.create) files.add(name);
      return {
        kind: "file",
        name,
        async createWritable() {
          return new WritableStream({
            write() {
              if (failing.includes(name)) throw new Error("Disk full");
              written.push(name);
            },
          });
        },
      };
    },
    async removeEntry(name: string) {
      files.delete(name);
      removed.push(name);
    },
  } as unknown as FileSystemDirectoryHandle;
  return { handle, written, removed };
}

describe("local photo matching", () => {
  it("normalizes Unicode, casing and only removes the final extension", () => {
    expect(normalizedStem("  Ảnh.Cuối.JPEG ")).toBe(
      normalizedStem("ẢNH.CUỐI.arw"),
    );
  });

  it("matches selected JPEG names to the requested RAW format", () => {
    const plan = createMatchPlan(
      ["DSC_001.JPG", "trip.final.jpeg", "missing.jpg"],
      [sourceHandle("dsc_001.ARW"), sourceHandle("TRIP.FINAL.arw")],
      "ARW",
    );
    expect(plan.matches.map((match) => match.sourceName)).toEqual([
      "dsc_001.ARW",
      "TRIP.FINAL.arw",
    ]);
    expect(plan.missing).toEqual(["missing.jpg"]);
  });

  it("supports every configured extension and de-duplicates selected stems", () => {
    for (const format of [
      "CR2",
      "CR3",
      "NEF",
      "RAF",
      "DNG",
      "ORF",
      "RW2",
      "PNG",
    ] as const) {
      const plan = createMatchPlan(
        ["IMG_01.JPG", "img_01.jpeg"],
        [sourceHandle(`img_01.${format.toLowerCase()}`)],
        format,
      );
      expect(plan.matches).toHaveLength(1);
      expect(plan.missing).toHaveLength(0);
    }
  });

  it("prefers the selected JPEG extension and reports unresolved collisions", () => {
    const files = [sourceHandle("one.jpg"), sourceHandle("one.jpeg")];
    expect(
      createMatchPlan(["one.JPG"], files, "JPEG").matches[0].sourceName,
    ).toBe("one.jpg");
    const conflict = createMatchPlan(
      ["one.png"],
      [sourceHandle("ONE.JPG"), sourceHandle("one.jpg")],
      "JPEG",
    );
    expect(conflict.conflicts[0].candidates).toEqual(["ONE.JPG", "one.jpg"]);
  });
});

describe("local photo copying", () => {
  const matches: PhotoMatch[] = [
    {
      selectedName: "one.jpg",
      sourceName: "one.arw",
      source: sourceHandle("one.arw"),
    },
    {
      selectedName: "two.jpg",
      sourceName: "two.arw",
      source: sourceHandle("two.arw"),
    },
    {
      selectedName: "three.jpg",
      sourceName: "three.arw",
      source: sourceHandle("three.arw"),
    },
  ];

  it("copies files, skips existing names and reports progress", async () => {
    const destination = destinationHandle(["two.arw"]);
    const progress: number[] = [];
    const result = await copyMatches(matches, destination.handle, {
      shouldStop: () => false,
      onProgress: (completed) => progress.push(completed),
    });
    expect(result.copied).toEqual(["one.arw", "three.arw"]);
    expect(result.existing).toEqual(["two.arw"]);
    expect(destination.written).toEqual(["one.arw", "three.arw"]);
    expect(progress.at(-1)).toBe(3);
  });

  it("removes a newly-created partial file when writing fails", async () => {
    const destination = destinationHandle([], ["one.arw"]);
    const result = await copyMatches([matches[0]], destination.handle, {
      shouldStop: () => false,
      onProgress: () => undefined,
    });
    expect(result.failures).toEqual([{ name: "one.arw", reason: "Disk full" }]);
    expect(destination.removed).toEqual(["one.arw"]);
  });

  it("stops safely before starting the next file", async () => {
    const destination = destinationHandle();
    let stop = false;
    const result = await copyMatches(matches, destination.handle, {
      shouldStop: () => stop,
      onProgress: (completed) => {
        if (completed === 1) stop = true;
      },
    });
    expect(result.copied).toEqual(["one.arw"]);
    expect(result.stopped).toBe(true);
  });
});
