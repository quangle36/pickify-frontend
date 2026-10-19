import { Check } from "lucide-react";
import { clamp01 } from "../hooks/useStepsAutoplay";
import { landingPhotos } from "../photos";

// Matches the hearts in ClientPickStage: the third photo was not picked.
const kept = [true, true, false, true];

/** Step 3: unpicked RAW files drop out, picked ones get a heart, then the CSV toast. */
export function RawFilterStage({ active, progress }: { active: boolean; progress: number }) {
  const reached = clamp01((progress - 0.15) / 0.4) * landingPhotos.length;
  const keptCount = kept.filter((keep, index) => keep && reached > index).length;
  return (
    <div className="lp-stage-panel lp-panel-narrow" data-active={active} aria-hidden={!active}>
      <div className="lp-card lp-raw-card">
        <div className="lp-raw-head"><span>Thư mục RAW trên máy</span><span>{keptCount} / {landingPhotos.length} giữ lại</span></div>
        {landingPhotos.map((photo, index) => (
          <div key={photo.file} className="lp-raw-row" data-dropped={!kept[index] && reached > index}>
            <span className="lp-raw-file"><img src={photo.src} alt="" width="640" height="960" loading="lazy" decoding="async" />{photo.file}.CR3</span>
            <span className="lp-raw-mark" data-on={kept[index] && reached > index} aria-hidden="true">♥</span>
          </div>
        ))}
      </div>
      <div className="lp-toast lp-raw-toast" data-visible={progress > 0.72}>
        <Check aria-hidden="true" />Đã xuất CSV · sẵn sàng cho Lightroom
      </div>
    </div>
  );
}
