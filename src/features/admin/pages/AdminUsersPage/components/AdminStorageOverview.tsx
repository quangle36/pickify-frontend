import { HardDrive } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { AdminUser, AdminUsersPage } from '../../../types/admin.types';
import { formatBytes } from '../../../utils/formatBytes';
import { storagePercent } from '../../../utils/storagePercent';

export function AdminStorageOverview({ result, users, pending, error }: {
  result?: AdminUsersPage; users: AdminUser[]; pending: boolean; error: boolean;
}) {
  const budget = result?.budget;
  const percent = budget ? storagePercent(budget.storageBytes, budget.storageLimitBytes) : 0;
  return <div className="admin-storage-grid">
    <Card className="admin-card-pad admin-storage-hero" id="dung-luong">
      <div className="admin-card-heading"><h2>Dung lượng đang sử dụng</h2><HardDrive /></div>
      {budget ? <>
        <p className="admin-budget-value">{formatBytes(budget.storageBytes)} <small>/ {formatBytes(budget.storageLimitBytes)}</small></p>
        <Progress className="admin-progress admin-system-progress" value={percent} aria-label="Dung lượng hệ thống" />
        <div className="admin-budget-meta"><span>{percent.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}% đã dùng</span><span>{formatBytes(Math.max(0, budget.storageLimitBytes - budget.storageBytes))} còn lại</span></div>
        <div className="admin-storage-users">{pending || error ? <p className="admin-hint">{error ? 'Không tải được dung lượng từng tài khoản.' : 'Đang tải dung lượng từng tài khoản…'}</p> : users.length ? users.slice(0, 5).map(user => <div className="admin-storage-user" key={user.id}><span>{user.name}</span><Progress className="admin-progress" value={storagePercent(user.storageBytes, user.storageLimitBytes)} aria-label={`Dung lượng ${user.name}`} /><strong>{formatBytes(user.storageBytes)}</strong></div>) : <p className="admin-hint">Chưa có tài khoản để hiển thị dung lượng.</p>}</div>
        <p className="admin-hint">Tối đa 5 tài khoản dùng nhiều nhất trong trang hiện tại.</p>
      </> : pending ? <div className="space-y-4"><Skeleton className="h-8 w-36" /><Skeleton className="h-3 w-full" /><Skeleton className="h-32 w-full" /></div> : <p className="admin-hint">Không tải được dung lượng hệ thống.</p>}
    </Card>
    <Card className="admin-card-pad" id="phan-quyen"><h2>Giới hạn tài khoản</h2>
      {budget ? <dl className="admin-quota"><div><dt>Album / tài khoản</dt><dd>{budget.maxAlbumsPerUser} album</dd></div><div><dt>Dung lượng / tài khoản</dt><dd>{formatBytes(budget.userStorageLimitBytes)}</dd></div><div><dt>Import / ngày</dt><dd>{budget.importsPerDay} lần</dd></div></dl> : pending ? <Skeleton className="mt-5 h-24 w-full" /> : <p className="admin-hint">Không tải được giới hạn tài khoản.</p>}
      <p className="admin-hint">Dung lượng mặc định khi tạo tài khoản; hạn mức riêng nằm trong danh sách bên dưới.</p><p className="admin-hint">Email cần được xác minh trước khi cấp quyền.</p>
    </Card>
  </div>;
}
