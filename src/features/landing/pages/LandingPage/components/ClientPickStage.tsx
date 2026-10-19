import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { clamp01 } from "../hooks/useStepsAutoplay";
import { landingPhotos } from "../photos";

// Progress at which the client hearts each photo; the third one stays unpicked.
const heartAt = [0.42, 0.68, Infinity, 0.55];

/** Step 2: the client enters the album code, then hearts photos one by one. */
export function ClientPickStage({ active, progress }: { active: boolean; progress: number }) {
  const digits = Math.round(clamp01(progress / 0.28) * 4);
  const showAlbum = progress >= 0.32;
  const count = heartAt.filter((at) => progress >= at).length;
  return (
    <div className="lp-stage-panel lp-pick" data-active={active} aria-hidden={!active}>
      <div className="lp-mini-phone">
        <div className="lp-mini-screen">
          <div className="lp-code" data-visible={!showAlbum}>
            <span className="lp-code-title">Nhập mã album</span>
            <div className="lp-code-digits">
              {["2", "0", "2", "6"].map((digit, index) => (
                <span key={index} data-filled={index < digits}>{index < digits ? digit : ""}</span>
              ))}
            </div>
            <small>Không cần tài khoản</small>
          </div>
          <div className="lp-pick-album" data-visible={showAlbum}>
            <div className="lp-album-head">
              <span className="lp-album-title">Kỷ yếu 12A1</span>
              <Badge className="lp-count">♥ {count} đã chọn</Badge>
            </div>
            <div className="lp-album-grid">
              {landingPhotos.map((photo, index) => (
                <div key={photo.file} className="lp-album-photo">
                  <img src={photo.src} alt="" width="640" height="960" loading="lazy" decoding="async" />
                  <span className="lp-heart" data-on={progress >= heartAt[index]}><Heart aria-hidden="true" /></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
