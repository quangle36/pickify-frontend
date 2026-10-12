import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { AdminUser } from '../../../types/admin.types';
import { storagePercent } from '../../../utils/storagePercent';
import { UserStorageLimit } from './UserStorageLimit';
export function UserPermissionRow({ user, pending, onChange }: {
  user: AdminUser; pending: boolean; storageLimit: number; onChange: (user: AdminUser) => void;
}) {
  const isAdmin = user.role === 'admin';
  return (
    <div className="admin-user-row">
      <div className="admin-identity">
        <span className="admin-avatar">{user.name.trim().charAt(0).toLocaleUpperCase('vi') || '?'}</span>
        <div className="admin-identity-text"><p>{user.name}</p><small title={user.email}>{user.email}</small></div>
      </div>
      <div className="admin-permission"><Badge variant="outline" className={`admin-badge ${isAdmin ? '' : user.canCreateAlbums ? 'success' : !user.emailVerified ? 'warning' : ''}`}>{isAdmin ? 'Quản trị viên' : user.canCreateAlbums ? 'Được tạo album' : !user.emailVerified ? 'Chưa xác minh' : 'Chưa cấp quyền'}</Badge></div>
      <div className="admin-album-count">{user.albumCount} album</div>
      <div className="admin-usage"><UserStorageLimit user={user} /><Progress className="admin-progress admin-user-storage-progress" value={storagePercent(user.storageBytes, user.storageLimitBytes)} aria-label={`Dung lượng ${user.name}`} /></div>
      <div className="admin-action">
        <Button variant="outline" size="sm" disabled={pending || isAdmin || (!user.emailVerified && !user.canCreateAlbums)}
          aria-label={`${user.canCreateAlbums ? 'Thu hồi' : 'Cấp'} quyền tạo album cho ${user.email}`}
          title={isAdmin ? 'Quyền quản trị viên được cố định' : !user.emailVerified && !user.canCreateAlbums ? 'Cần xác minh email trước khi cấp quyền' : undefined}
          className={`admin-row-button ${user.canCreateAlbums && !isAdmin ? 'admin-danger' : ''}`}
          onClick={() => onChange(user)}>{pending ? 'Đang lưu…' : isAdmin ? 'Quyền cố định' : user.canCreateAlbums ? 'Thu hồi quyền' : !user.emailVerified ? 'Chờ xác minh' : 'Cấp quyền'}</Button>
      </div>
    </div>
  );
}
