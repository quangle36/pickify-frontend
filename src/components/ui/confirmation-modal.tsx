import { useRef, useState, type ReactNode, type RefObject } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";

export interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  icon?: ReactNode;
  returnFocusRef?: RefObject<HTMLElement>;
  /** Return false to keep the modal open after a handled failure. */
  onConfirm: () => void | boolean | Promise<void | boolean>;
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  variant = "default",
  icon,
  returnFocusRef,
  onConfirm,
}: ConfirmationModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (submitting.current) return;
    setFailed(false);
    onOpenChange(nextOpen);
  };

  const handleConfirm = async () => {
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setFailed(false);
    try {
      const result = await onConfirm();
      if (result !== false) onOpenChange(false);
    } catch {
      setFailed(true);
    } finally {
      submitting.current = false;
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        role="alertdialog"
        hideCloseButton
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-md gap-6 overflow-y-auto rounded-2xl border-stone-200 bg-white p-6"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          cancelRef.current?.focus();
        }}
        onCloseAutoFocus={(event) => {
          if (returnFocusRef?.current?.isConnected) {
            event.preventDefault();
            returnFocusRef.current.focus();
          }
        }}
        onEscapeKeyDown={(event) => submitting.current && event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4">
          <div aria-hidden="true" className={`flex h-10 w-10 items-center justify-center rounded-full ${variant === "destructive" ? "bg-rose-50 text-rose-700" : "bg-stone-100 text-stone-700"}`}>
            {icon ?? <AlertTriangle className="h-5 w-5" strokeWidth={1.5} />}
          </div>
          <DialogTitle className="text-lg font-semibold text-stone-900">{title}</DialogTitle>
          <DialogDescription className="col-span-2 mt-2 min-w-0 break-words text-sm leading-6 text-stone-600 sm:col-span-1 sm:col-start-2 sm:mt-0.5">
            {description}
          </DialogDescription>
        </div>
        {failed && <p role="alert" className="text-sm text-rose-700">Không thể hoàn tất thao tác. Vui lòng thử lại.</p>}
        <DialogFooter className="gap-2 sm:space-x-0">
          <Button ref={cancelRef} type="button" variant="secondary" disabled={pending} onClick={() => handleOpenChange(false)}>{cancelLabel}</Button>
          <Button type="button" variant={variant} isLoading={pending} onClick={() => void handleConfirm()}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
