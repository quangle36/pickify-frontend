import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// scripts/seo-html.mjs checks these answers are in the prerendered HTML.
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

export const FAQSection: FC = () => {
  return (
    <div id="faq" className="lp-faq">
      <h2>Câu hỏi thường gặp</h2>
      <Accordion type="single" collapsible className="lp-faq-list">
        {faqs.map((faq, idx) => (
          <AccordionItem key={idx} value={`faq-${idx}`} className="lp-faq-item">
            <AccordionTrigger className="lp-faq-trigger">{faq.question}</AccordionTrigger>
            <AccordionContent forceMount className="lp-faq-answer">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
export default FAQSection;
