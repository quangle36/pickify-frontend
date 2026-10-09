import { LoaderCircle } from "lucide-react";

export function GlobalLoadingOverlay() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-background text-muted-foreground"
    >
      <div className="h-8 w-8 animate-spin motion-reduce:animate-none" aria-hidden="true">
        <LoaderCircle className="h-8 w-8 text-primary" />
      </div>
      <span className="text-sm">Đang tải…</span>
    </div>
  );
}
