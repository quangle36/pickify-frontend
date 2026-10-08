import type { ComponentType } from "react";
import type { Quotation } from "../types/quotation.types";
import { MinimalQuotation } from "./MinimalQuotation";
export const quotationThemes: Record<
  Quotation["themeId"],
  { label: string; render: ComponentType<{ quote: Quotation }> }
> = {
  minimal: { label: "Tối giản (Minimal)", render: MinimalQuotation },
};
