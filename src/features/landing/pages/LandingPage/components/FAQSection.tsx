import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection: FC = () => {
  const faqs = [
    {
      question: "Lumipic có thể can thiệp file trên Google Drive không?",
      answer:
        "Không. Lumipic chỉ đọc folder được chia sẻ công khai, không sửa hoặc xóa ảnh gốc.",
    },
    {
      question: "Khách có cần đăng nhập hay cài app không?",
      answer:
        "Không cần. Khách mở link từ Zalo, Messenger hay trình duyệt, nhập mã 4 số là bắt đầu chọn.",
    },
    {
      question: "Nhiều người chọn trên nhiều thiết bị có bị lệch không?",
      answer:
        "Mọi lượt thả tim đều được ghi vào cùng một danh sách. Tải lại trang để thấy lựa chọn mới nhất.",
    },
    {
      question: "Cách đưa danh sách vào Lightroom?",
      answer:
        "Bấm \"Xuất CSV\" trên dashboard, copy cột tên file và dán vào Library Filter (Text → Filename → Contains).",
    },
  ];

  return (
    <section
      id="faq"
      className="py-20 sm:py-28 border-t border-neutral-100"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-20">
        <h2 className="text-3xl sm:text-4xl font-medium tracking-[-0.04em]">
          Câu hỏi thường gặp
        </h2>

        <Accordion
          type="single"
          collapsible
          className="border-t border-neutral-200"
        >
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="border-b border-neutral-200"
            >
              <AccordionTrigger className="text-sm font-medium text-neutral-900 py-6 hover:no-underline text-left gap-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-neutral-500 leading-7 pb-6">
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
