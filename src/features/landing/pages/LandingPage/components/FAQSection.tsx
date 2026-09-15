import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: FC = () => {
  const faqs: FAQItem[] = [
    {
      question:
        "Pickify có thể can thiệp, sửa đổi hay xóa ảnh trên Google Drive của tôi không?",
      answer:
        "Pickify chỉ đọc folder và ảnh được chia sẻ công khai bằng liên kết, không yêu cầu quyền truy cập tài khoản Drive. Hệ thống không sửa hoặc xóa ảnh gốc. Người có link Drive public vẫn xem được ảnh gốc; mật khẩu Pickify chỉ bảo vệ album trên Pickify.",
    },
    {
      question:
        "Khách hàng của tôi có cần đăng nhập tài khoản Google hay cài app không?",
      answer:
        "Hoàn toàn không cần! Khách chỉ cần nhấn vào link album bạn gửi (có thể mở trực tiếp từ Zalo, Messenger, tin nhắn SMS, trình duyệt Safari/Chrome) và nhập mã bảo mật gồm 4 chữ số. Thao tác cực kỳ thân thiện với mọi lứa tuổi.",
    },
    {
      question:
        "Cô dâu và chú rể mở 2 máy khác nhau thì danh sách tim có bị lệch không?",
      answer:
        "Mọi lượt thả tim đều được ghi ngay vào cùng một danh sách trên hệ thống. Trong phiên bản đầu, mỗi máy hiển thị thao tác của chính mình; tải lại trang để xem lựa chọn được thực hiện trên thiết bị khác.",
    },
    {
      question: "Làm thế nào để đưa danh sách đã chọn vào Adobe Lightroom?",
      answer:
        'Sau khi khách chọn xong, bạn vào Dashboard và bấm "Xuất CSV". File CSV được định dạng UTF-8 BOM hiển thị chuẩn tiếng Việt trên Microsoft Excel, chứa cột tên file và link gốc. Bạn chỉ cần sao chép cột tên file dán vào bộ lọc Library Filter (Text -> Filename -> Contains) trong Lightroom là hiển thị ngay các ảnh cần retouch.',
    },
    {
      question:
        "Giới hạn kích thước và số lượng ảnh trong bản MVP là bao nhiêu?",
      answer:
        "Mỗi tài khoản photographer được duy trì tối đa 3 album đang hoạt động cùng lúc, mỗi album chứa tối đa 1.500 ảnh JPEG (mỗi ảnh tối đa 50MB). Thời hạn lưu trữ xem trước là 30 ngày kể từ lúc album hoàn tất xử lý.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-16 sm:py-24 bg-white border-t border-stone-200/80"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge
            variant="brand"
            className="uppercase tracking-widest font-bold mb-2"
          >
            Giải Đáp Thắc Mắc
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-2">
            Câu hỏi thường gặp
          </h2>
          <p className="mt-3 text-stone-600 text-sm">
            Mọi thông tin bạn cần biết về độ bảo mật, cách lưu lựa chọn và trải
            nghiệm sản phẩm.
          </p>
        </div>

        {/* Shadcn Accordion list */}
        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="space-y-4"
        >
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden transition-all px-6 py-1"
            >
              <AccordionTrigger className="text-base font-bold text-stone-900 hover:text-brand-600 py-4 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-stone-600 leading-relaxed pt-1 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
export default FAQSection;
