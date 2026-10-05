import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, ArrowUp } from "lucide-react";

export function CommentDropdownVariant({ variant }: { variant: number }) {
  const id = useId();
  const history = (
    <div className="comment-history">
      <article><div className="comment-meta"><strong>Khách hàng</strong><span>14:20</span></div><p>Giữ màu áo tự nhiên giúp mình nhé.</p></article>
      <article><div className="comment-meta"><strong>Khách hàng</strong><span>14:23</span></div><p>Ảnh này mình muốn lấy bản in.</p></article>
    </div>
  );
  const form = (
    <div className="comment-composer">
      <label htmlFor={id}>Yêu cầu cho ảnh này</label>
      {variant === 1 ? (
        <div className="comment-inline">
          <Input id={id} readOnly value="Làm sáng gương mặt một chút" />
          <Button className="comment-send" type="button">Gửi</Button>
        </div>
      ) : (
        <>
          <Textarea id={id} readOnly value="Làm sáng gương mặt một chút, giữ màu áo tự nhiên giúp mình nhé." className={variant === 5 ? "integrated-textarea" : ""} />
          <div className="comment-actions">
            <span>MQG01668.jpg</span>
            <Button className="comment-send" size={variant === 5 ? "icon" : "default"} type="button" aria-label="Gửi bình luận">
              {variant === 5 ? <ArrowUp className="h-4 w-4" /> : "Gửi bình luận"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
  return (
    <section className={`comment-popover variant-${variant}`} aria-label={`Dropdown phương án ${variant}`}>
      <div className="comment-heading"><h2>Bình luận {variant === 3 || variant === 4 ? <span>2</span> : null}</h2><Button size="icon" variant="ghost" aria-label="Đóng bình luận" className="h-8 w-8"><X className="h-4 w-4"/></Button></div>
      {variant === 3 && history}
      {form}
      {variant === 4 && <><div className="history-heading">Bình luận trước đó</div>{history}</>}
      {variant === 5 && <p className="comment-empty">Chưa có bình luận nào</p>}
    </section>
  );
}
