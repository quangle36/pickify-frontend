import { clamp01 } from "../hooks/useStepsAutoplay";
import { landingPhotos } from "../photos";

const driveUrl = "drive.google.com/drive/folders/ky-yeu-12A1";

/** Step 1: the link types itself, "Tạo album" is pressed, then the folder scans in. */
export function DriveScanStage({ active, progress }: { active: boolean; progress: number }) {
  const typed = driveUrl.slice(0, Math.round(clamp01(progress / 0.35) * driveUrl.length));
  const scan = clamp01((progress - 0.42) / 0.5);
  return (
    <div className="lp-stage-panel lp-panel-narrow" data-active={active} aria-hidden={!active}>
      <div className="lp-card">
        <span className="lp-card-label">Link thư mục Google Drive</span>
        <div className="lp-scan-row">
          <div className="lp-scan-input">{typed}<span className="lp-caret" /></div>
          <span className="lp-scan-btn" data-pressed={progress > 0.36 && progress < 0.42}>Tạo album</span>
        </div>
        <div className="lp-scan-progress" data-visible={progress > 0.4}>
          <div className="lp-scan-meta"><span>{scan >= 1 ? "Xong · album sẵn sàng" : "Đang quét…"}</span><span>{Math.round(scan * 312)} / 312</span></div>
          <div className="lp-bar"><span style={{ width: `${Math.round(scan * 100)}%` }} /></div>
        </div>
      </div>
      <div className="lp-scan-thumbs">
        {landingPhotos.map((photo, index) => (
          <div key={photo.file} data-visible={scan * landingPhotos.length > index}>
            <img src={photo.src} alt="" width="640" height="960" loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </div>
  );
}
