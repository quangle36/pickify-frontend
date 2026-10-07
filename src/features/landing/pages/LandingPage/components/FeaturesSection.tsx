import { FileSpreadsheet, LockKeyhole, ShieldCheck } from "lucide-react";
import { FeaturePreview } from "./FeaturePreview";

const chapters = [
  { label: "01 · Preview tự động", title: <>Gửi một link.<br />Khách thấy cả album.</>, description: "Dán thư mục Google Drive, Lumipic tạo preview để khách xem ảnh nhanh trên điện thoại." },
  { label: "02 · Chọn và lưu tức thì", title: <>Ảnh ưng ý,<br />chạm một trái tim.</>, description: "Khách mở link, nhập mật khẩu và chọn ngay. Mỗi lượt thả tim được lưu vào danh sách của album." },
  { label: "03 · Lọc RAW / xuất CSV", title: <>Đúng file RAW.<br />Sẵn sàng hậu kì.</>, description: "Lọc bản sao file RAW từ thư mục trên máy, hoặc xuất CSV để tìm ảnh trong Lightroom." },
];
const extras = [
  { icon: ShieldCheck, title: "Không can thiệp Drive", description: "Chỉ đọc thư mục chia sẻ công khai. Không sửa, không xóa file gốc." },
  { icon: LockKeyhole, title: "Mật khẩu bảo mật", description: "Đặt mật khẩu, khóa lựa chọn hoặc đổi mã khi cần." },
  { icon: FileSpreadsheet, title: "Xuất CSV cho Lightroom", description: "Lấy tên file khách đã chọn để tìm trong Library Filter." },
];
export function FeaturesSection({ activeChapter = 0 }: { activeChapter?: number }) {
  return <section id="features" className="landing-section landing-features">
    <div className="landing-container">
      <div className="landing-section-head"><h2>Nhẹ phần chọn ảnh.<br />Trọn phần sáng tạo.</h2><p>Cuộn để khám phá luồng làm việc — từ ảnh gửi khách đến file chuẩn bị hậu kì.</p></div>
      <div className="landing-scroll-story">
        <div>{chapters.map((chapter, index) => <article className="landing-story-chapter" data-feature-chapter={index} key={chapter.label}><p className="landing-eyebrow">{chapter.label}</p><h2>{chapter.title}</h2><p className="landing-description">{chapter.description}</p><div className="landing-mobile-preview"><FeaturePreview chapter={index} /></div></article>)}</div>
        <div className="landing-sticky-preview">
          <div className="landing-preview-panels">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.label}
                className="landing-preview-panel"
                data-active={index === activeChapter}
                aria-hidden={index !== activeChapter}
              >
                <FeaturePreview chapter={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="landing-feature-extras">{extras.map(({ icon: Icon, title, description }) => <article key={title}><Icon aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article>)}</div>
    </div>
  </section>;
}
export default FeaturesSection;
