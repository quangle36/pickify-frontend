import { ArrowDown, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeautyAlbumPreview } from "./BeautyAlbumPreview";
import { PreviewWindow } from "./PreviewWindow";

export function HeroSection({ startHref }: { startHref: string }) {
  return <section className="landing-hero">
    <div className="landing-container landing-center">
      <p className="landing-eyebrow">Từ buổi chụp đến bộ ảnh được chọn</p>
      <h1>Ảnh đẹp đã có.<br /><span>Chọn ảnh, để Lumipic.</span></h1>
      <p className="landing-description">Gửi album từ Google Drive. Khách thả tim trên điện thoại.<br className="hidden sm:block" /> Lấy đúng bộ ảnh RAW để bắt đầu hậu kì.</p>
      <div className="landing-actions">
        <Button asChild className="landing-primary"><a href={startHref}>Bắt đầu miễn phí<ArrowRight aria-hidden="true" /></a></Button>
        <Button asChild variant="ghost" className="landing-text-action"><a href="#how-it-works">Xem cách dùng<ArrowDown aria-hidden="true" /></a></Button>
      </div>
      <div className="landing-hero-visual">
        <PreviewWindow parallax={-0.035}><BeautyAlbumPreview selected interactive priority /></PreviewWindow>
        <div className="landing-proof-tag" data-parallax="0.08"><Heart aria-hidden="true" />Album beauty · thử thả tim</div>
      </div>
    </div>
  </section>;
}
export default HeroSection;
