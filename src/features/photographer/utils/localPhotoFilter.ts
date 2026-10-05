export const PHOTO_FORMATS = [
  { value: "ARW", label: "Sony RAW", extensions: ["arw"] },
  { value: "CR2", label: "Canon RAW", extensions: ["cr2"] },
  { value: "CR3", label: "Canon RAW", extensions: ["cr3"] },
  { value: "NEF", label: "Nikon RAW", extensions: ["nef"] },
  { value: "RAF", label: "Fujifilm RAW", extensions: ["raf"] },
  { value: "DNG", label: "Adobe Digital Negative", extensions: ["dng"] },
  { value: "ORF", label: "Olympus RAW", extensions: ["orf"] },
  { value: "RW2", label: "Panasonic RAW", extensions: ["rw2"] },
  { value: "JPEG", label: "JPEG", extensions: ["jpg", "jpeg"] },
  { value: "PNG", label: "PNG", extensions: ["png"] },
] as const;

export type PhotoFormat = (typeof PHOTO_FORMATS)[number]["value"];

export interface PhotoMatch {
  selectedName: string;
  sourceName: string;
  source: FileSystemFileHandle;
}

export interface MatchConflict {
  selectedName: string;
  candidates: string[];
}

export interface MatchPlan {
  matches: PhotoMatch[];
  missing: string[];
  conflicts: MatchConflict[];
}

export interface CopyFailure {
  name: string;
  reason: string;
}

export interface CopyResult {
  copied: string[];
  existing: string[];
  failures: CopyFailure[];
  stopped: boolean;
}

export function normalizedExtension(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0
    ? name
        .slice(dot + 1)
        .normalize("NFC")
        .toLocaleLowerCase()
    : "";
}

export function normalizedStem(name: string) {
  const normalized = name.normalize("NFC").trim();
  const dot = normalized.lastIndexOf(".");
  return (dot > 0 ? normalized.slice(0, dot) : normalized).toLocaleLowerCase();
}

function formatExtensions(format: PhotoFormat): readonly string[] {
  return PHOTO_FORMATS.find((item) => item.value === format)!.extensions;
}

export async function listTopLevelFiles(directory: FileSystemDirectoryHandle) {
  const files: FileSystemFileHandle[] = [];
  for await (const handle of directory.values()) {
    if (handle.kind === "file") files.push(handle as FileSystemFileHandle);
  }
  return files;
}

export function createMatchPlan(
  selectedNames: readonly string[],
  sourceFiles: readonly FileSystemFileHandle[],
  format: PhotoFormat,
): MatchPlan {
  const allowedExtensions = new Set(formatExtensions(format));
  const candidatesByStem = new Map<string, FileSystemFileHandle[]>();
  for (const file of sourceFiles) {
    if (!allowedExtensions.has(normalizedExtension(file.name))) continue;
    const stem = normalizedStem(file.name);
    candidatesByStem.set(stem, [...(candidatesByStem.get(stem) ?? []), file]);
  }

  const matches: PhotoMatch[] = [];
  const missing: string[] = [];
  const conflicts: MatchConflict[] = [];
  const seenStems = new Set<string>();
  for (const selectedName of selectedNames) {
    const stem = normalizedStem(selectedName);
    if (seenStems.has(stem)) continue;
    seenStems.add(stem);
    const candidates = candidatesByStem.get(stem) ?? [];
    if (candidates.length === 0) {
      missing.push(selectedName);
      continue;
    }
    if (candidates.length === 1) {
      matches.push({
        selectedName,
        sourceName: candidates[0].name,
        source: candidates[0],
      });
      continue;
    }

    if (format === "JPEG") {
      const selectedExtension = normalizedExtension(selectedName);
      const sameExtension = candidates.filter(
        (candidate) =>
          normalizedExtension(candidate.name) === selectedExtension,
      );
      if (sameExtension.length === 1) {
        matches.push({
          selectedName,
          sourceName: sameExtension[0].name,
          source: sameExtension[0],
        });
        continue;
      }
    }
    conflicts.push({
      selectedName,
      candidates: candidates.map((candidate) => candidate.name).sort(),
    });
  }
  return { matches, missing, conflicts };
}

function isNotFound(error: unknown) {
  return error instanceof DOMException && error.name === "NotFoundError";
}

async function destinationContains(
  directory: FileSystemDirectoryHandle,
  name: string,
) {
  try {
    await directory.getFileHandle(name);
    return true;
  } catch (error) {
    if (isNotFound(error)) return false;
    throw error;
  }
}

function failureReason(error: unknown) {
  if (error instanceof DOMException && error.name === "NotAllowedError")
    return "Quyền truy cập thư mục đã bị từ chối";
  return error instanceof Error ? error.message : "Không thể sao chép file";
}

export async function copyMatches(
  matches: readonly PhotoMatch[],
  destination: FileSystemDirectoryHandle,
  options: {
    shouldStop: () => boolean;
    onProgress: (completed: number, currentName: string) => void;
  },
): Promise<CopyResult> {
  const result: CopyResult = {
    copied: [],
    existing: [],
    failures: [],
    stopped: false,
  };
  for (const [index, match] of matches.entries()) {
    if (options.shouldStop()) {
      result.stopped = true;
      break;
    }
    options.onProgress(index, match.sourceName);
    let created = false;
    try {
      if (await destinationContains(destination, match.sourceName)) {
        result.existing.push(match.sourceName);
      } else {
        const destinationFile = await destination.getFileHandle(
          match.sourceName,
          {
            create: true,
          },
        );
        created = true;
        const writable = await destinationFile.createWritable();
        const sourceFile = await match.source.getFile();
        await sourceFile.stream().pipeTo(writable);
        result.copied.push(match.sourceName);
      }
    } catch (error) {
      if (created) {
        await destination.removeEntry(match.sourceName).catch(() => undefined);
      }
      result.failures.push({
        name: match.sourceName,
        reason: failureReason(error),
      });
    }
    options.onProgress(index + 1, match.sourceName);
  }
  return result;
}

export function supportsLocalPhotoFiltering() {
  return (
    window.isSecureContext && typeof window.showDirectoryPicker === "function"
  );
}

export function cameraDestinationName(label: string, sourceId: string) {
  const name =
    label
      .normalize("NFC")
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
      .replace(/[. ]+$/, "")
      .trim() || "Máy ảnh";
  return `${name}__${sourceId}`;
}
