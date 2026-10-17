import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStepsAutoplay } from "../hooks/useStepsAutoplay";
import { ClientPickStage } from "./ClientPickStage";
import { DriveScanStage } from "./DriveScanStage";
import { RawFilterStage } from "./RawFilterStage";

const steps = [
  ["Dán link Google Drive", "Lumipic tự quét thư mục và dựng preview cho cả album."],
  ["Khách thả tim chọn ảnh", "Khách mở link, nhập mã 4 số và chọn trên điện thoại."],
  ["Lấy đúng RAW để hậu kỳ", "Lọc file gốc về máy hoặc xuất CSV cho Lightroom."],
];

export function HowItWorksSection() {
  const { step, progress, paused, pick, togglePlay } = useStepsAutoplay();
  return <section id="how-it-works" className="lp-wrap lp-section lp-steps">
    <div className="lp-steps-head">
      <h2>Ba bước.<br /><span className="lp-accent-text">Một luồng rõ ràng.</span></h2>
      <Button type="button" variant={null} size={null} className="lp-play" onClick={togglePlay} aria-label={paused ? "Phát hoạt ảnh" : "Tạm dừng hoạt ảnh"}>
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        {paused ? "Phát" : "Tạm dừng"}
      </Button>
    </div>
    <div className="lp-steps-body">
      <ol className="lp-step-list">
        {steps.map(([title, description], index) => (
          <li key={title}>
            <Button type="button" variant={null} size={null} className="lp-step" aria-current={index === step ? "step" : undefined} onClick={() => pick(index)}>
              <span className="lp-step-title"><span className="lp-step-num">0{index + 1}</span>{title}</span>
              <span className="lp-step-desc">{description}</span>
              <span className="lp-step-bar" aria-hidden="true"><span style={{ width: `${index === step ? Math.round(progress * 100) : 0}%` }} /></span>
            </Button>
          </li>
        ))}
      </ol>
      <div className="lp-stage">
        <DriveScanStage active={step === 0} progress={progress} />
        <ClientPickStage active={step === 1} progress={progress} />
        <RawFilterStage active={step === 2} progress={progress} />
      </div>
    </div>
  </section>;
}
export default HowItWorksSection;
