import { FC } from "react";
import {
  ArrowRight,
  Heart,
  Sparkles,
  ShieldCheck,
  Zap,
  Smartphone,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface HeroSectionProps {
  onStartDashboard: () => void;
  onOpenGuestDemo: () => void;
}

export const HeroSection: FC<HeroSectionProps> = ({
  onStartDashboard,
  onOpenGuestDemo,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40">
        <div className="absolute -top-12 left-1/4 w-96 h-96 bg-brand-200/50 rounded-full blur-3xl" />
        <div className="absolute top-12 right-1/4 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-xs text-xs font-semibold text-stone-800 mb-6 sm:mb-8 animate-fade-in hover:border-brand-300 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-ping" />
          <Badge
            variant="brand"
            className="font-bold border-0 bg-transparent px-0 py-0"
          >
            Dành riêng cho Photographer & Studio
          </Badge>
          <span className="text-stone-300">|</span>
          <span className="text-stone-600">
            Tiết kiệm 80% thời gian lọc ảnh
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-stone-900 tracking-tight max-w-5xl mx-auto leading-[1.15] sm:leading-[1.12]">
          Khách Hàng Chọn Ảnh Từ Google Drive{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-rose-500 to-amber-500">
            Trong 1 Nốt Nhạc
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed font-normal">
          Tạm biệt những ngày khách phải căng mắt tìm file rồi nhắn mã{" "}
          <code className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-sm">
            DSC_0412.JPG
          </code>{" "}
          qua Zalo. Chỉ cần dán link folder Google Drive, khách mở link bảo mật
          trên smartphone, chạm tim ❤️ để chọn ảnh. Mỗi lượt tim được lưu ngay
          và danh sách có thể xuất CSV chuẩn Lightroom trong 3 giây.
        </p>

        {/* CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={onStartDashboard}
            className="w-full sm:w-auto h-auto py-4 px-8 rounded-2xl text-base font-bold bg-gradient-to-r from-brand-600 via-rose-600 to-brand-700 hover:from-brand-700 hover:to-rose-800 shadow-xl shadow-brand-600/25 group gap-2.5"
          >
            <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Trải nghiệm Quản lý Album</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={onOpenGuestDemo}
            className="w-full sm:w-auto h-auto py-4 px-8 rounded-2xl text-base font-bold bg-white hover:bg-stone-100/90 border-stone-200/90 shadow-xs gap-2.5 group"
          >
            <Heart className="w-5 h-5 text-brand-500 group-hover:scale-125 transition-transform fill-brand-500" />
            <span>Thử Khách Thả Tim Demo</span>
          </Button>
        </div>

        {/* Feature badges below CTAs */}
        <div className="mt-12 pt-8 border-t border-stone-200/70 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <Card className="flex flex-row items-center gap-3 p-3 rounded-2xl bg-white/70 border-stone-100 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">
                1.500 ảnh/album
              </p>
              <p className="text-[11px] text-stone-500">
                Quét & preview mượt mà
              </p>
            </div>
          </Card>

          <Card className="flex flex-row items-center gap-3 p-3 rounded-2xl bg-white/70 border-stone-100 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">
                Mobile-First UI
              </p>
              <p className="text-[11px] text-stone-500">
                Khách không cần đăng nhập
              </p>
            </div>
          </Card>

          <Card className="flex flex-row items-center gap-3 p-3 rounded-2xl bg-white/70 border-stone-100 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">
                Xuất CSV 1-Click
              </p>
              <p className="text-[11px] text-stone-500">
                UTF-8 BOM chuẩn tiếng Việt
              </p>
            </div>
          </Card>

          <Card className="flex flex-row items-center gap-3 p-3 rounded-2xl bg-white/70 border-stone-100 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">
                An toàn & Bảo mật
              </p>
              <p className="text-[11px] text-stone-500">Link Drive public</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
