import { FC } from "react";
import {
  ShieldCheck,
  Zap,
  Smartphone,
  Save,
  FileSpreadsheet,
  Lock,
} from "lucide-react";

export const FeaturesSection: FC = () => {
  const features = [
    {
      icon: Zap,
      title: "Preview tự động",
      description:
        "Ảnh gốc được nén thành preview nhanh, sắc nét cho lưới ảnh và lightbox.",
    },
    {
      icon: Smartphone,
      title: "Không cần đăng nhập",
      description:
        "Khách mở link, nhập mã 4 số và bắt đầu chọn ảnh ngay trên điện thoại.",
    },
    {
      icon: Save,
      title: "Lưu chọn tức thì",
      description:
        "Mỗi lượt thả tim hoặc bỏ tim được ghi nhận ngay lập tức.",
    },
    {
      icon: FileSpreadsheet,
      title: "Xuất CSV cho Lightroom",
      description:
        "File CSV chuẩn UTF-8 BOM, copy tên file vào Library Filter là xong.",
    },
    {
      icon: ShieldCheck,
      title: "Không can thiệp Drive",
      description:
        "Chỉ đọc folder public. Không sửa, không xóa file gốc trên Drive.",
    },
    {
      icon: Lock,
      title: "Mật khẩu bảo mật",
      description:
        "Mã bảo mật Argon2id. Khóa chỉnh sửa hoặc đổi mã bất cứ lúc nào.",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-neutral-50">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="mb-14">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-[-0.04em]">
            Tính năng chính
          </h2>
          <p className="mt-3 text-stone-500 text-sm sm:text-base">
            Thiết kế theo luồng làm việc thực tế của nhiếp ảnh gia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="border-t border-neutral-200 pt-6"
              >
                <div
                  className="text-neutral-600 mb-5"
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-medium text-neutral-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-7">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;
