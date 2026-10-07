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
      className="landing-section"
    >
      <div className="landing-container landing-faq-layout">
        <h2>Điều bạn<br />muốn biết.</h2>

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
              <AccordionContent forceMount className="text-sm text-neutral-500 leading-7 pb-6">
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
