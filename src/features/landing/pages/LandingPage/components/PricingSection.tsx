import { FC } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PricingSectionProps {
  onStartDashboard: () => void;
}

export const PricingSection: FC<PricingSectionProps> = ({
  onStartDashboard,
}) => {
  return (
    <section
      id="pricing"
      className="py-16 sm:py-24 bg-stone-100/80 border-t border-stone-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            variant="brand"
            className="mb-2 uppercase tracking-widest font-bold"
          >
            Hạn Mức & Bảng Giá
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-2">
            Trải nghiệm trọn vẹn miễn phí trong giai đoạn MVP
          </h2>
          <p className="mt-4 text-stone-600 text-sm sm:text-base">
            Chúng tôi mở đăng ký miễn phí cho tất cả thợ ảnh và studio trải
            nghiệm giải pháp chọn ảnh từ Google Drive.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Active Free MVP Card */}
          <Card className="bg-white rounded-3xl p-8 border-2 border-brand-500 shadow-xl shadow-brand-500/10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-brand-600 text-white font-bold text-xs rounded-bl-2xl">
              ĐANG ÁP DỤNG
            </div>

            <div>
              <Badge variant="brand" className="mb-4 font-bold text-xs">
                MVP Miễn Phí Vĩnh Viễn
              </Badge>
              <h3 className="text-2xl font-black text-stone-900">
                Gói Khởi Nghiệp
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Dành cho thợ ảnh tự do và studio vừa & nhỏ
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-stone-900">
                  0₫
                </span>
                <span className="text-stone-500 text-sm font-medium">
                  / tháng
                </span>
              </div>

              <ul className="mt-8 space-y-3.5 text-sm text-stone-700">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Không giới hạn album</strong> hoạt động
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>1.500 ảnh JPEG</strong> mỗi album (tối đa 50MB/ảnh)
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>30 ngày lưu trữ</strong> link chọn ảnh cho khách
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Lưu tim trực tiếp vào danh sách chọn ảnh</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Xuất file CSV chuẩn Lightroom không giới hạn</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100">
              <Button
                size="lg"
                onClick={onStartDashboard}
                className="w-full py-4 rounded-2xl font-extrabold text-sm text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-600/20 gap-2"
              >
                <span>Bắt Đầu Sử Dụng Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Upcoming Studio Pro Card */}
          <Card className="bg-stone-50/80 rounded-3xl p-8 border-stone-200 shadow-xs flex flex-col justify-between relative opacity-85">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-stone-200 text-stone-700 font-bold text-xs rounded-bl-2xl">
              SẮP RA MẮT
            </div>

            <div>
              <Badge
                variant="secondary"
                className="mb-4 font-bold text-xs text-stone-700"
              >
                Studio Chuyên Nghiệp
              </Badge>
              <h3 className="text-2xl font-black text-stone-900">
                Gói Pro Nâng Cao
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Dành cho Wedding Studio lớn có lượng khách đông
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-stone-400">
                  ---
                </span>
                <span className="text-stone-400 text-sm font-medium">
                  / giai đoạn sau MVP
                </span>
              </div>

              <ul className="mt-8 space-y-3.5 text-sm text-stone-600">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Không giới hạn số lượng album hoạt động</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Gắn Watermark / Logo Studio tự động lên preview</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Hỗ trợ tải ảnh gốc dung lượng cao cho khách</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Ghi chú comment trên từng bức ảnh</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>
                    Tên miền riêng (ví dụ: <code>chonanh.studioban.vn</code>)
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-200">
              <Button
                disabled
                size="lg"
                variant="secondary"
                className="w-full py-4 rounded-2xl font-bold text-sm text-stone-400 bg-stone-200 cursor-not-allowed"
              >
                Giai đoạn tiếp theo
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default PricingSection;
