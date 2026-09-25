import { FC, useState, FormEvent } from 'react';
import { UploadCloud, Lock, AlertCircle, HelpCircle, Images } from 'lucide-react';
import { extractDriveFolderId } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; folderUrl: string; passcode: string; selectionLimit: number }) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export const CreateAlbumModal: FC<CreateAlbumModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [pending, setPending] = useState(false);
  const [name, setName] = useState('');
  const [folderUrl, setFolderUrl] = useState('');
  const [passcode, setPasscode] = useState('');
  const [selectionLimit, setSelectionLimit] = useState('50');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setError(null);

    if (!name.trim()) {
      setError('Vui lòng nhập tên album');
      return;
    }

    if (!folderUrl.trim()) {
      setError('Vui lòng dán đường dẫn thư mục Google Drive chứa ảnh');
      return;
    }

    const folderId = extractDriveFolderId(folderUrl);
    if (!folderId) {
      setError('Link Google Drive không hợp lệ. Vui lòng dán link dạng: https://drive.google.com/drive/folders/...');
      return;
    }

    if (!passcode || passcode.length < 4) {
      setError('Mật khẩu khách phải có ít nhất 4 ký tự');
      return;
    }

    const parsedSelectionLimit = Number(selectionLimit);
    if (
      !Number.isInteger(parsedSelectionLimit) ||
      parsedSelectionLimit < 1 ||
      parsedSelectionLimit > 1500
    ) {
      setError('Số lượng ảnh được chọn phải từ 1 đến 1.500');
      return;
    }

    setPending(true);
    const res = await onSubmit({
      name: name.trim(),
      folderUrl: folderUrl.trim(),
      passcode: passcode.trim(),
      selectionLimit: parsedSelectionLimit,
    });

    setPending(false);
    if (res.success) {
      setName('');
      setFolderUrl('');
      setPasscode('');
      setSelectionLimit('50');
      onClose();
    } else {
      setError(res.error || 'Có lỗi xảy ra khi tạo album');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-6 sm:p-8 rounded-3xl">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-extrabold text-stone-900">Tạo Album Mới</DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Nhập link Google Drive để hệ thống quét và tạo ảnh xem trước
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="py-2.5 px-3.5 rounded-2xl">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="font-medium text-xs ml-2">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Album Name */}
          <div className="space-y-1.5">
            <Label htmlFor="album-name" className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Tên Album <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="album-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Tiệc cưới Tuấn & Trang — Đà Lạt"
              className="h-11 rounded-2xl"
            />
          </div>

          {/* Drive Folder URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="drive-url" className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Đường dẫn thư mục Google Drive <span className="text-rose-500">*</span>
              </Label>

            </div>
            <Input
              id="drive-url"
              type="url"
              value={folderUrl}
              onChange={(e) => setFolderUrl(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/1aBcDeFgHiJk..."
              className="h-11 rounded-2xl font-mono text-xs"
            />
            <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Chỉ quét file ảnh JPEG trực tiếp trong folder, giới hạn 1.500 ảnh, tối đa 50MB/ảnh.</span>
            </p>
          </div>

          {/* Guest Passcode */}
          <p className="rounded-xl bg-blue-50 p-3 text-xs text-blue-900">Folder và ảnh bên trong phải được chia sẻ: <strong>Bất kỳ ai có đường liên kết — Người xem</strong>. Không cần kết nối tài khoản Drive.</p>
          <div className="space-y-1.5">
            <Label htmlFor="guest-passcode" className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Mật khẩu truy cập cho Khách (Passcode) <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="guest-passcode"
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="1234"
                maxLength={10}
                className="h-11 rounded-2xl font-mono tracking-wider pr-10"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Khách bắt buộc phải nhập đúng mật khẩu này mới có thể xem ảnh và thả tim.
            </p>
          </div>

          {/* Selection limit */}
          <div className="space-y-1.5">
            <Label htmlFor="selection-limit" className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Số lượng ảnh khách được chọn <span className="text-rose-500">*</span>
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
              Khi đạt đủ số lượng này, khách cần bỏ chọn một ảnh trước khi chọn ảnh khác.
            </p>
          </div>

          {/* Album retention note */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs text-stone-600 space-y-1">
            <p className="font-bold text-stone-800">Thời hạn lưu trữ:</p>
            <p>• Thời hạn lưu trữ album: <strong>30 ngày</strong> kể từ khi hoàn tất.</p>
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-xl"
            >
              Hủy
            </Button>
            <Button
              type="submit" disabled={pending}
              variant="brand"
              className="rounded-xl font-bold shadow-md shadow-brand-600/25"
            >
              Tạo Album & Bắt Đầu Quét
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateAlbumModal;
