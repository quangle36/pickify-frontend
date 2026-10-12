import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppModal } from '@/components/ui/app-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { AppShell } from '@/app/components/AppShell';
import { AdminDashboardLayout } from './components/AdminDashboardLayout';
import { AdminStats } from './components/AdminStats';
import { AdminStorageOverview } from './components/AdminStorageOverview';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import './adminDashboard.css';
import { useOwnerQuery } from '@/features/auth/queries/auth.queries';
import { useAppActions } from '@/app/hooks/useAppActions';
import { errorMessage } from '@/api/errors';
import { useAdminUsers } from '../../queries/admin.queries';
import { useSetAlbumPermission } from '../../queries/admin.mutations';
import type { AdminUser } from '../../types/admin.types';
import { UserPermissionRow } from './components/UserPermissionRow';

export default function AdminUsersPage() {
  const owner = useOwnerQuery(true);
  const actions = useAppActions();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [revoking, setRevoking] = useState<AdminUser | null>(null);
  const users = useAdminUsers(query, page, owner.data?.role === 'admin');
  const permission = useSetAlbumPermission();
  const { toast } = useToast();
  useEffect(() => { document.title = 'Dung lượng hệ thống · Lumipic'; }, []);
  useEffect(() => { const timer = window.setTimeout(() => { setQuery(search.trim()); setPage(1); }, 300); return () => window.clearTimeout(timer); }, [search]);
  const change = async (user: AdminUser) => {
    try {
      await permission.mutateAsync({ id: user.id, allowed: !user.canCreateAlbums });
      toast({ title: user.canCreateAlbums ? 'Đã thu hồi quyền tạo album' : 'Đã cấp quyền tạo album', description: user.email });
      setRevoking(null);
    } catch (error) { toast({ variant: 'destructive', title: 'Không thể thay đổi quyền', description: errorMessage(error) }); }
  };
  const result = users.data;
  const sortedUsers = [...(result?.users ?? [])].sort((a, b) => b.storageBytes - a.storageBytes || a.name.localeCompare(b.name, 'vi'));
  const visibleUsers = sortedUsers.filter(user => filter === 'all' || (filter === 'pending' ? user.emailVerified && !user.canCreateAlbums && user.role !== 'admin' : !user.emailVerified));
  const counts = { all: sortedUsers.length, pending: sortedUsers.filter(u => u.emailVerified && !u.canCreateAlbums && u.role !== 'admin').length, unverified: sortedUsers.filter(u => !u.emailVerified).length };
  const filters = [{ value: 'all', label: 'Tất cả', count: counts.all }, { value: 'pending', label: 'Chờ cấp quyền', count: counts.pending }, { value: 'unverified', label: 'Chưa xác minh', count: counts.unverified }];
  return <AppShell>
    {owner.isPending ? <main className="p-6"><Skeleton className="h-40 w-full rounded-xl" /></main> : owner.error ? <main className="p-6"><Alert variant="destructive"><AlertDescription>{errorMessage(owner.error)} <Button variant="outline" onClick={() => void owner.refetch()}>Thử lại</Button></AlertDescription></Alert></main> : owner.data?.role !== 'admin' ? <main className="px-4 py-16 text-center"><h1 className="text-xl font-semibold">{owner.data ? 'Bạn không có quyền quản trị' : 'Đăng nhập để mở CMS'}</h1><p className="mt-3 text-sm text-muted-foreground">Trang này dành cho quản trị viên Lumipic.</p><Button asChild variant="outline" className="mt-5"><Link to={owner.data ? '/dashboard' : '/dashboard/sign-in'}>{owner.data ? 'Về album của bạn' : 'Đăng nhập'}</Link></Button></main> : <AdminDashboardLayout profile={owner.data} total={query ? undefined : result?.total} onLogout={actions.logout}>
      <div className="admin-page-heading"><div><h1>Dung lượng hệ thống</h1><p>Quản lý tài khoản, quyền tạo album và dung lượng Lumipic.</p></div><span className="admin-date">{new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
      <AdminStats result={result} pending={users.isPending} filtered={!!query} />
      {!!result?.budget.unaccountedAlbums && <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800"><AlertDescription>Còn {result.budget.unaccountedAlbums} album cần đối soát dung lượng. Hệ thống tạm dừng import mới.</AlertDescription></Alert>}
      <AdminStorageOverview result={result} users={sortedUsers} pending={users.isPending} error={!!users.error} />
      <Card className="admin-user-table" id="tai-khoan" aria-label="Danh sách tài khoản" aria-busy={users.isFetching}>
        <div className="admin-searchbar"><Label htmlFor="user-search">Tìm tài khoản</Label><Input id="user-search" placeholder="Nhập email hoặc tên" value={search} onChange={e => { setSearch(e.target.value); setFilter('all'); }} maxLength={254} /></div>
        <div className="admin-filters" aria-label="Lọc tài khoản trong trang hiện tại">
          {filters.map(item => <Button key={item.value} variant="ghost" className={`admin-filter ${filter === item.value ? 'active' : ''}`} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>{item.label} <span>{item.count}</span></Button>)}
        </div>
        <div className="admin-mobile-filter"><Select value={filter} onValueChange={setFilter}><SelectTrigger aria-label="Trạng thái tài khoản trong trang hiện tại"><SelectValue /></SelectTrigger><SelectContent>{filters.map(item => <SelectItem key={item.value} value={item.value}>Trạng thái: {item.label} · {item.count}</SelectItem>)}</SelectContent></Select></div>
        <div className="admin-table-heading"><span>Tài khoản</span><span>Quyền truy cập</span><span className="text-right">Album</span><span className="text-right">Dung lượng</span><span className="text-right">Thao tác</span></div>
        {users.isPending ? <div className="space-y-4 p-6">{[0, 1, 2].map(i => <Skeleton key={i} className="h-[84px] w-full" />)}</div> : users.error ? <div className="p-6"><p role="alert" className="text-sm text-rose-700">{errorMessage(users.error)}</p><Button variant="outline" className="mt-3" onClick={() => void users.refetch()}>Thử lại</Button></div> : !visibleUsers.length ? <div className="px-4 py-10 text-center"><p className="text-sm text-muted-foreground">{query ? 'Không tìm thấy tài khoản phù hợp. Thử một email hoặc tên khác.' : filter !== 'all' ? 'Không có tài khoản thuộc trạng thái này trong trang hiện tại.' : 'Chưa có tài khoản nào. Tài khoản sẽ xuất hiện sau khi đăng ký.'}</p>{(query || filter !== 'all') && <Button variant="ghost" className="mt-3 underline underline-offset-4" onClick={() => { setSearch(''); setFilter('all'); }}>Xoá bộ lọc</Button>}</div> : visibleUsers.map(user => <UserPermissionRow key={user.id} user={user} storageLimit={result?.budget.userStorageLimitBytes ?? 0} pending={permission.isPending} onChange={u => { if (u.canCreateAlbums) setRevoking(u); else void change(u); }} />)}
        {!!result?.users.length && <div className="admin-table-footer"><span>{filter === 'all' ? `${(page - 1) * result.limit + 1}–${Math.min(page * result.limit, result.total)} trong ${result.total} tài khoản` : `${visibleUsers.length} / ${result.users.length} tài khoản trong trang`}</span>{result.total > result.limit ? <div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={page === 1 || users.isFetching} onClick={() => { setPage(p => p - 1); setFilter('all'); }}>Trước</Button><span>Trang {page}</span><Button variant="outline" size="sm" disabled={page * result.limit >= result.total || users.isFetching} onClick={() => { setPage(p => p + 1); setFilter('all'); }}>Sau</Button></div> : <span>Trang 1 / 1</span>}</div>}
      </Card>
      <p className="admin-footnote">Tài khoản sắp theo dung lượng giảm dần trong trang hiện tại. Email chưa xác minh cần đăng nhập Google bằng cùng địa chỉ trước khi được cấp quyền. Thu hồi quyền chặn tạo và retry; các album hiện có vẫn mở được.</p>
    </AdminDashboardLayout>}
    <AppModal open={!!revoking} onOpenChange={open => { if (!open && !permission.isPending) setRevoking(null); }} title="Thu hồi quyền tạo album?" description={revoking?.email}>
      <p className="text-sm text-muted-foreground">Tài khoản sẽ không thể tạo, thử lại hoặc tiếp tục import album. Album đã hoàn tất vẫn được giữ đến khi hết hạn.</p>
      <div className="mt-5 flex justify-end gap-2"><Button variant="outline" disabled={permission.isPending} onClick={() => setRevoking(null)}>Huỷ</Button><Button className="bg-rose-500/10 text-rose-700 hover:bg-rose-500/15" disabled={permission.isPending} onClick={() => { if (revoking) void change(revoking); }}>{permission.isPending ? 'Đang thu hồi…' : 'Thu hồi quyền'}</Button></div>
    </AppModal>
  </AppShell>;
}
