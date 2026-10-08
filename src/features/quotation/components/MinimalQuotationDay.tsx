import type { QuotationDay } from "../types/quotation.types";
import {
  dayAmount,
  displayDate,
  formatMoney,
  serviceAmount,
} from "../utils/quotation";

export function MinimalQuotationDay({
  day,
  index,
}: {
  day: QuotationDay;
  index: number;
}) {
  return (
    <section className="quote-document-day">
      <div className="quote-day-heading">
        <span className="quote-day-number">Ngày {index + 1}</span>
        <span>
          {displayDate(day.date)} · {day.startTime || "--:--"} –{" "}
          {day.endTime || "--:--"}
        </span>
      </div>
      <div className="quote-services">
        {day.services.map((service) => (
          <div key={service.id} className="quote-service">
            <div>
              <p>{service.name || "Tên dịch vụ"}</p>
              <small>
                {service.quantity || "—"} ×{" "}
                {formatMoney(Number(service.unitPrice))} đ
              </small>
            </div>
            <strong>{formatMoney(serviceAmount(service))} đ</strong>
          </div>
        ))}
      </div>
      <div className="quote-day-total">
        <span>Tổng ngày {String(index + 1).padStart(2, "0")}</span>
        <span>{formatMoney(dayAmount(day))} đ</span>
      </div>
    </section>
  );
}
