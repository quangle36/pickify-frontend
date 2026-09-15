import { FC } from "react";
import {
  ShieldCheck,
  Zap,
  Smartphone,
  Save,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const FeaturesSection: FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      title: "Nhập ảnh từ folder Drive public",
      description:
        "Hệ thống chỉ yêu cầu quyền đọc tối thiểu để quét JPEG. Tuyệt đối không can thiệp, không sửa đổi hay xóa bất kỳ file gốc nào trên Google Drive của bạn.",
    },
    {
      icon: Zap,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      title: "Tự động tạo ảnh xem trước sắc nét",
      description:
        "Ảnh gốc 30-50MB được tự động chuyển đổi thành một ảnh display 1.600px dùng chung cho lưới và lightbox, giúp giảm thời gian xử lý và dung lượng lưu trữ.",
    },
    {
      icon: Smartphone,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      title: "Khách hàng không cần đăng nhập",
      description:
        "Khách chỉ cần mở link và nhập mã bảo mật 4 số. Không phiền toái bắt khách tải app hay đăng nhập tài khoản Google. Trực quan từ người già đến trẻ nhỏ.",
    },
    {
      icon: Save,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      title: "Lưu lựa chọn ngay lập tức",
      description:
        "Mỗi lần khách thả tim hoặc bỏ tim đều được ghi ngay vào PostgreSQL và phản hồi trên thiết bị đang dùng. Photographer xem lại danh sách sau khi khách hoàn tất.",
    },
    {
      icon: FileSpreadsheet,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      title: "Xuất CSV chuẩn Lightroom & Excel tiếng Việt",
      description:
        "File CSV được mã hóa UTF-8 BOM chuẩn tiếng Việt, có sẵn Tên file, Drive File ID, Link gốc. Photographer chỉ cần copy mã vào Lightroom Library Filter là lọc xong toàn bộ.",
    },
    {
      icon: Lock,
      color: "text-stone-700 bg-stone-100 border-stone-300",
      title: "Bảo vệ mật khẩu & Thu hồi phiên tức thì",
      description:
        "Mật khẩu băm Argon2id bảo mật cao. Đổi mật khẩu sẽ lập tức thu hồi toàn bộ các phiên khách đang mở. Hạn mức album 30 ngày tự động dọn dẹp an toàn.",
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            variant="brand"
            className="mb-2 uppercase tracking-widest font-bold"
          >
            Tính Năng Vượt Trội
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-2">
            Được thiết kế tỉ mỉ theo luồng công việc thực tế của Nhiếp ảnh gia
          </h2>
          <p className="mt-4 text-stone-600 text-sm sm:text-base">
            Mọi tính năng đều bám sát trải nghiệm thực chiến: xử lý album tới
            1.500 ảnh, không bao giờ bỏ sót file, và bảo đảm tính riêng tư tối
            đa.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border-stone-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl ${item.color} border flex items-center justify-center mb-5`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs font-semibold text-stone-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Chuẩn theo đặc tả MVP plan.md</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;
