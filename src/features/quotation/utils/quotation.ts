import type { Quotation, QuotationService } from "../types/quotation.types";

export function localDate(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export function createService(): QuotationService {
  return { id: crypto.randomUUID(), name: "", quantity: "1", unitPrice: "" };
}
export function createDay() {
  return {
    id: crypto.randomUUID(),
    date: "",
    startTime: "07:00",
    endTime: "17:00",
    services: [createService()],
  };
}
export function createQuotation(studioName: string): Quotation {
  return {
    schemaVersion: 1,
    themeId: "minimal",
    brand: {
      name: studioName,
      tagline: "WEDDING PHOTOGRAPHY & FILM",
      logo: "",
    },
    intro: "Dành riêng cho hai bạn",
    title: "Báo giá ngày cưới",
    customerName: "",
    code: "",
    issuedOn: localDate(),
    days: [createDay()],
    terms: "",
    gift: "",
    closing: "Hân hạnh đồng hành trong ngày của hai bạn.",
  };
}
export function serviceAmount(service: QuotationService): number {
  const quantity = Number(service.quantity),
    price = Number(service.unitPrice);
  const amount = quantity * price;
  return /^\d+$/.test(service.quantity) &&
    /^\d+$/.test(service.unitPrice) &&
    quantity > 0 &&
    Number.isSafeInteger(amount) &&
    amount >= 0
    ? amount
    : 0;
}
export function dayAmount(day: Quotation["days"][number]): number {
  const total = day.services.reduce((sum, row) => sum + serviceAmount(row), 0);
  return Number.isSafeInteger(total) ? total : 0;
}
export function quoteAmount(quote: Quotation): number {
  const total = quote.days.reduce((sum, day) => sum + dayAmount(day), 0);
  return Number.isSafeInteger(total) ? total : 0;
}
export const formatMoney = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(Number.isFinite(value) ? value : 0);
export function displayDate(value: string, long = false): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Chưa chọn ngày";
  const [year, month, day] = value.split("-");
  return long
    ? `${Number(day)} tháng ${Number(month)}, ${year}`
    : `${day}.${month}.${year}`;
}
export function quoteFilename(quote: Quotation): string {
  const slug =
    quote.customerName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100) || "khach-hang";
  return `bao-gia-${slug}-${quote.issuedOn}.png`;
}
