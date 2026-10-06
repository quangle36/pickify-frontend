import { FC } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  startHref: string;
}

export const HeroSection: FC<HeroSectionProps> = ({ startHref }) => {
  return (
    <section className="px-6 py-24 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium tracking-[-0.055em] leading-[1.16]">
          Chọn ảnh để hậu kì sau buổi chụp theo một cách nhanh nhất
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">
          Dành cho nhiếp ảnh gia: gửi ảnh từ Google Drive để khách chọn trên điện thoại,
          nhận danh sách ảnh cần hậu kì và xuất tên file để lọc trong Lightroom.
        </p>

        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            asChild
            className="h-12 rounded-full px-6 text-sm font-medium bg-neutral-900 hover:bg-neutral-700 text-white shadow-none gap-3 group"
          >
            <a href={startHref}><span>Bắt đầu miễn phí</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </Button>
        </div>

      </div>
    </section>
  );
};
export default HeroSection;
