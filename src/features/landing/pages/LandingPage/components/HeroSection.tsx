import { FC } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStartDashboard: () => void;
}

export const HeroSection: FC<HeroSectionProps> = ({ onStartDashboard }) => {
  return (
    <section className="px-6 py-24 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium tracking-[-0.055em] leading-[1.16]">
          Khách chọn ảnh JPEG.
          <span className="mt-3 block text-neutral-400">
            Bạn xuất file.
          </span>
        </h1>

        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            onClick={onStartDashboard}
            className="h-12 rounded-full px-6 text-sm font-medium bg-neutral-900 hover:bg-neutral-700 text-white shadow-none gap-3 group"
          >
            <span>Bắt đầu miễn phí</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>

      </div>
    </section>
  );
};
export default HeroSection;
