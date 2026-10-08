import { Calendar, Gift, ShieldCheck } from "lucide-react";
import type { Quotation } from "../types/quotation.types";
import { displayDate, formatMoney, quoteAmount } from "../utils/quotation";
import { MinimalQuotationDay } from "./MinimalQuotationDay";

export function MinimalQuotation({ quote }: { quote: Quotation }) {
  const initials =
    quote.brand.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("") || "ST";
  return (
    <article className="quote-document" aria-label="Bản báo giá">
      <header className="quote-brand">
        <div>
          <p className="quote-eyebrow">
            {quote.intro || "Bảng báo giá dịch vụ"}
          </p>
          <h1 className="quote-studio">{quote.brand.name || "Tên studio"}</h1>
          {quote.brand.tagline.trim() && (
            <p className="quote-tagline">{quote.brand.tagline}</p>
          )}
        </div>
        {quote.brand.logo ? (
          <img src={quote.brand.logo} alt={quote.brand.name} />
        ) : (
          <div className="quote-monogram">{initials}</div>
        )}
      </header>
      <div className="quote-metadata">
        <div>
          <span>Khách hàng kính gửi:</span>
          <strong className="quote-customer">
            {quote.customerName || "Tên khách hàng"}
          </strong>
          <p>{quote.title || "Báo giá"}</p>
        </div>
        <div>
          <span>Ngày lập báo giá:</span>
          <strong>{displayDate(quote.issuedOn, true)}</strong>
          {quote.code?.trim() && <p>Mã hồ sơ: {quote.code}</p>}
        </div>
      </div>
      <section className="quote-schedule">
        <h2>
          <Calendar aria-hidden="true" />
          Lịch trình và chi tiết gói chụp
        </h2>
        <div className="quote-days">
          {quote.days.map((day, index) => (
            <MinimalQuotationDay key={day.id} day={day} index={index} />
          ))}
        </div>
      </section>
      <div className="quote-grand-total">
        <div>
          <p>Tổng chi phí dịch vụ trọn gói</p>
          <small>
            Đơn vị: Việt Nam đồng · {quote.days.length} ngày đồng hành
          </small>
        </div>
        <strong>{formatMoney(quoteAmount(quote))} đ</strong>
      </div>
      {(quote.gift.trim() || quote.terms.trim()) && (
        <div
          className={`quote-details ${!quote.gift.trim() || !quote.terms.trim() ? "single" : ""}`}
        >
          {quote.gift.trim() && (
            <section className="quote-gift">
              <h2>
                <Gift aria-hidden="true" />
                Quà tặng kèm theo
              </h2>
              <p>{quote.gift}</p>
            </section>
          )}
          {quote.terms.trim() && (
            <section className="quote-terms">
              <h2>
                <ShieldCheck aria-hidden="true" />
                Điều khoản & bàn giao
              </h2>
              <p>{quote.terms}</p>
            </section>
          )}
        </div>
      )}
      {quote.closing.trim() && (
        <footer className="quote-footer">
          <p>{quote.closing}</p>
        </footer>
      )}
    </article>
  );
}
