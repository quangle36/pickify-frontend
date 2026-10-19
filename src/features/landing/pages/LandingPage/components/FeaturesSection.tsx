import { Folder, Heart, LockKeyhole } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { landingPhotos } from "../photos";

const points = [
  { icon: Heart, title: "Nhiều người cùng chọn", description: "Lựa chọn từ mọi điện thoại gộp về một danh sách chung." },
  { icon: LockKeyhole, title: "Riêng tư bằng mã 4 số", description: "Khoá lựa chọn hoặc đổi mã bất cứ lúc nào." },
  { icon: Folder, title: "Drive của bạn, nguyên vẹn", description: "Chỉ đọc thư mục chia sẻ công khai — không sửa, không xoá." },
];
const photo = landingPhotos[1];

export function FeaturesSection() {
  return <section id="features" className="lp-wrap lp-section lp-split">
    <div className="lp-split-photo">
      <img src={photo.src} alt={photo.alt} width="640" height="960" loading="lazy" decoding="async" />
      <Badge className="lp-photo-badge"><span className="lp-accent-text" aria-hidden="true">♥</span>4 người cùng chọn</Badge>
    </div>
    <div className="lp-split-copy">
      <h2>Khách chọn lúc thảnh thơi.<br /><span className="lp-accent-text">Bạn rảnh tay làm việc khác.</span></h2>
      <ul className="lp-points">
        {points.map(({ icon: Icon, title, description }) => (
          <li key={title}>
            <span className="lp-point-icon" aria-hidden="true"><Icon /></span>
            <div><strong>{title}</strong><span>{description}</span></div>
          </li>
        ))}
      </ul>
    </div>
  </section>;
}
export default FeaturesSection;
