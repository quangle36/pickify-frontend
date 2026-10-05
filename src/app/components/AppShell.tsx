import { useEffect, useRef, type ReactNode } from "react";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { useAppStore } from "../stores/app.store";

export function AppShell({ children }: { children: ReactNode }) {
  const error = useAppStore((state) => state.error);
  const lastShownError = useRef<string | null>(null);

  useEffect(() => {
    if (!error) {
      lastShownError.current = null;
      return;
    }
    if (lastShownError.current === error) return;

    lastShownError.current = error;
    toast({
      variant: "destructive",
      title: error,
      action: (
        <ToastAction altText="Thử lại" onClick={() => location.reload()}>
          Thử lại
        </ToastAction>
      ),
    });
  }, [error]);

  return (
    <div className="app-shell min-h-screen bg-stone-50 flex flex-col font-sans">
      {children}
      <Toaster />
    </div>
  );
}
