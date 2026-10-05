import { LoaderCircle } from "lucide-react";

export function GlobalLoadingIndicator() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-background text-muted-foreground"
    >
      <LoaderCircle
        className="h-8 w-8 animate-spin text-primary motion-reduce:animate-none"
        aria-hidden="true"
      />
      <span className="text-sm">Đang tải…</span>
    </div>
  );
}
