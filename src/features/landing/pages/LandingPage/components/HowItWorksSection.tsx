import { FC } from "react";
import {
  UploadCloud,
  Smartphone,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const HowItWorksSection: FC = () => {
  const steps = [
    {
      step: "01",
      title: "Dán Link Google Drive",
      description:
        "Chỉ cần copy đường link thư mục JPEG trên Drive của bạn, đặt tên album và tạo mã mật khẩu 4 chữ số cho khách.",
      subtext:
        "Hệ thống tự quét tối đa 1.500 JPEG và tạo ảnh preview siêu nét.",
      icon: UploadCloud,
      color: "bg-blue-500 text-white shadow-blue-500/25",
    },
    {
      step: "02",
      title: "Gửi Link Cho Khách",
      description:
        "Gửi link rút gọn kèm mã mật khẩu qua Zalo/Facebook. Khách mở trên điện thoại, bấm chạm tim ❤️ để chọn các tấm ưng ý.",
      subtext:
        "Mỗi lượt tim được lưu vào danh sách chung; thiết bị khác tải lại trang để xem thay đổi mới nhất.",
      icon: Smartphone,
      color: "bg-rose-500 text-white shadow-rose-500/25",
    },
    {
      step: "03",
      title: "Xuất CSV Cho Lightroom",
      description:
        "Vào Dashboard xem tổng số tim đã chọn, bấm 1-click để tải file CSV. Lọc và chỉnh sửa ngay trong Lightroom hoặc Photoshop.",
      subtext:
        "File CSV có UTF-8 BOM hiển thị tiếng Việt chuẩn, không bao giờ nhầm file.",
      icon: FileSpreadsheet,
      color: "bg-amber-500 text-white shadow-amber-500/25",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-24 bg-white border-t border-stone-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            variant="brand"
            className="mb-2 uppercase tracking-widest font-bold"
          >
            Quy Trình Siêu Đơn Giản
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-2">
            3 bước để hoàn tất việc chọn ảnh của một album
          </h2>
          <p className="mt-4 text-stone-600 text-sm sm:text-base">
            Không cần hướng dẫn dài dòng cho khách, không cần cài app, không cần
            cấu hình server phức tạp.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                className="relative bg-stone-50 rounded-3xl p-7 border-stone-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${item.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-stone-300 font-mono tracking-tighter">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200/60 text-xs font-medium text-stone-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{item.subtext}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default HowItWorksSection;
