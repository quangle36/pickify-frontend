import { Heart, HardDrive, LayoutDashboard, Users, ShieldCheck, LogOut } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import type { PhotographerProfile } from '@/features/photographer/types/album.types';

export function AdminSidebar({ profile, total, active, onNavigate, onLogout }: {
  profile: PhotographerProfile; total?: number; active: string;
  onNavigate: (section: string) => void; onLogout: () => void;
}) {
  const items = [
    { id: 'top', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'tai-khoan', label: 'Tài khoản', icon: Users },
    { id: 'phan-quyen', label: 'Quyền tạo album', icon: ShieldCheck },
    { id: 'dung-luong', label: 'Dung lượng', icon: HardDrive },
  ];
  return <>
    <Link to="/" className="admin-brand"><span className="admin-brand-logo"><Heart fill="currentColor" /></span>Lumipic <small>ADMIN</small></Link>
    <nav className="admin-side-nav" aria-label="Điều hướng quản trị">
      <p className="admin-nav-label">Quản trị</p>
      {items.map(item => <a key={item.id} href={`#${item.id}`} className={`admin-nav-item ${active === item.id ? 'selected' : ''}`} aria-current={active === item.id ? 'location' : undefined} onClick={() => onNavigate(item.id)}>
        <item.icon /><span>{item.label}</span>{item.id === 'tai-khoan' && total !== undefined && <span className="admin-nav-count">{total}</span>}
      </a>)}
    </nav>
    <div className="admin-side-bottom">
      <Button asChild variant="ghost" className="w-full justify-start gap-3 px-3 text-sm font-normal"><Link to="/dashboard"><LayoutDashboard className="size-[18px]" />Album của bạn</Link></Button>
      <Button variant="ghost" className="w-full justify-start gap-3 px-3 font-normal text-rose-700 hover:bg-rose-50 hover:text-rose-700" onClick={onLogout}><LogOut className="size-[18px]" />Đăng xuất</Button>
      <div className="admin-account"><span className="admin-avatar">{profile.name.trim().charAt(0).toLocaleUpperCase('vi')}</span><div className="min-w-0"><p title={profile.name}>{profile.name}</p><small>Quản trị viên</small></div></div>
    </div>
  </>;
}
