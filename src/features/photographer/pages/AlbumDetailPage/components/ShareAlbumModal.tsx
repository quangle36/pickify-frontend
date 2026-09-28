import { useState } from "react";
import {
  Check,
  Copy,
  Eye,
  Heart,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { AppModal } from "@/components/ui/app-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ShareMode = "view" | "interactive";

interface ShareAlbumModalProps {
  shareId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareAlbumModal({
  shareId,
  open,
  onOpenChange,
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
      title="Chia sẻ album"
      description="Chọn quyền phù hợp trước khi gửi link cho khách."
      contentClassName="max-w-xl"
      bodyClassName="space-y-4"
    >
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Eye className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-extrabold text-stone-900">Link chỉ xem</h3>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                Không cần pass
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">
              Khách có thể xem toàn bộ ảnh nhưng không thấy và không thể sử dụng
              nút thả tim.
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Input
            readOnly
            value={viewOnlyLink}
            aria-label="Link album chỉ xem"
            className="h-10 min-w-0 rounded-xl bg-stone-50 font-mono text-xs"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => void copyLink("view")}
            className="shrink-0 gap-2"
          >
            {copied === "view" ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied === "view" ? "Đã chép" : "Sao chép"}
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-rose-200 bg-white p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <Heart className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-extrabold text-stone-900">Link chọn ảnh</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700">
                <LockKeyhole className="h-3 w-3" /> Có pass
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">
              Khách nhập mật khẩu album để xem ảnh và thả tim những ảnh muốn
              chọn.
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Input
            readOnly
            value={interactiveLink}
            aria-label="Link album chọn ảnh"
            className="h-10 min-w-0 rounded-xl bg-stone-50 font-mono text-xs"
          />
          <Button
            type="button"
            variant="brand"
            onClick={() => void copyLink("interactive")}
            className="shrink-0 gap-2"
          >
            {copied === "interactive" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied === "interactive" ? "Đã chép" : "Sao chép"}
          </Button>
        </div>
      </section>

      <div className="flex items-center gap-2 text-[11px] text-stone-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        Chỉ link chọn ảnh mới có quyền gửi thay đổi lên Pickify.
      </div>

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
