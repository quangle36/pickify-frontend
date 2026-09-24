import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useAppStore } from "../stores/app.store";

export function AppShell({ children }: { children: ReactNode }) {
  const error = useAppStore((state) => state.error);
  const clearError = useAppStore((state) => state.clearError);
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {error && (
        <div role="alert" className="bg-amber-100 text-amber-950 p-4 flex justify-between gap-4">
          <span>{error}</span>
          <button onClick={clearError}>Đóng</button>
          <button onClick={() => location.reload()}>Thử lại</button>
        </div>
      )}
      {children}
      <Toaster />
    </div>
  );
}
