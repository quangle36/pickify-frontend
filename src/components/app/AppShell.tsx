import type { ReactNode } from "react";
import type { AppController } from "@/hooks/useAppController";
import { Toaster } from "@/components/ui/toaster";

export function AppShell({ app, children }: { app: AppController; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {app.error && (
        <div role="alert" className="bg-amber-100 text-amber-950 p-4 flex justify-between gap-4">
          <span>{app.error}</span>
          <button onClick={app.actions.clearError}>Đóng</button>
          <button onClick={app.actions.reload}>Thử lại</button>
        </div>
      )}
      {children}
      <Toaster />
    </div>
  );
}
