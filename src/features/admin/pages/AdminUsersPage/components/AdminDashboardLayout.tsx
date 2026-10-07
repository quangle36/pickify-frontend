import { useEffect, useState, type ReactNode } from 'react';
import { ChevronRight, Menu, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { PhotographerProfile } from '@/features/photographer/types/album.types';
import { AdminSidebar } from './AdminSidebar';

export function AdminDashboardLayout({ profile, total, onLogout, children }: {
  profile: PhotographerProfile; total?: number; onLogout: () => void; children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('dung-luong');
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const close = () => { if (media.matches) setOpen(false); };
    media.addEventListener('change', close);
    return () => media.removeEventListener('change', close);
  }, []);
  const navigate = (section: string) => { setActive(section); setOpen(false); };
  const sidebarProps = { profile, total, active, onNavigate: navigate, onLogout };
  return <div className="admin-cms admin-shell">
    <aside className="admin-sidebar"><AdminSidebar {...sidebarProps} /></aside>
    <div className="admin-workspace">
      <header className="admin-topbar" id="top">
        <div className="admin-crumb">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon-sm" className="admin-menu-trigger lg:hidden" aria-label="Mở menu quản trị"><Menu /></Button></SheetTrigger>
            <SheetContent className="admin-cms admin-mobile-sidebar"><SheetTitle className="sr-only">Menu quản trị Lumipic</SheetTitle><SheetDescription className="sr-only">Điều hướng tài khoản, phân quyền và dung lượng hệ thống.</SheetDescription><AdminSidebar {...sidebarProps} /></SheetContent>
          </Sheet>
          <span>Quản trị</span><ChevronRight /><strong>Dung lượng hệ thống</strong>
        </div>
        <div className="admin-mode"><ShieldCheck /><span>Quản trị viên</span></div>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  </div>;
}
