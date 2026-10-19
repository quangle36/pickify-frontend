import { FC } from "react";
import { Button } from "@/components/ui/button";

interface PricingSectionProps {
  startHref: string;
}

const included = [
  "Album không giới hạn",
  "Lọc RAW ảnh được chọn về máy",
  "Lưu trữ 30 ngày",
  "Khách không cần tài khoản",
  "Bảo vệ bằng mật khẩu",
];

export const PricingSection: FC<PricingSectionProps> = ({ startHref }) => {
  return (
    <div id="pricing" className="lp-price">
      <span className="lp-price-name">Gói miễn phí</span>
      <div className="lp-price-amount"><strong>0₫</strong><span>/ tháng</span></div>
      <p>Đủ tính năng. Không phí bắt đầu, không cần thẻ.</p>
      <ul>
        {included.map((item) => (
          <li key={item}><span className="lp-accent-text" aria-hidden="true">♥</span>{item}</li>
        ))}
      </ul>
      <Button asChild variant={null} size={null} className="lp-cta"><a href={startHref}>Gửi album đầu tiên</a></Button>
    </div>
  );
};
export default PricingSection;
