import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
export function PublicDriveHelpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
    <DialogContent className="rounded-3xl max-w-lg">
      <DialogHeader><DialogTitle>Nhập ảnh từ Google Drive public</DialogTitle><DialogDescription>Chỉ cần dán link folder công khai, không cần kết nối tài khoản Drive.</DialogDescription></DialogHeader>
      <ol className="list-decimal pl-5 space-y-3 text-sm text-stone-700">
        <li>Mở folder trong Google Drive và chọn <strong>Chia sẻ</strong>.</li>
        <li>Đặt quyền truy cập chung thành <strong>Bất kỳ ai có đường liên kết</strong>, vai trò <strong>Người xem</strong>.</li>
        <li>Đảm bảo các ảnh JPEG bên trong cũng đọc được bằng link public. Sao chép toàn bộ liên kết và dán khi tạo album.</li>
      </ol>
      <p className="text-sm text-stone-600">Người có link Drive public có thể xem ảnh gốc. Mật khẩu Pickify chỉ bảo vệ album trên Pickify.</p>
    </DialogContent>
  </Dialog>;
}
