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
    { id: "features", label: "Tính năng" },
    { id: "how-it-works", label: "Cách hoạt động" },
    { id: "pricing", label: "Bảng giá" },
    { id: "faq", label: "Hỏi đáp" },
  ];
  const navigate = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-20 py-3 flex items-center justify-between gap-2 sm:gap-5">
        <button
          aria-label="Pickify — về đầu trang"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 shrink-0"
        >
          <span className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 via-rose-500 to-amber-400 grid place-items-center text-white">
            <Heart className="w-5 h-5 fill-white" />
          </span>
          <span className="hidden sm:block text-xl font-extrabold tracking-tight">
            Pickify
          </span>
        </button>
        <nav
          aria-label="Điều hướng chính"
          className="hidden lg:flex gap-6 text-sm text-stone-600"
        >
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => navigate(link.id)}
              className="hover:text-stone-900"
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div
          className="flex items-center gap-2 sm:gap-3 min-w-0"
          aria-label="Tài khoản"
        >
          {isAuthPending ? (
            <div
              role="status"
              aria-label="Đang kiểm tra trạng thái đăng nhập"
              className="flex items-center gap-2"
            >
              <span className="h-9 w-28 animate-pulse rounded-xl bg-stone-100" />
              <span className="h-9 w-9 animate-pulse rounded-full bg-stone-100" />
            </div>
          ) : isAuthenticated ? (
            <>
              <Button
                onClick={onGoToDashboard}
                variant="secondary"
                size="sm"
                className="rounded-xl gap-1.5 shrink-0"
              >
                <LayoutDashboard className="w-4 h-4" />
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
                    title="Tài khoản cá nhân"
                    className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white bg-stone-900 text-sm font-bold text-white shadow-sm ring-1 ring-stone-200 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
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
                  className="w-56 border-stone-200 p-1.5 shadow-xl"
                >
                  <DropdownMenuLabel className="px-2.5 py-2 font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="truncate text-xs font-bold leading-none text-stone-900">
                        {userName || "Tài khoản Pickify"}
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
                className="rounded-xl gap-1.5 shrink-0"
              >
                <LogIn className="hidden sm:block w-4 h-4" />
                <span>Đăng nhập</span>
              </Button>
              <Button
                onClick={onCreateAlbum}
                size="sm"
                className="rounded-xl gap-1.5 shrink-0 bg-stone-900 text-white shadow-sm hover:bg-stone-800"
              >
                <Plus className="hidden sm:block w-4 h-4" />
                <span>Tạo album mới</span>
              </Button>
            </>
          )}
          <Button
            onClick={() => setMenuOpen((open) => !open)}
            size="icon-sm"
            variant="ghost"
            className="lg:hidden shrink-0"
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
          className="lg:hidden border-t p-3 flex flex-col text-sm"
        >
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => navigate(link.id)}
              className="text-left px-3 py-2.5"
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
export default LandingNavbar;
