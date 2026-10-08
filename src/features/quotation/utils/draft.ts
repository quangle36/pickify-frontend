import { quotationDraftSchema } from "../schemas/quotation.schema";
import type { Quotation } from "../types/quotation.types";
export const draftKey = (ownerId: string) => `lumipic:quotation:v1:${ownerId}`;
type DraftStorage = Pick<Storage, "getItem" | "setItem">;
export function readDraft(
  storage: DraftStorage,
  ownerId: string,
): { draft: Quotation | null; error: boolean } {
  try {
    const raw = storage.getItem(draftKey(ownerId));
    if (raw === null) return { draft: null, error: false };
    const result = quotationDraftSchema.safeParse(JSON.parse(raw));
    return result.success
      ? {
          draft: { ...result.data, code: result.data.code ?? "" },
          error: false,
        }
      : { draft: null, error: true };
  } catch {
    return { draft: null, error: true };
  }
}
export function saveDraft(
  storage: DraftStorage,
  ownerId: string,
  quote: Quotation,
): boolean {
  try {
    storage.setItem(
      draftKey(ownerId),
      JSON.stringify(quotationDraftSchema.parse(quote)),
    );
    return true;
  } catch {
    return false;
  }
}
