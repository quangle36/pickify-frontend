import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FolderInput,
  FolderOutput,
  HardDrive,
  Loader2,
  Square,
} from "lucide-react";
import type { AlbumSource } from "@/features/photographer/types/album.types";
import { albumService } from "@/features/photographer/services/album.service";
import {
  PHOTO_FORMATS,
  cameraDestinationName,
  copyMatches,
  createMatchPlan,
  listTopLevelFiles,
  supportsLocalPhotoFiltering,
  type CopyResult,
  type MatchPlan,
  type PhotoFormat,
} from "@/features/photographer/utils/localPhotoFilter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppModal } from "@/components/ui/app-modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocalPhotoFilterModalProps {
  albumId: string;
  sources?: AlbumSource[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RunSummary {
  plan: MatchPlan;
  copy: CopyResult;
  selectedCount: number;
}

function readableError(error: unknown) {
  if (error instanceof DOMException && error.name === "NotAllowedError")
    return "Bạn chưa cấp quyền đọc hoặc ghi thư mục này.";
  if (error instanceof Error) return error.message;
  return "Không thể lọc ảnh. Vui lòng thử lại.";
}

export function LocalPhotoFilterModal({
  albumId,
  sources = [],
  open,
  onOpenChange,
}: LocalPhotoFilterModalProps) {
  const [cameraSourceId, setCameraSourceId] = useState("");
  const multipleCameras = sources.length > 1;
  const [format, setFormat] = useState<PhotoFormat | "">("");
  const [source, setSource] = useState<FileSystemDirectoryHandle | null>(null);
  const [destination, setDestination] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentName, setCurrentName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const stopRequested = useRef(false);
  const supported = supportsLocalPhotoFiltering();

  const resetRun = () => {
    setCompleted(0);
    setTotal(0);
    setCurrentName("");
    setError(null);
    setSummary(null);
  };

  const closeModal = () => {
    if (running) return;
    setCameraSourceId("");
    setFormat("");
    setSource(null);
    setDestination(null);
    resetRun();
    onOpenChange(false);
  };

  const chooseDirectory = async (kind: "source" | "destination") => {
    try {
      const handle = await window.showDirectoryPicker!({
        id: kind === "source" ? "pickify-source" : "pickify-destination",
        mode: kind === "source" ? "read" : "readwrite",
        startIn: "pictures",
      });
      if (kind === "source") setSource(handle);
      else setDestination(handle);
      resetRun();
    } catch (pickerError) {
      if (
        !(
          pickerError instanceof DOMException &&
          pickerError.name === "AbortError"
        )
      ) {
        setError(readableError(pickerError));
      }
    }
  };

  const startFiltering = async () => {
    if (
      !format ||
      !source ||
      !destination ||
      (multipleCameras && !cameraSourceId)
    ) {
      setError("Hãy chọn định dạng, thư mục nguồn và thư mục đích.");
      return;
    }
    resetRun();
    stopRequested.current = false;
    setRunning(true);
    try {
      if (await source.isSameEntry(destination)) {
        throw new Error("Thư mục nguồn và thư mục đích phải khác nhau.");
      }
      const manifest = await albumService.getSelectedFiles(
        albumId,
        undefined,
        multipleCameras ? cameraSourceId : undefined,
      );
      if (manifest.files.length === 0) {
        throw new Error(
          "Máy đã chọn hiện không có ảnh nào được khách thả tim.",
        );
      }
      const sourceFiles = await listTopLevelFiles(source);
      const plan = createMatchPlan(
        manifest.files.map((file) => file.name),
        sourceFiles,
        format,
      );
      setTotal(plan.matches.length);
      const camera = sources.find((item) => item.id === cameraSourceId);
      const targetDirectory =
        multipleCameras && camera
          ? await destination.getDirectoryHandle(
              cameraDestinationName(camera.label, camera.id),
              { create: true },
            )
          : destination;
      const copy = await copyMatches(plan.matches, targetDirectory, {
        shouldStop: () => stopRequested.current,
        onProgress: (nextCompleted, name) => {
          setCompleted(nextCompleted);
          setCurrentName(name);
        },
      });
      setSummary({ plan, copy, selectedCount: manifest.files.length });
    } catch (runError) {
      setError(readableError(runError));
    } finally {
      setRunning(false);
      setCurrentName("");
    }
  };

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <AppModal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && closeModal()}
      title="Lọc ảnh về máy"
      preventClose={running}
      contentClassName="max-w-2xl"
      bodyClassName="space-y-5"
      footer={
        running ? (
          <Button
            variant="outline"
            onClick={() => {
              stopRequested.current = true;
            }}
            className="gap-2"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
            Dừng sau file hiện tại
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={closeModal}>
              Đóng
            </Button>
            {supported && (
              <Button
                variant="dark"
                disabled={
                  !format ||
                  !source ||
                  !destination ||
                  (multipleCameras && !cameraSourceId)
                }
                onClick={() => void startFiltering()}
                className="gap-2"
              >
                <HardDrive className="h-4 w-4" />
                {summary ? "Lọc lại" : "Bắt đầu lọc ảnh"}
              </Button>
            )}
          </>
        )
      }
    >
      {!supported ? (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Trình duyệt chưa được hỗ trợ</AlertTitle>
          <AlertDescription>
            Hãy mở Lumipic bằng phiên bản Chrome hoặc Edge mới nhất qua kết nối
            HTTPS để chọn và ghi trực tiếp vào thư mục trên máy.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {multipleCameras && (
            <div className="space-y-2">
              <Label htmlFor="local-camera-source">Máy ảnh cần lấy file</Label>
              <Select
                value={cameraSourceId}
                disabled={running}
                onValueChange={(value) => {
                  setCameraSourceId(value);
                  setSource(null);
                  setDestination(null);
                  resetRun();
                }}
              >
                <SelectTrigger id="local-camera-source">
                  <SelectValue placeholder="Chọn máy ảnh" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((camera) => (
                    <SelectItem key={camera.id} value={camera.id}>
                      {camera.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-stone-500">
                Chọn thư mục ảnh gốc của máy này. Ảnh được lưu trong thư mục con
                riêng cho từng máy để tránh trùng tên.
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label
              htmlFor="local-photo-format"
              className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500"
            >
              1. Định dạng file cần lấy
            </Label>
            <Select
              value={format}
              disabled={running}
              onValueChange={(value) => {
                setFormat(value as PhotoFormat);
                resetRun();
              }}
            >
              <SelectTrigger
                id="local-photo-format"
                className="h-12 rounded-2xl border-stone-200 bg-white px-4 font-semibold shadow-xs focus:ring-rose-200"
              >
                <SelectValue placeholder="Chọn định dạng ảnh…" />
              </SelectTrigger>
              <SelectContent>
                {PHOTO_FORMATS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.value} — {item.label} (.
                    {item.extensions.join(", .")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              disabled={running}
              onClick={() => void chooseDirectory("source")}
              className="group h-auto justify-start whitespace-normal rounded-2xl border-stone-200 bg-white p-4 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-white hover:shadow-md"
            >
              <span className="min-w-0">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-100">
                  <FolderInput className="h-4.5 w-4.5" />
                </span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-stone-400">
                  2. Thư mục nguồn
                </span>
                <span className="mt-1 block truncate text-sm font-bold text-stone-900">
                  {source?.name ?? "Chọn thư mục ảnh gốc"}
                </span>
              </span>
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={running}
              onClick={() => void chooseDirectory("destination")}
              className="group h-auto justify-start whitespace-normal rounded-2xl border-stone-200 bg-white p-4 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-white hover:shadow-md"
            >
              <span className="min-w-0">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100">
                  <FolderOutput className="h-4.5 w-4.5" />
                </span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-stone-400">
                  3. Thư mục đích
                </span>
                <span className="mt-1 block truncate text-sm font-bold text-stone-900">
                  {destination?.name ?? "Chọn nơi lưu ảnh đã lọc"}
                </span>
              </span>
            </Button>
          </div>

          {running && (
            <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="flex min-w-0 items-center gap-2 font-semibold text-stone-700">
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-rose-500" />
                  <span className="truncate">
                    {currentName || "Đang chuẩn bị danh sách ảnh…"}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-stone-500">
                  {completed}/{total || "—"}
                </span>
              </div>
              <Progress value={progress} />
              <p className="text-[11px] text-stone-400">
                Nếu dừng, file đang sao chép sẽ hoàn tất trước khi quá trình kết
                thúc.
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Chưa thể lọc ảnh</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {summary && (
            <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-stone-900">
                    {summary.copy.stopped
                      ? "Đã dừng lọc ảnh"
                      : "Đã lọc ảnh xong"}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Đã kiểm tra {summary.selectedCount} lựa chọn mới nhất của
                    khách.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  [
                    "Đã sao chép",
                    summary.copy.copied.length,
                    "text-emerald-700",
                  ],
                  ["Đã tồn tại", summary.copy.existing.length, "text-blue-700"],
                  [
                    "Không tìm thấy",
                    summary.plan.missing.length,
                    "text-amber-700",
                  ],
                  [
                    "Lỗi / xung đột",
                    summary.copy.failures.length +
                      summary.plan.conflicts.length,
                    "text-rose-700",
                  ],
                ].map(([label, value, color]) => (
                  <div
                    key={String(label)}
                    className="rounded-xl bg-stone-50 p-3"
                  >
                    <span className={`block text-xl font-black ${color}`}>
                      {value}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-stone-500">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {(summary.plan.missing.length > 0 ||
                summary.plan.conflicts.length > 0 ||
                summary.copy.failures.length > 0) && (
                <div className="max-h-44 space-y-3 overflow-y-auto rounded-xl border border-stone-100 bg-stone-50 p-3 text-xs">
                  {summary.plan.missing.length > 0 && (
                    <div>
                      <p className="font-bold text-amber-800">Không tìm thấy</p>
                      <p className="mt-1 break-words font-mono text-stone-600">
                        {summary.plan.missing.join(", ")}
                      </p>
                    </div>
                  )}
                  {summary.plan.conflicts.map((conflict) => (
                    <div key={conflict.selectedName}>
                      <p className="font-bold text-rose-800">
                        Trùng file: {conflict.selectedName}
                      </p>
                      <p className="mt-1 break-words font-mono text-stone-600">
                        {conflict.candidates.join(", ")}
                      </p>
                    </div>
                  ))}
                  {summary.copy.failures.map((failure) => (
                    <div key={`${failure.name}-${failure.reason}`}>
                      <p className="font-bold text-rose-800">{failure.name}</p>
                      <p className="mt-1 text-stone-600">{failure.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </AppModal>
  );
}
