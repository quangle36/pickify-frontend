import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  preventClose?: boolean;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export function AppModal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  footer,
  preventClose = false,
  contentClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
}: AppModalProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && preventClose) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[92vh] max-w-lg grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden border-stone-200 bg-white p-0",
          contentClassName,
        )}
        onEscapeKeyDown={(event) => preventClose && event.preventDefault()}
        onPointerDownOutside={(event) => preventClose && event.preventDefault()}
      >
        <div
          className={cn(
            "border-b border-stone-200 bg-white px-6 py-5 sm:px-8",
            headerClassName,
          )}
        >
          <DialogHeader className="pr-8 text-left">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  {icon}
                </div>
              )}
              <div className="min-w-0 space-y-1">
                <DialogTitle className="text-xl font-extrabold text-stone-900 sm:text-2xl">
                  {title}
                </DialogTitle>
                {description && (
                  <DialogDescription className="text-xs leading-relaxed text-stone-500">
                    {description}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>
        </div>

        <div
          className={cn(
            "overflow-y-auto bg-stone-50 px-6 py-6 sm:px-8",
            bodyClassName,
          )}
        >
          {children}
        </div>

        {footer && (
          <DialogFooter
            className={cn(
              "border-t border-stone-200 bg-white px-6 py-4 sm:px-8",
              footerClassName,
            )}
          >
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
