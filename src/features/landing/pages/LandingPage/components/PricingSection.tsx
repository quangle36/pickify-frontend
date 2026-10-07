import { FC } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingSectionProps {
  startHref: string;
}

export const PricingSection: FC<PricingSectionProps> = ({
  startHref,
}) => {
  const included = [
    "Không giới hạn album",
    "Lọc ảnh RAW đã chọn trên máy",
    "30 ngày lưu trữ",
    "Khách chọn ảnh không cần tài khoản",
    "Mật khẩu bảo mật",
  ];

  return (
    <section
      id="pricing"
      className="landing-section"
    >
      <div className="landing-container landing-pricing-layout">
        <div>
        <p className="landing-eyebrow">Bắt đầu thật đơn giản</p>
        <h2>Đủ tính năng.<br />Không phí bắt đầu.</h2>
        <p className="landing-description">
          Gói miễn phí cho luồng chọn ảnh của bạn.<br />Không cần thẻ tín dụng.
        </p>
        </div>
        <div className="rounded-3xl border border-neutral-200 p-7 sm:p-8 text-left">
          <p className="text-sm font-medium text-neutral-700 mb-6">Gói miễn phí</p>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-5xl font-medium tracking-tight text-neutral-900">0₫</span>
            <span className="text-stone-400 text-sm">/ tháng</span>
          </div>

          <ul className="space-y-3">
            {included.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-stone-700">
                <div className="w-5 h-5 text-neutral-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            asChild
            className="w-full mt-8 h-12 rounded-full font-medium text-sm bg-neutral-900 hover:bg-neutral-700 text-white shadow-none gap-2"
          >
            <a href={startHref}><span>Bắt đầu miễn phí</span>
            <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
export default PricingSection;
