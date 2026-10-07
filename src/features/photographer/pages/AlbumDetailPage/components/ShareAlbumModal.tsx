import { useState } from "react";
import {
  Check,
  Copy,
  Eye,
  Heart,
  LockKeyhole,
  Share2,
} from "lucide-react";
import { AppModal } from "@/components/ui/app-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type ShareMode = "view" | "interactive";

interface ShareAlbumModalProps {
  shareId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albumTitle?: string;
  passcode?: string;
}

export function ShareAlbumModal({
  shareId,
  open,
  onOpenChange,
  albumTitle,
  passcode,
}: ShareAlbumModalProps) {
  const [copied, setCopied] = useState<ShareMode | null>(null);
  const [copyError, setCopyError] = useState(false);
  const interactiveLink = `${window.location.origin}/album/${shareId}`;
  const viewOnlyLink = `${interactiveLink}?mode=view`;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setCopied(null);
      setCopyError(false);
    }
    onOpenChange(nextOpen);
  };

  const copyLink = async (mode: ShareMode) => {
    try {
      await navigator.clipboard.writeText(
        mode === "view" ? viewOnlyLink : interactiveLink,
      );
      setCopied(mode);
      setCopyError(false);
      window.setTimeout(
        () => setCopied((current) => (current === mode ? null : current)),
        2000,
      );
    } catch {
      setCopyError(true);
    }
  };

  return (
    <AppModal
      open={open}
      onOpenChange={handleOpenChange}
      icon={<Share2 className="h-5 w-5 text-stone-700" />}
      title="Chia sẻ album"
      description={
        albumTitle
          ? `${albumTitle} — Chọn quyền trước khi gửi link`
          : "Chọn quyền phù hợp trước khi gửi link cho khách."
      }
      contentClassName="max-w-lg"
      headerClassName="px-4 py-4 sm:px-6 sm:py-5 border-b border-stone-100"
      bodyClassName="space-y-3.5 bg-white px-4 py-4 sm:px-6 sm:py-5"
      onOpenAutoFocus={(event) => event.preventDefault()}

    >
      {/* Item 1: Link chọn ảnh (Hành động chính) */}
      <section className="rounded-2xl border border-stone-300 bg-stone-50/60 p-3 sm:p-4 shadow-xs transition-all hover:border-stone-400">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-white shadow-xs">
              <Heart className="h-4 w-4 fill-white" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-xs sm:text-sm font-bold text-stone-950">
                Link khách chọn ảnh
              </h3>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-stone-300 bg-stone-200 px-2.5 py-0.5 text-xs font-bold text-stone-800">
            <LockKeyhole className="h-3 w-3" />
            {passcode ? `Pass: ${passcode}` : "Có pass"}
          </span>
        </div>

        {/* Thanh link + nút copy responsive */}
        <div className="mt-2.5 flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white p-1 shadow-xs">
          <span className="flex-1 select-all truncate px-2.5 font-mono text-xs text-stone-600">
            {interactiveLink}
          </span>
          <Button
            type="button"
            onClick={() => void copyLink("interactive")}
            size="sm"
            aria-label="Sao chép link khách chọn ảnh"
            className="shrink-0 rounded-lg"
          >
            {copied === "interactive" ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </section>

      {/* Item 2: Link chỉ xem (Người thân / Bạn bè) */}
      <section className="rounded-2xl border border-stone-200 bg-white p-3 sm:p-4 shadow-xs transition-all hover:border-stone-300">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <Eye className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-xs sm:text-sm font-bold text-stone-900">
                Link người thân chỉ xem
              </h3>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
            Công khai
          </span>
        </div>

        {/* Thanh link + nút copy responsive */}
        <div className="mt-2.5 flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 p-1">
          <span className="flex-1 select-all truncate px-2.5 font-mono text-xs text-stone-600">
            {viewOnlyLink}
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={() => void copyLink("view")}
            size="sm"
            aria-label="Sao chép link chỉ xem"
            className="shrink-0 rounded-lg"
          >
            {copied === "view" ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-stone-500" />
            )}
          </Button>
        </div>
      </section>

      {copyError && (
        <Alert variant="destructive">
          <AlertDescription>
            Không thể sao chép tự động. Hãy chọn link và sao chép thủ công.
          </AlertDescription>
        </Alert>
      )}
    </AppModal>
  );
}
