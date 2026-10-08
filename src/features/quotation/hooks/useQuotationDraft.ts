import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { readDraft, saveDraft } from "../utils/draft";
import { createQuotation } from "../utils/quotation";
import type { DraftStatus, Quotation } from "../types/quotation.types";

export function loadQuotation(ownerId: string, name: string) {
  try {
    const result = readDraft(window.localStorage, ownerId);
    return {
      quote: result.draft ?? createQuotation(name),
      error: result.error,
    };
  } catch {
    return { quote: createQuotation(name), error: true };
  }
}
export function useQuotationDraft(
  form: UseFormReturn<Quotation>,
  ownerId: string,
  initialError: boolean,
) {
  const [status, setStatus] = useState<DraftStatus>(
    initialError ? "error" : "saved",
  );
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let dirty = !initialError;
    const flush = () => {
      if (!dirty) return;
      clearTimeout(timer);
      let saved = false;
      try {
        saved = saveDraft(window.localStorage, ownerId, form.getValues());
      } catch {
        /* Storage can be disabled. */
      }
      setStatus(saved ? "saved" : "error");
      dirty = !saved;
    };
    if (dirty) {
      setStatus("saving");
      timer = setTimeout(flush, 500);
    }
    const subscription = form.watch(() => {
      dirty = true;
      setStatus("saving");
      clearTimeout(timer);
      timer = setTimeout(flush, 500);
    });
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      subscription.unsubscribe();
      flush();
      clearTimeout(timer);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [form, ownerId, initialError]);
  return status;
}
