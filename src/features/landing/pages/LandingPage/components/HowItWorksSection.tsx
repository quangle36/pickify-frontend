import { FC } from "react";
import { FolderOpen, Heart, FolderSearch } from "lucide-react";

export const HowItWorksSection: FC = () => {
  const steps = [
    {
      step: "1",
      title: "Dán link Google Drive",
      description:
        "Tạo album, dán link thư mục ảnh và đặt mã bảo mật. Hệ thống tự quét và tạo preview.",
      icon: FolderOpen,
    },
    {
      step: "2",
      title: "Khách thả tim chọn ảnh",
      description:
        "Gửi link cho khách qua Zalo, tin nhắn. Khách mở trên điện thoại, nhập mã và chạm tim ảnh ưng ý.",
      icon: Heart,
    },
    {
      step: "3",
      title: "Lọc ảnh RAW trên máy",
      description:
        "Dùng danh sách khách đã chọn để lọc đúng các file RAW trong thư mục ảnh trên máy.",
      icon: FolderSearch,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="border-t border-neutral-100 py-20 sm:py-28"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="mb-14">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-[-0.04em]">
            3 bước đơn giản
          </h2>
          <p className="mt-3 text-stone-500 text-sm sm:text-base">
            Từ link Drive đến bộ ảnh RAW khách đã chọn chỉ trong vài phút.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step}>
                <div
                  className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center mb-6"
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
                  Bước {item.step}
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-7 max-w-xs">
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
export default HowItWorksSection;
