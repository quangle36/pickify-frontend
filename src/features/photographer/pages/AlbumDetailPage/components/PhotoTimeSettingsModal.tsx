import { useState } from "react";
import { AppModal } from "@/components/ui/app-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { errorMessage } from "@/api/errors";
import type {
  Album,
  PhotoSortMode,
} from "@/features/photographer/types/album.types";
import { useSourceTimePhotos } from "@/features/photographer/queries/album.queries";
import {
  useSetPhotoOrder,
  useSetSourceClock,
  useSetPhotoCaptureTime,
} from "@/features/photographer/queries/album.mutations";
import {
  captureTimeIso,
  localCaptureTimeInput,
  formatShotTime,
  formatClockOffset,
} from "@/features/photographer/utils/photoTime";

export function PhotoTimeSettingsModal({
  album,
  open,
  onOpenChange,
}: {
  album: Album;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [sourceId, setSourceId] = useState(album.sources?.[0]?.id ?? "");
  const [photoId, setPhotoId] = useState("");
  const [correctTime, setCorrectTime] = useState("");
  const [scope, setScope] = useState<"source" | "photo">("source");
  const [error, setError] = useState("");
  const order = useSetPhotoOrder();
  const clock = useSetSourceClock();
  const photoTime = useSetPhotoCaptureTime();
  const timePhotos = useSourceTimePhotos(album.id, sourceId, open);
  const source = album.sources?.find((item) => item.id === sourceId);
  const photo = timePhotos.data?.photos.find((item) => item.id === photoId);
  const pending = order.isPending || clock.isPending || photoTime.isPending;
  const iso = captureTimeIso(correctTime);
  const offset =
    iso && photo?.capturedAt
      ? Math.round(
          (new Date(iso).getTime() - new Date(photo.capturedAt).getTime()) /
            1000,
        )
      : null;
  const run = async (action: () => Promise<unknown>, message: string) => {
    setError("");
    try {
      await action();
      toast({ description: message });
    } catch (failure) {
      setError(errorMessage(failure));
    }
  };
  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      preventClose={pending}
      title="Sắp xếp & đồng bộ giờ"
      description="Giữ giờ gốc của ảnh, điều chỉnh riêng từng máy khi đồng hồ bị sai."
      contentClassName="w-[calc(100%-2rem)] max-w-lg rounded-2xl sm:rounded-2xl"
      headerClassName="px-5 py-5 sm:px-6 [&_h2]:text-xl [&_h2]:font-semibold"
      bodyClassName="space-y-5 px-5 sm:px-6"
      footer={
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={pending}
        >
          Đóng
        </Button>
      }
    >
      <div className="space-y-2">
        <Label htmlFor="photo-order-mode">Thứ tự trong album</Label>
        <Select
          value={album.sortMode ?? "source"}
          disabled={pending}
          onValueChange={(value) =>
            void run(
              () =>
                order.mutateAsync({
                  albumId: album.id,
                  sortMode: value as PhotoSortMode,
                }),
              "Đã cập nhật thứ tự ảnh.",
            )
          }
        >
          <SelectTrigger id="photo-order-mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="capture_time">
              Thời gian chụp · trộn ảnh các máy
            </SelectItem>
            <SelectItem value="source">
              Theo từng máy · thứ tự tên file
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-stone-500">
          Ảnh thiếu giờ chụp nằm cuối khi sắp xếp theo thời gian. Giờ hiển thị
          là giờ Việt Nam (UTC+7).
        </p>
      </div>
      {!!album.sources?.length && (
        <div className="space-y-4 border-t border-stone-200 pt-4">
          <div className="space-y-2">
            <Label htmlFor="clock-source">Máy cần đồng bộ giờ</Label>
            <Select
              value={sourceId}
              disabled={pending}
              onValueChange={(value) => {
                setSourceId(value);
                setPhotoId("");
                setCorrectTime("");
                setError("");
              }}
            >
              <SelectTrigger id="clock-source">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {album.sources.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label} · {item.photoCount} ảnh
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-stone-500">
              Độ lệch hiện tại:{" "}
              {formatClockOffset(source?.clockOffsetSeconds ?? 0)}
            </p>
          </div>
          {source?.suspectClock && (
            <Alert variant="warning">
              <AlertDescription>
                Giờ của máy này khác xa các máy còn lại hoặc ngày tạo album. Nếu
                máy bị reset giờ do pin CMOS, chọn một ảnh và nhập đúng ngày,
                giờ chụp.
              </AlertDescription>
            </Alert>
          )}
          {!!source?.missingTimeCount && (
            <p className="text-xs text-amber-700">
              {source.missingTimeCount} ảnh thiếu giờ chụp. Bạn có thể đặt giờ
              riêng cho từng ảnh.
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="clock-reference-photo">Ảnh làm mốc</Label>
            <Select
              value={photoId}
              disabled={pending || timePhotos.isPending || timePhotos.isError}
              onValueChange={(value) => {
                setPhotoId(value);
                const selected = timePhotos.data?.photos.find(
                  (item) => item.id === value,
                );
                setCorrectTime(
                  localCaptureTimeInput(selected?.correctedCapturedAt),
                );
                if (!selected?.capturedAt) setScope("photo");
                setError("");
              }}
            >
              <SelectTrigger id="clock-reference-photo">
                <SelectValue placeholder="Chọn ảnh mà bạn biết giờ chụp đúng" />
              </SelectTrigger>
              <SelectContent>
                {timePhotos.data?.photos.map((item, index) => (
                  <SelectItem key={item.id} value={item.id}>
                    {index + 1}. {item.name} · {formatShotTime(item.capturedAt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {timePhotos.isPending && (
              <p role="status" className="text-xs text-stone-500">
                Đang tải danh sách ảnh…
              </p>
            )}
            {timePhotos.isError && (
              <div role="alert" className="text-xs text-red-600">
                Không tải được ảnh.{" "}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void timePhotos.refetch()}
                >
                  Thử lại
                </Button>
              </div>
            )}
            {photo && (
              <p className="text-xs text-stone-500">
                Giờ máy ghi: {formatShotTime(photo.capturedAt)}
                <br />
                Giờ đang dùng: {formatShotTime(photo.correctedCapturedAt)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="clock-correct-time">
              Ngày, giờ chụp đúng (UTC+7)
            </Label>
            <Input
              id="clock-correct-time"
              type="datetime-local"
              step={1}
              value={correctTime}
              disabled={pending || !photo}
              onChange={(event) => setCorrectTime(event.target.value)}
              className="bg-white text-base sm:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clock-scope">Áp dụng cho</Label>
            <Select
              value={scope}
              disabled={pending}
              onValueChange={(value) => setScope(value as "source" | "photo")}
            >
              <SelectTrigger id="clock-scope">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="source" disabled={!photo?.capturedAt}>
                  Toàn bộ máy · cùng độ lệch giờ
                </SelectItem>
                <SelectItem value="photo">
                  Chỉ ảnh này · đặt giờ riêng
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-stone-500">
              Nếu máy reset giờ giữa buổi chụp, đặt giờ riêng cho ảnh bị sai. Bù
              giờ cả máy không thay đổi những ảnh đã đặt giờ riêng.
            </p>
            {scope === "source" && offset !== null && (
              <p className="text-xs text-stone-700">
                Sẽ bù: {formatClockOffset(offset)} cho giờ gốc của máy này.
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              disabled={
                pending ||
                !photo ||
                !iso ||
                (scope === "source" && !photo.capturedAt)
              }
              onClick={() => {
                if (!photo || !iso) return;
                void run(
                  () =>
                    scope === "source"
                      ? clock.mutateAsync({
                          albumId: album.id,
                          sourceId,
                          correction: {
                            referencePhotoId: photo.id,
                            correctedCapturedAt: iso,
                          },
                        })
                      : photoTime.mutateAsync({
                          albumId: album.id,
                          photoId: photo.id,
                          capturedAt: iso,
                        }),
                  "Đã đồng bộ giờ chụp.",
                );
              }}
            >
              Áp dụng giờ đúng
            </Button>
            {!!source?.clockOffsetSeconds && (
              <Button
                variant="outline"
                disabled={pending}
                onClick={() =>
                  void run(
                    () =>
                      clock.mutateAsync({
                        albumId: album.id,
                        sourceId,
                        correction: { offsetSeconds: 0 },
                      }),
                    "Đã bỏ bù giờ cho máy.",
                  )
                }
              >
                Bỏ bù giờ máy
              </Button>
            )}
            {photo?.captureTimeOverridden && (
              <Button
                variant="outline"
                disabled={pending}
                onClick={() =>
                  void run(
                    () =>
                      photoTime.mutateAsync({
                        albumId: album.id,
                        photoId: photo.id,
                        capturedAt: null,
                      }),
                    "Đã bỏ giờ riêng của ảnh.",
                  )
                }
              >
                Bỏ giờ riêng của ảnh
              </Button>
            )}
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </AppModal>
  );
}
