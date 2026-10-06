import { useState } from "react";
import {
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LandingNavbarProps {
  onGoToDashboard: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onCreateAlbum: () => void;
  isAuthenticated: boolean;
  isAuthPending?: boolean;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
}

export function LandingNavbar({
  onGoToDashboard,
  onLogin,
  onLogout,
  onCreateAlbum,
  isAuthenticated,
  isAuthPending = false,
  userName,
  userEmail,
  avatarUrl,
}: LandingNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { id: "how-it-works", label: "Cách dùng" },
    { id: "features", label: "Tính năng" },
    { id: "pricing", label: "Bảng giá" },
  ];
  const navigate = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          aria-label="Lumipic — về đầu trang"
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
          className="flex items-center gap-2.5 shrink-0 px-0 hover:bg-transparent"
        >
          <span className="w-8 h-8 rounded-full bg-neutral-900 grid place-items-center text-white">
            <Heart className="w-4 h-4 fill-white" />
          </span>
          <span className="text-xl font-medium tracking-tight text-neutral-900">
            Lumipic
          </span>
        </Button>

        <nav
          aria-label="Điều hướng chính"
          className="hidden md:flex items-center gap-1 text-sm text-neutral-600"
        >
          {links.map((link) => (
            <Button
              variant="ghost"
              key={link.id}
              onClick={() => navigate(link.id)}
              className="rounded-full px-4 font-normal text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            >
              {link.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2" aria-label="Tài khoản">
          {isAuthPending ? (
            <div
              role="status"
              aria-label="Đang kiểm tra trạng thái đăng nhập"
              className="flex items-center gap-2"
            >
              <span className="h-8 w-20 animate-pulse rounded-lg bg-stone-100" />
              <span className="h-8 w-8 animate-pulse rounded-full bg-stone-100" />
            </div>
          ) : isAuthenticated ? (
            <>
              <Button
                onClick={onGoToDashboard}
                variant="secondary"
                size="sm"
                className="rounded-full gap-1.5 text-xs"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label={
                      userName
                        ? `Mở menu tài khoản của ${userName}`
                        : "Mở menu tài khoản"
                    }
                    className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white bg-stone-900 text-xs font-bold text-white shadow-sm ring-1 ring-stone-200 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span aria-hidden="true">
                        {(userName?.trim().charAt(0) || "P").toUpperCase()}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 border-stone-200 p-1.5 shadow-lg"
                >
                  <DropdownMenuLabel className="px-2.5 py-2 font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="truncate text-xs font-bold leading-none text-stone-900">
                        {userName || "Tài khoản Lumipic"}
                      </p>
                      {userEmail && (
                        <p className="truncate text-[11px] leading-none text-stone-500">
                          {userEmail}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer font-medium text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                onClick={onLogin}
                variant="ghost"
                size="sm"
                className="rounded-full text-xs text-neutral-700 hover:bg-neutral-100"
              >
                <LogIn className="hidden sm:block w-3.5 h-3.5 mr-1.5" />
                Đăng nhập
              </Button>
              <Button
                onClick={onCreateAlbum}
                size="sm"
                className="rounded-full text-xs bg-neutral-900 text-white shadow-none hover:bg-neutral-700 gap-1.5"
              >
                <Plus className="hidden sm:block w-3.5 h-3.5" />
                Tạo album
              </Button>
            </>
          )}
          <Button
            onClick={() => setMenuOpen((open) => !open)}
            size="icon-sm"
            variant="ghost"
            className="md:hidden shrink-0"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Điều hướng di động"
          className="md:hidden border-t border-stone-100 p-3 flex flex-col text-sm"
        >
          {links.map((link) => (
            <Button
              variant="ghost"
              key={link.id}
              onClick={() => navigate(link.id)}
              className="justify-start rounded-lg px-3 py-2.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 font-normal"
            >
              {link.label}
            </Button>
          ))}
        </nav>
      )}
    </header>
  );
}
export default LandingNavbar;
