import { FC, useState, FormEvent } from "react";
import { AlertCircle } from "lucide-react";
import { AlbumSourceFields } from "./AlbumSourceFields";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppModal } from "@/components/ui/app-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  albumSlugSchema,
  createAlbumSchema,
  normalizeAlbumSlug,
} from "@/features/photographer/schemas/album.schema";
import type {
  Album,
  AlbumSourceInput,
  PhotoSortMode,
} from "@/features/photographer/types/album.types";

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  album?: Album;
  onSubmit: (data: {
    name: string;
    slug: string;
    sources: AlbumSourceInput[];
    sortMode: PhotoSortMode;
    passcode: string;
    selectionLimit: number;
  }) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export const CreateAlbumModal: FC<CreateAlbumModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  album,
}) => {
  const [pending, setPending] = useState(false);
  const [name, setName] = useState(album?.title ?? "");
  const [slug, setSlug] = useState(album?.slug ?? "");
  const [sources, setSources] = useState<AlbumSourceInput[]>(
    album?.sources?.length
      ? album.sources.map(({ label, folderUrl }) => ({ label, folderUrl }))
      : [{ label: "Máy 1", folderUrl: album?.folderUrl ?? "" }],
  );
  const [sortMode, setSortMode] = useState<PhotoSortMode>(
    album?.sortMode ?? "capture_time",
  );
  const [passcode, setPasscode] = useState("");
  const [selectionLimit, setSelectionLimit] = useState(
    album ? String(album.selectionLimit ?? album.totalPhotos) : "50",
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setError(null);

    if (!name.trim()) {
      setError("Vui lòng nhập tên album");
      return;
    }

    if (slug.trim() && !albumSlugSchema.safeParse(slug).success) {
      setError(
        "Slug sau khi chuẩn hóa phải có 3–80 ký tự và gồm chữ thường, số hoặc dấu gạch ngang",
      );
      return;
    }

    if (
      (!album || passcode) &&
      (passcode.length < 4 || passcode.length > 128)
    ) {
      setError("Mật khẩu khách phải có ít nhất 4 ký tự");
      return;
    }

    const parsedSelectionLimit = Number(selectionLimit);
    if (
      !Number.isInteger(parsedSelectionLimit) ||
      parsedSelectionLimit < 1 ||
      parsedSelectionLimit > 1500
    ) {
      setError("Số lượng ảnh được chọn phải từ 1 đến 1.500");
      return;
    }

    if (album && parsedSelectionLimit < album.selectedPhotosCount) {
      setError(
        `Giới hạn không được thấp hơn ${album.selectedPhotosCount} ảnh đã chọn`,
      );
      return;
    }

    if (!album) {
      const result = createAlbumSchema.safeParse({
        name,
        slug,
        sources,
        sortMode,
        password: passcode,
        selectionLimit: parsedSelectionLimit,
      });
      if (!result.success) {
        setError(result.error.issues[0].message);
        return;
      }
    }
    setPending(true);
    let res: { success: boolean; error?: string };
    try {
      res = await onSubmit({
        name: name.trim(),
        slug: slug.trim() ? normalizeAlbumSlug(slug) : "",
        sources: sources.map(({ label, folderUrl }) => ({
          label: label.trim(),
          folderUrl: folderUrl.trim(),
        })),
        sortMode,
        passcode,
        selectionLimit: parsedSelectionLimit,
      });
    } catch {
      res = { success: false, error: "Không thể lưu album. Vui lòng thử lại." };
    } finally {
      setPending(false);
    }
    if (res.success) {
      setName("");
      setSlug("");
      setSources([{ label: "Máy 1", folderUrl: "" }]);
      setSortMode("capture_time");
      setPasscode("");
      setSelectionLimit("50");
      onClose();
    } else {
      setError(res.error || "Có lỗi xảy ra khi lưu album");
    }
  };

  const normalizedSlug = normalizeAlbumSlug(slug);

  return (
    <AppModal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      preventClose={pending}
      title={album ? "Chỉnh sửa album" : "Tạo album mới"}
      description={
        album
          ? "Cập nhật thông tin và thiết lập chọn ảnh của album."
          : "Gộp ảnh từ nhiều máy ảnh vào cùng một album."
      }
      contentClassName="w-[calc(100%-2rem)] max-w-lg rounded-2xl border-stone-200 sm:rounded-2xl [&>button]:flex [&>button]:h-8 [&>button]:w-8 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-lg [&>button>svg]:h-4 [&>button>svg]:w-4"
      headerClassName="border-stone-200 px-5 py-5 sm:px-6 sm:py-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-[1.35] [&_p]:text-xs [&_p]:leading-relaxed"
      bodyClassName="space-y-[18px] bg-white px-5 py-5 sm:px-6 sm:py-6"
      footerClassName="flex-row justify-end gap-2 space-x-0 border-stone-200 bg-white px-5 py-4 sm:px-6 sm:space-x-0"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={pending}
            className="min-h-11 flex-1 sm:min-h-10 sm:flex-none"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="create-album-form"
            isLoading={pending}
            className="min-h-11 flex-1 sm:min-h-10 sm:flex-none"
          >
            {album ? "Lưu thay đổi" : "Tạo album"}
          </Button>
        </>
      }
    >
      {error && (
        <Alert
          variant="destructive"
          className="rounded-lg border-0 bg-rose-50 px-3 py-3 text-rose-700"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs leading-relaxed">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form
        id="create-album-form"
        onSubmit={handleSubmit}
        className="space-y-[18px]"
      >
        <div className="space-y-2">
          <Label
            htmlFor="album-name"
            className="text-[13px] font-medium text-stone-900"
          >
            Tên album{" "}
            <span aria-hidden="true" className="text-rose-700">
              *
            </span>
          </Label>
          <Input
            id="album-name"
            type="text"
            value={name}
            maxLength={120}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Tiệc cưới Tuấn & Trang — Đà Lạt"
            className="h-11 rounded-xl border-stone-200 bg-white text-[13px] text-stone-900 transition-colors placeholder:text-stone-500 sm:h-10"
          />
        </div>

        <AlbumSourceFields
          sources={sources}
          onChange={setSources}
          disabled={pending || !!album}
        />
        <div className="space-y-2">
          <Label htmlFor="album-sort-mode">Sắp xếp ảnh</Label>
          <Select
            value={sortMode}
            onValueChange={(value) => setSortMode(value as PhotoSortMode)}
            disabled={pending || !!album}
          >
            <SelectTrigger
              id="album-sort-mode"
              className="h-11 rounded-xl bg-white"
            >
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
            Giờ máy bị sai có thể đồng bộ sau khi import. Ảnh thiếu giờ chụp nằm
            cuối album.
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="album-slug"
            className="text-[13px] font-medium text-stone-900"
          >
            Đường dẫn tùy chỉnh{" "}
            <span className="text-xs font-normal text-stone-500">
              · không bắt buộc
            </span>
          </Label>
          <div className="flex h-11 items-center overflow-hidden rounded-xl border border-stone-200 bg-white transition-colors focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-200/50 sm:h-10">
            <span className="shrink-0 select-none pl-3 text-xs text-stone-500">
              /album/
            </span>
            <Input
              id="album-slug"
              type="text"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              onBlur={() => slug.trim() && setSlug(normalizedSlug)}
              placeholder="tiec-cuoi-tuan-trang"
              maxLength={80}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="h-full min-w-0 flex-1 rounded-none border-0 bg-white pl-[5px] font-mono text-xs text-stone-900 transition-colors placeholder:text-stone-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="guest-passcode"
              className="text-[13px] font-medium text-stone-900"
            >
              {album ? "Mật khẩu mới" : "Mật khẩu khách"}
              {album ? (
                <span className="ml-1 text-xs font-normal text-stone-500">
                  · tùy chọn
                </span>
              ) : (
                <span aria-hidden="true" className="ml-1 text-rose-700">
                  *
                </span>
              )}
            </Label>
            <Input
              id="guest-passcode"
              type={album ? "password" : "text"}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder={album ? "Giữ mật khẩu cũ" : "Ít nhất 4 ký tự"}
              maxLength={128}
              autoComplete="new-password"
              className="h-11 rounded-xl border-stone-200 bg-white text-[13px] text-stone-900 transition-colors placeholder:text-stone-500 sm:h-10"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="selection-limit"
              className="text-[13px] font-medium text-stone-900"
            >
              Số ảnh chọn tối đa{" "}
              <span aria-hidden="true" className="text-rose-700">
                *
              </span>
            </Label>
            <Input
              id="selection-limit"
              type="number"
              min={1}
              max={1500}
              step={1}
              inputMode="numeric"
              value={selectionLimit}
              onChange={(e) => setSelectionLimit(e.target.value)}
              placeholder="50"
              className="h-11 rounded-xl border-stone-200 bg-white text-[13px] text-stone-900 transition-colors placeholder:text-stone-500 sm:h-10"
            />
          </div>
        </div>
      </form>
    </AppModal>
  );
};

export default CreateAlbumModal;
