import { quoteFilename } from "./quotation";
import type { Quotation } from "../types/quotation.types";

export async function exportQuotationImage(
  node: HTMLElement,
  quote: Quotation,
): Promise<void> {
  const { toBlob } = await import("html-to-image");
  await Promise.all(
    Array.from(node.querySelectorAll("img")).map((image) => image.decode()),
  );
  const blob = await toBlob(node, {
    width: 800,
    height: node.scrollHeight,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    skipFonts: true,
    skipAutoScale: true,
  });
  if (!blob || blob.size === 0)
    throw new Error("Không thể tạo ảnh. Vui lòng thử lại.");
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = quoteFilename(quote);
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
