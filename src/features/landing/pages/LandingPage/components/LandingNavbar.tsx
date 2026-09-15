import { useState } from "react";
import { Heart, LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
interface LandingNavbarProps {
  onGoToDashboard: () => void;
  onLogin: () => void;
  userName?: string;
}
export function LandingNavbar({
  onGoToDashboard,
  onLogin,
  userName,
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
          aria-label="Tài khoản và Dashboard"
        >
          <Button
            onClick={onGoToDashboard}
            variant="secondary"
            size="sm"
            className="rounded-xl gap-1.5 shrink-0"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Button>
          {userName ? (
            <span
              title={`Hi, ${userName}`}
              className="text-sm font-semibold text-stone-800 truncate max-w-[130px] sm:max-w-[220px]"
            >
              Hi, {userName}
            </span>
          ) : (
            <Button
              onClick={onLogin}
              size="sm"
              className="rounded-xl gap-1.5 bg-stone-900 text-white"
            >
              <LogIn className="hidden sm:block w-4 h-4" />
              <span>Đăng nhập Google</span>
            </Button>
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
