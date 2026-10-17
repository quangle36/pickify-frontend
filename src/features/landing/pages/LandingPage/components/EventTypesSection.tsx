import { Badge } from "@/components/ui/badge";

const events = ["Cưới hỏi", "Kỷ yếu", "Sự kiện doanh nghiệp", "Sinh nhật", "Chân dung", "Gia đình", "Du lịch", "Sản phẩm"];

export function EventTypesSection() {
  return <section className="lp-soft">
    <div className="lp-wrap lp-events">
      <h2>Buổi chụp nào cũng hợp.</h2>
      <ul>{events.map((event) => <li key={event}><Badge variant="outline" className="lp-chip">{event}</Badge></li>)}</ul>
    </div>
  </section>;
}
