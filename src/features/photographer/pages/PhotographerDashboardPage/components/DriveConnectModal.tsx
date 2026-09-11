import { FC } from 'react';
import { Cloud, ShieldCheck } from 'lucide-react';
import { PhotographerProfile } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DriveConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PhotographerProfile;
  onToggleDrive: () => void;
}

export const DriveConnectModal: FC<DriveConnectModalProps> = ({
  isOpen,
  onClose,
  profile,
  onToggleDrive,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-6 sm:p-8 rounded-3xl">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-extrabold text-stone-900">Kết nối Google Drive</DialogTitle>
              <DialogDescription className="text-xs text-stone-500 mt-0.5">
                Phạm vi quyền hạn: <code className="font-mono text-stone-700">drive.readonly</code>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Status Card */}
        <Card className={`p-4 rounded-2xl border ${
          profile.isDriveConnected
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                profile.isDriveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`} />
              <span className="font-bold text-sm">
                {profile.isDriveConnected ? 'Đã cấp quyền truy cập' : 'Chưa cấp quyền Google Drive'}
              </span>
            </div>
            <Badge variant="outline" className="text-xs font-mono font-medium border-0">
              {profile.isDriveConnected ? profile.driveEmail : 'Chưa kết nối'}
            </Badge>
          </div>
        </Card>

        {/* Security Principles based on plan.md */}
        <div className="space-y-2.5 text-xs text-stone-600">
          <p className="font-bold text-stone-800 text-sm">Quy tắc bảo mật nghiêm ngặt (plan.md):</p>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Chỉ đọc (drive.readonly):</strong> Không có quyền thêm, sửa, đổi tên hoặc xóa bất kỳ file nào trên Google Drive của bạn.</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Bảo vệ Token:</strong> Access token và Refresh token được mã hóa an toàn trên server, tuyệt đối không gửi xuống trình duyệt client.</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Không công khai thư mục Drive:</strong> Khách chỉ xem ảnh preview được ký bảo mật (Signed URL 5 phút), không xem trực tiếp folder Drive gốc.</span>
          </div>
        </div>

        <DialogFooter className="pt-3 gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-xl"
          >
            Đóng
          </Button>
          <Button
            variant={profile.isDriveConnected ? 'destructive' : 'default'}
            onClick={() => {
              onToggleDrive();
              onClose();
            }}
            className={`rounded-xl font-bold ${
              profile.isDriveConnected
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 shadow-none'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
            }`}
          >
            {profile.isDriveConnected ? 'Ngắt kết nối Google Drive' : 'Cấp quyền Google Drive ngay'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DriveConnectModal;
