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
    "1.500 ảnh JPEG mỗi album",
    "30 ngày lưu trữ",
    "Xuất CSV không giới hạn",
    "Mật khẩu bảo mật Argon2id",
  ];

  return (
    <section
      id="pricing"
      className="py-20 sm:py-28 bg-white"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 grid md:grid-cols-2 gap-12 md:gap-20 items-start">
        <div>
        <h2 className="text-3xl sm:text-4xl font-medium tracking-[-0.04em]">
          Bắt đầu thật đơn giản.
        </h2>
        <p className="mt-3 text-stone-500 text-sm sm:text-base">
          Dùng đầy đủ tính năng. Không cần thẻ tín dụng.
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
            <a href={startHref}><span>Bắt đầu ngay</span>
            <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
export default PricingSection;
