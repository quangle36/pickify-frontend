import { FC, useState, FormEvent } from "react";
import {
  UploadCloud,
  Lock,
  AlertCircle,
  HelpCircle,
  Images,
  Link2,
  Pencil,
} from "lucide-react";
import { extractDriveFolderId } from "@/lib/utils";
import { AppModal } from "@/components/ui/app-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  albumSlugSchema,
  normalizeAlbumSlug,
} from "@/features/photographer/schemas/album.schema";
import type { Album } from "@/features/photographer/types/album.types";

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  album?: Album;
  onSubmit: (data: {
    name: string;
    slug: string;
    folderUrl: string;
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
  const [folderUrl, setFolderUrl] = useState(album?.folderUrl ?? "");
  const [passcode, setPasscode] = useState("");
  const [selectionLimit, setSelectionLimit] = useState(
    album ? String(album.selectionLimit ?? album.totalPhotos) : "",
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

    if (!folderUrl.trim()) {
      setError("Vui lòng dán đường dẫn thư mục Google Drive chứa ảnh");
      return;
    }

    const folderId = extractDriveFolderId(folderUrl);
    if (!folderId) {
      setError(
        "Link Google Drive không hợp lệ. Vui lòng dán link dạng: https://drive.google.com/drive/folders/...",
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

    setPending(true);
    let res: { success: boolean; error?: string };
    try {
      res = await onSubmit({
        name: name.trim(),
        slug: slug.trim() ? normalizeAlbumSlug(slug) : "",
        folderUrl: folderUrl.trim(),
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
      setFolderUrl("");
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
      title={album ? "Chỉnh sửa album" : "Tạo Album Mới"}
      description={
        album
          ? "Cập nhật thông tin và thiết lập chọn ảnh của album."
          : "Nhập link Google Drive để hệ thống quét và tạo ảnh xem trước"
      }
      icon={
        album ? (
          <Pencil className="h-5 w-5" />
        ) : (
          <UploadCloud className="h-5 w-5" />
        )
      }
      contentClassName="max-w-lg"
      bodyClassName="space-y-4"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={pending}
            className="rounded-xl"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="create-album-form"
            disabled={pending}
            variant="brand"
            className="rounded-xl font-bold shadow-md shadow-brand-600/25"
          >
            {pending ? "Đang lưu…" : album ? "Lưu thay đổi" : "Tạo"}
          </Button>
        </>
      }
    >
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="py-2.5 px-3.5 rounded-2xl">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="font-medium text-xs ml-2">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form
        id="create-album-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Album Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="album-name"
            className="text-xs font-bold text-stone-700 uppercase tracking-wider"
          >
            Tên Album <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="album-name"
            type="text"
            value={name}
            maxLength={120}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Tiệc cưới Tuấn & Trang — Đà Lạt"
            className="h-11 rounded-2xl"
          />
        </div>

        {/* Optional public slug */}
        <div className="space-y-1.5">
          <Label
            htmlFor="album-slug"
            className="text-xs font-bold text-stone-700 uppercase tracking-wider"
          >
            Đường dẫn album{" "}
            <span className="text-stone-400">(không bắt buộc)</span>
          </Label>
          <div className="relative">
            <Input
              id="album-slug"
              type="text"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              onBlur={() => slug.trim() && setSlug(normalizedSlug)}
              placeholder="tiec-cuoi-thu-trang"
              maxLength={200}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="h-11 rounded-2xl pl-10 font-mono text-xs"
            />
            <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>
          {normalizedSlug ? (
            <p className="break-all text-[11px] text-stone-500">
              Link xem trước:{" "}
              <span className="font-mono font-semibold text-stone-700">
                {window.location.origin}/album/{normalizedSlug}
              </span>
            </p>
          ) : (
            <p className="text-[11px] text-stone-400">
              {album
                ? "Để trống để sử dụng link chia sẻ gốc của album."
                : "Để trống để Pickify tạo ID album ngẫu nhiên như hiện tại."}
            </p>
          )}
        </div>

        {/* Drive Folder URL */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="drive-url"
              className="text-xs font-bold text-stone-700 uppercase tracking-wider"
            >
              Đường dẫn thư mục Google Drive{" "}
              <span className="text-rose-500">*</span>
            </Label>
          </div>
          <Input
            id="drive-url"
            type="url"
            value={folderUrl}
            readOnly={!!album}
            onChange={(e) => setFolderUrl(e.target.value)}
            placeholder="https://drive.google.com/drive/folders/1aBcDeFgHiJk..."
            className="h-11 rounded-2xl font-mono text-xs"
          />
          <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>
              {album
                ? "Nguồn ảnh được giữ nguyên. Tạo album mới nếu muốn dùng thư mục khác."
                : "Chỉ quét file ảnh JPEG trực tiếp trong folder, giới hạn 1.500 ảnh, tối đa 50MB/ảnh."}
            </span>
          </p>
        </div>

        {/* Guest Passcode */}
        {!album && (
          <p className="rounded-xl bg-blue-50 p-3 text-xs text-blue-900">
            Folder và ảnh bên trong phải được chia sẻ:{" "}
            <strong>Bất kỳ ai có đường liên kết — Người xem</strong>. Không cần
            kết nối tài khoản Drive.
          </p>
        )}
        <div className="space-y-1.5">
          <Label
            htmlFor="guest-passcode"
            className="text-xs font-bold text-stone-700 uppercase tracking-wider"
          >
            {album ? (
              "Mật khẩu mới (không bắt buộc)"
            ) : (
              <>
                Mật khẩu truy cập cho Khách (Passcode){" "}
                <span className="text-rose-500">*</span>
              </>
            )}
          </Label>
          <div className="relative">
            <Input
              id="guest-passcode"
              type={album ? "password" : "text"}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder={album ? "Để trống để giữ mật khẩu hiện tại" : "1234"}
              maxLength={128}
              autoComplete="new-password"
              className="h-11 rounded-2xl font-mono tracking-wider pr-10"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            {album
              ? "Đổi mật khẩu sẽ kết thúc các phiên truy cập của khách hiện tại."
              : "Khách bắt buộc phải nhập đúng mật khẩu này mới có thể xem ảnh và thả tim."}
          </p>
        </div>

        {/* Selection limit */}
        <div className="space-y-1.5">
          <Label
            htmlFor="selection-limit"
            className="text-xs font-bold text-stone-700 uppercase tracking-wider"
          >
            Số lượng ảnh khách được chọn{" "}
            <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="selection-limit"
              type="number"
              min={1}
              max={1500}
              step={1}
              inputMode="numeric"
              value={selectionLimit}
              onChange={(e) => setSelectionLimit(e.target.value)}
              className="h-11 rounded-2xl pr-10 font-mono"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
              <Images className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Khi đạt đủ số lượng này, khách cần bỏ chọn một ảnh trước khi chọn
            ảnh khác.
          </p>
        </div>

        {/* Album retention note */}
        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs text-stone-600 space-y-1">
          <p className="font-bold text-stone-800">Thời hạn lưu trữ:</p>
          <p>
            • Thời hạn lưu trữ album: <strong>30 ngày</strong> kể từ khi hoàn
            tất.
          </p>
        </div>
      </form>
    </AppModal>
  );
};
export default CreateAlbumModal;
