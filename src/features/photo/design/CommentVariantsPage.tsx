import { Heart, MessageSquare, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentDropdownVariant } from "./CommentDropdownVariant";

const variants = [
  { name: "Gửi nhanh", detail: "Ô nhập một dòng và nút Gửi cùng hàng. Gọn nhất cho ghi chú ngắn." },
  { name: "Ô viết rõ ràng", detail: "Ô nhập nhiều dòng, nút gửi riêng phía dưới. Cân bằng giữa gọn và dễ viết." },
  { name: "Đọc trước, viết sau", detail: "Bình luận cũ ở trên, ô viết ở cuối. Dễ đọc lại yêu cầu trước khi bổ sung." },
  { name: "Viết trước, đọc sau", detail: "Ô viết ở ngay đầu, lịch sử phía dưới. Ưu tiên gửi yêu cầu mới." },
  { name: "Ô viết liền khối", detail: "Nút gửi nằm trong khung soạn, ít đường chia. Nhẹ và tập trung vào nội dung." },
];

export function CommentVariantsPage() {
  const requested = Number(new URLSearchParams(window.location.search).get("v") ?? 2);
  const variant = requested >= 1 && requested <= 5 ? requested : 2;
  return (
    <main className="guest-album variants-page">
      <header className="variants-header">
        <div><p className="eyebrow">LUMIPIC · THIẾT KẾ BÌNH LUẬN</p><h1>5 phương án dropdown</h1><p>Khung mở dưới nút bình luận; giữ nguyên ảnh trong lightbox.</p></div>
        <span className="preview-label">Bản xem thiết kế · Không gửi dữ liệu</span>
      </header>
      <nav className="variants-nav" aria-label="Chọn phương án">
        {variants.map((item, index) => <Button key={item.name} asChild variant="outline" className={variant === index + 1 ? "variant-active" : ""}><a href={`?v=${index + 1}`} aria-current={variant === index + 1 ? "page" : undefined}>{index + 1}. {item.name}{index === 1 ? " · Đề xuất" : ""}</a></Button>)}
      </nav>
      <div className="variant-description"><strong>{variant}. {variants[variant - 1].name}</strong><span>{variants[variant - 1].detail}</span></div>
      <div className="lightbox-preview">
        <header className="lightbox-header"><div className="photo-name">MQG01668.jpg <span>Ảnh 2 / 719</span></div><div className="lightbox-tools"><Button variant="ghost" size="icon" className="comment-trigger" aria-label="Bình luận" aria-expanded="true"><MessageSquare className="h-5 w-5" /></Button><Button size="icon" className="heart-button" aria-label="Đã thả tim"><Heart className="h-5 w-5 fill-current"/></Button><Button variant="ghost" size="icon" aria-label="Đóng ảnh"><X className="h-5 w-5"/></Button></div></header>
        <img className="lightbox-photo" alt="Ảnh MQG01668.jpg trong album grad 3" src="https://pub-cb7b2986d7b844cfb1a200e4b529be2e.r2.dev/ed66ca48-2013-44cf-a8f0-008c13b9d42c/MQG01668.jpg"/>
        <Button variant="secondary" size="icon" className="photo-previous" aria-label="Ảnh trước"><ChevronLeft/></Button><Button variant="secondary" size="icon" className="photo-next" aria-label="Ảnh sau"><ChevronRight/></Button>
        <CommentDropdownVariant variant={variant}/>
        <footer className="lightbox-footer">Máy 1 · Thiếu giờ chụp · 1067 × 1600 px</footer>
      </div>
      <p className="variants-note">Nội dung bình luận và thời gian là dữ liệu mẫu. Ảnh tham chiếu từ album grad 3. Các ô đang có sẵn nội dung để so sánh bố cục.</p>
    </main>
  );
}
