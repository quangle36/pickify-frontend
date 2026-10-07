import { HardDrive, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AdminUsersPage } from '../../../types/admin.types';
import { formatBytes } from '../../../utils/formatBytes';

export function AdminStats({ result, pending, filtered }: { result?: AdminUsersPage; pending: boolean; filtered: boolean }) {
  const stats = [
    { label: 'Tài khoản', value: result?.total, detail: filtered ? 'Khớp tìm kiếm' : 'Toàn hệ thống', icon: Users },
    { label: 'Được tạo album', value: result?.users.filter(u => u.canCreateAlbums || u.role === 'admin').length, detail: 'Trong trang hiện tại', icon: ShieldCheck },
    { label: 'Chờ cấp quyền', value: result?.users.filter(u => u.emailVerified && !u.canCreateAlbums && u.role !== 'admin').length, detail: 'Trong trang hiện tại', icon: UserCheck },
    { label: 'Dung lượng', value: result ? formatBytes(result.budget.storageBytes) : undefined, detail: result ? `Giới hạn ${formatBytes(result.budget.storageLimitBytes)}` : 'Toàn hệ thống', icon: HardDrive },
  ];
  return <Card className="admin-stats" aria-label="Số liệu quản trị">{stats.map(stat => <div className="admin-stat" key={stat.label}><div className="admin-stat-label">{stat.label}<span className="admin-stat-icon"><stat.icon /></span></div>{stat.value === undefined && pending ? <Skeleton className="mt-3 h-[31px] w-20" /> : <p className="admin-stat-value">{stat.value ?? '—'}</p>}<small>{stat.detail}</small></div>)}</Card>;
}
