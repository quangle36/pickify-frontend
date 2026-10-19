import { Check, Folder, Heart } from "lucide-react";
import { landingPhotos } from "../photos";

const [first, , third, fourth] = landingPhotos;

/** Decorative product snippets around the hero copy; hidden on narrow screens. */
export function HeroFloats() {
  return (
    <div className="lp-floats" aria-hidden="true">
      <div className="lp-float lp-float-left lp-float-l1">
        <div className="lp-bob lp-photo-card">
          <div className="lp-photo-card-img">
            <img src={first.src} alt="" width="640" height="960" decoding="async" />
            <span className="lp-heart" data-on="true"><Heart /></span>
          </div>
        </div>
      </div>
      <div className="lp-float lp-float-left lp-float-l2">
        <div className="lp-bob lp-float-card lp-drive-card">
          <span className="lp-drive-link"><Folder />drive.google.com/…/sinh-nhat</span>
          <strong>312 ảnh đã quét</strong>
          <span className="lp-drive-bar" />
        </div>
      </div>
      <div className="lp-float lp-float-left lp-float-l3">
        <div className="lp-bob lp-float-card lp-code-card">
          <span>Mã album</span>
          <div>{["2", "0", "2", "6"].map((digit, index) => <span key={index}>{digit}</span>)}</div>
        </div>
      </div>
      <div className="lp-float lp-float-right lp-float-r1">
        <div className="lp-bob lp-photo-card">
          <div className="lp-photo-card-img">
            <img src={third.src} alt="" width="640" height="960" decoding="async" />
            <span className="lp-heart"><Heart /></span>
          </div>
          <span className="lp-photo-card-name">{third.file}.CR3</span>
        </div>
      </div>
      <div className="lp-float lp-float-right lp-float-r2">
        <div className="lp-bob lp-picked-card">
          <img src={fourth.src} alt="" width="640" height="960" decoding="async" />
          <div><span>Khách vừa chọn</span><strong>♥ {fourth.file}</strong></div>
        </div>
      </div>
      <div className="lp-float lp-float-right lp-float-r3">
        <div className="lp-bob lp-toast"><Check />Đã xuất CSV · 24 ảnh</div>
      </div>
    </div>
  );
}
