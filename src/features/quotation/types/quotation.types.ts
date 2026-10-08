import type { z } from "zod";
import type { quotationDraftSchema } from "../schemas/quotation.schema";
export type Quotation = z.infer<typeof quotationDraftSchema>;
export type QuotationDay = Quotation["days"][number];
export type QuotationService = QuotationDay["services"][number];
export type DraftStatus = "saved" | "saving" | "error";
