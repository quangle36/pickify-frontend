import { FC } from "react";
import { Heart, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LandingFooterProps {
  onGoToDashboard: () => void;
  onOpenGuestDemo: () => void;
}

export const LandingFooter: FC<LandingFooterProps> = ({
  onGoToDashboard,
  onOpenGuestDemo,
}) => {
  return (
    <footer className="bg-stone-900 text-white pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Pickify
              </span>
              <Badge
                variant="outline"
                className="bg-stone-800 text-brand-400 text-[10px] font-bold border-stone-700"
              >
                MVP Google Drive
              </Badge>
            </div>
            <p className="text-stone-400 text-sm max-w-md leading-relaxed">
              Giải pháp tối ưu dành riêng cho các studio cưới, nhiếp ảnh gia tự
              do giúp khách hàng chọn ảnh từ thư mục Google Drive nhanh chóng,
              mượt mà và bảo mật.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700 text-xs text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Import từ link Google Drive public</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">
              Điều Hướng
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-300 font-medium">
              <li>
                <button
                  type="button"
                  onClick={onGoToDashboard}
                  className="hover:text-white transition-colors"
                >
                  Bảng điều khiển Photographer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenGuestDemo}
                  className="hover:text-white transition-colors"
                >
                  Trải nghiệm Khách thả tim
                </button>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Tính năng sản phẩm
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-white transition-colors"
                >
                  Bảng giá & Hạn mức
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Tech & Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">
              Tiêu Chuẩn Kỹ Thuật
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Argon2id Passcode</span>
              </li>
              <li>Tối đa 1.500 ảnh JPEG/album</li>
              <li>Ảnh display JPEG tối đa 1.600px</li>
              <li>Lựa chọn được lưu trực tiếp vào PostgreSQL</li>
              <li>Xuất file CSV UTF-8 BOM chuẩn Excel</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © 2026 Pickify. Được thiết kế theo tài liệu đặc tả MVP plan.md.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400 font-medium">
              Giao diện Tiếng Việt 100%
            </span>
            <span>•</span>
            <span className="text-stone-400 font-medium">
              Tối ưu Mobile First
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default LandingFooter;
