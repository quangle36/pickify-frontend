import { useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
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
import { LumipicLogo } from "@/components/ui/lumipic-logo";

interface LandingNavbarProps {
  onLogout: () => void;
  isAuthenticated: boolean;
  isAuthPending?: boolean;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
}

export function LandingNavbar({
  onLogout,
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
  return (
    <header className="lp-header">
      <div className="lp-wrap lp-header-inner">
        <a href="/" aria-label="Lumipic — về trang chủ" className="shrink-0">
          <LumipicLogo className="lp-logo" />
        </a>

        <nav
          aria-label="Điều hướng chính"
          className="hidden md:flex items-center gap-1.5"
        >
          {links.map((link) => (
            <Button
              variant={null}
              size={null}
              key={link.id}
              asChild
              className="lp-nav-link"
            >
              <a href={`#${link.id}`}>{link.label}</a>
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
                asChild
                variant={null}
                size={null}
                className="lp-nav-cta"
              ><a href="/dashboard">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </a></Button>
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
                asChild
                variant={null}
                size={null}
                className="lp-nav-link hidden sm:inline-flex"
              ><a href="/dashboard/sign-in">Đăng nhập</a></Button>
              <Button
                asChild
                variant={null}
                size={null}
                className="lp-nav-cta"
              ><a href="/dashboard/sign-in">Bắt đầu miễn phí</a></Button>
            </>
          )}
          <Button
            onClick={() => setMenuOpen((open) => !open)}
            size={null}
            variant={null}
            className="lp-menu-btn md:hidden shrink-0"
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
          className="lp-wrap md:hidden pb-3 flex flex-col"
        >
          {links.map((link) => (
            <Button
              variant={null}
              size={null}
              key={link.id}
              asChild
              className="lp-nav-link justify-start"
            >
              <a href={`#${link.id}`} onClick={() => setMenuOpen(false)}>{link.label}</a>
            </Button>
          ))}
        </nav>
      )}
    </header>
  );
}
export default LandingNavbar;
