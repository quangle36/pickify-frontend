import { FC, useState } from 'react';
import { Heart, Sparkles, LayoutDashboard, Eye, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LandingNavbarProps {
  onGoToDashboard: () => void;
  onOpenGuestDemo: () => void;
}

export const LandingNavbar: FC<LandingNavbarProps> = ({
  onGoToDashboard,
  onOpenGuestDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-rose-500 to-amber-400 flex items-center justify-center shadow-md shadow-brand-500/20 text-white">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-stone-900">Pickify</span>
              <Badge variant="brand" className="uppercase tracking-wider font-bold">
                MVP
              </Badge>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">Chọn ảnh Google Drive trong 1 nốt nhạc</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button type="button" onClick={() => scrollTo('features')} className="hover:text-stone-900 transition-colors">
            Tính năng
          </button>
          <button type="button" onClick={() => scrollTo('problem-solution')} className="hover:text-stone-900 transition-colors">
            So sánh
          </button>
          <button type="button" onClick={() => scrollTo('how-it-works')} className="hover:text-stone-900 transition-colors">
            Cách hoạt động
          </button>
          <button type="button" onClick={() => scrollTo('pricing')} className="hover:text-stone-900 transition-colors">
            Bảng giá MVP
          </button>
          <button type="button" onClick={() => scrollTo('faq')} className="hover:text-stone-900 transition-colors">
            Hỏi đáp
          </button>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenGuestDemo}
            className="rounded-xl gap-1.5"
            title="Xem giao diện khách hàng mở link và thả tim"
          >
            <Eye className="w-4 h-4 text-stone-500" />
            <span>Thử vai trò Khách</span>
          </Button>

          <Button
            size="sm"
            onClick={onGoToDashboard}
            className="rounded-xl gap-2 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 hover:from-black hover:to-stone-800 text-white shadow-md shadow-stone-900/15 group"
          >
            <LayoutDashboard className="w-4 h-4 text-amber-400" />
            <span>Vào Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            size="sm"
            onClick={onGoToDashboard}
            className="rounded-xl text-xs gap-1.5 bg-stone-900"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
            <span>Dashboard</span>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-3 animate-fade-in shadow-xl">
          <div className="flex flex-col gap-2 font-medium text-stone-700">
            <button
              type="button"
              onClick={() => scrollTo('features')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50"
            >
              Tính năng nổi bật
            </button>
            <button
              type="button"
              onClick={() => scrollTo('problem-solution')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50"
            >
              Tại sao chọn Pickify?
            </button>
            <button
              type="button"
              onClick={() => scrollTo('how-it-works')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50"
            >
              Cách hoạt động (3 bước)
            </button>
            <button
              type="button"
              onClick={() => scrollTo('pricing')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50"
            >
              Hạn mức & Bảng giá MVP
            </button>
            <button
              type="button"
              onClick={() => scrollTo('faq')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50"
            >
              Câu hỏi thường gặp
            </button>
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGuestDemo();
              }}
              className="w-full justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Xem giao diện Khách thả tim</span>
            </Button>
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                onGoToDashboard();
              }}
              className="w-full justify-center gap-2 bg-stone-900 text-white"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Đăng nhập Nhiếp ảnh gia / Vào Dashboard</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
export default LandingNavbar;
