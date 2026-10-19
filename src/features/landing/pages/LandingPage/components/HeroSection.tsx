import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroFloats } from "./HeroFloats";
import { LandingAlbumPreview } from "./LandingAlbumPreview";
import { RotatingWord } from "./RotatingWord";

export function HeroSection({ startHref }: { startHref: string }) {
  return <section className="lp-hero">
    <div className="lp-wrap lp-hero-inner">
      <HeroFloats />
      <div className="lp-hero-copy">
        <Badge variant="outline" className="lp-eyebrow">Cho nhiếp ảnh gia sự kiện, cưới, kỷ yếu &amp; chân dung</Badge>
        <h1>Ảnh <RotatingWord /> đã xong.<br />Chọn ảnh, để Lumipic.</h1>
        <p className="lp-lead">Gửi album từ Google Drive, khách thả tim ngay trên điện thoại, bạn lấy đúng bộ RAW để hậu kỳ — cho mọi buổi chụp.</p>
        <div className="lp-actions">
          <Button asChild variant={null} size={null} className="lp-cta"><a href={startHref}>Gửi album đầu tiên</a></Button>
          <Button asChild variant={null} size={null} className="lp-cta-ghost"><a href="#how-it-works">Xem cách dùng</a></Button>
        </div>
        <span className="lp-fineprint">Miễn phí · không cần thẻ · khách không cần tài khoản</span>
      </div>
      <div className="lp-hero-phone"><LandingAlbumPreview /></div>
    </div>
  </section>;
}
export default HeroSection;
