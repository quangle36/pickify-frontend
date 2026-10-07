import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FolderInput,
  FolderOutput,
  ArrowRight,
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
      description="Sao chép ảnh khách đã tim từ thư mục trên máy."
      contentClassName="max-w-[560px] rounded-2xl"
      headerClassName="px-5 py-5 min-[700px]:px-7 min-[700px]:py-6 [&_h2]:text-lg [&_h2]:font-semibold min-[700px]:[&_h2]:text-xl [&_p]:mt-1.5"
      bodyClassName="space-y-5 bg-white px-5 py-5 min-[700px]:px-7 min-[700px]:py-6"
      footerClassName="px-5 py-4 min-[700px]:px-7"
      footer={supported ? (
        <div className="flex w-full justify-end">
          {running ? (
            <Button
              variant="dark"
              onClick={() => { stopRequested.current = true; }}
              className="min-h-11 gap-2 min-[700px]:min-h-10"
            >
              <Square className="h-4 w-4" />
              Dừng sau file hiện tại
            </Button>
          ) : (
            <Button
              variant="dark"
              disabled={!format || !source || !destination || (multipleCameras && !cameraSourceId)}
              onClick={() => void startFiltering()}
              className="min-h-11 min-[700px]:min-h-10"
            >
              {summary ? "Lọc lại" : "Bắt đầu lọc ảnh"}
            </Button>
          )}
        </div>
      ) : undefined}
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
              <Label htmlFor="local-camera-source" className="text-xs font-semibold">Máy ảnh cần lấy file</Label>
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
                <SelectTrigger id="local-camera-source" className="h-11 rounded-xl border-stone-300 bg-white px-3 text-sm font-medium min-[700px]:h-10">
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
                Ảnh của mỗi máy được lưu vào thư mục con riêng để tránh trùng tên.
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label
              htmlFor="local-photo-format"
              className="text-xs font-semibold text-stone-900"
            >
              Định dạng file cần lấy
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
                className="h-11 rounded-xl border-stone-300 bg-white px-3 text-sm font-medium min-[700px]:h-10"
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

          <div className="relative grid gap-3 min-[700px]:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              disabled={running}
              onClick={() => void chooseDirectory("source")}
              title={source?.name}
              className="h-auto min-h-11 min-w-0 justify-start gap-3 whitespace-normal rounded-xl border-stone-200 bg-white px-4 py-3.5 text-left min-[700px]:min-h-[150px] min-[700px]:flex-col min-[700px]:items-start hover:bg-stone-100"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-stone-100 text-stone-600">
                <FolderInput className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block break-words text-[13px] font-semibold text-stone-900 [overflow-wrap:anywhere]">
                  {source?.name ?? "Chọn thư mục ảnh gốc"}
                </span>
                <span className="mt-0.5 block text-[11px] font-normal text-stone-500">
                  Thư mục nguồn · chứa ảnh gốc
                </span>
              </span>
              <span className="shrink-0 text-[11px] font-normal text-stone-500">
                {source ? "Đổi" : "Chọn"}
              </span>
            </Button>
            <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 min-[700px]:flex">
              <ArrowRight className="h-4 w-4" />
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={running}
              onClick={() => void chooseDirectory("destination")}
              title={destination?.name}
              className="h-auto min-h-11 min-w-0 justify-start gap-3 whitespace-normal rounded-xl border-stone-200 bg-white px-4 py-3.5 text-left min-[700px]:min-h-[150px] min-[700px]:flex-col min-[700px]:items-start hover:bg-stone-100"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-stone-100 text-stone-600">
                <FolderOutput className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block break-words text-[13px] font-semibold text-stone-900 [overflow-wrap:anywhere]">
                  {destination?.name ?? "Chọn nơi lưu ảnh đã lọc"}
                </span>
                <span className="mt-0.5 block text-[11px] font-normal text-stone-500">
                  Thư mục đích · lưu bản sao
                </span>
              </span>
              <span className="shrink-0 text-[11px] font-normal text-stone-500">
                {destination ? "Đổi" : "Chọn"}
              </span>
            </Button>
          </div>

          {running && (
            <div className="space-y-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
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
            <div className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
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
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="rounded-xl bg-stone-50 p-3"
                  >
                    <span className={`block text-xl font-semibold text-stone-900`}>
                      {value}
                    </span>
                    <span className="text-[10px] font-normal text-stone-500">
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
