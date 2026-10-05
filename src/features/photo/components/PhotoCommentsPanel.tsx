import { useId, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePhotoComments } from "../queries/comment.queries";
import { useAddPhotoComment } from "../queries/comment.mutations";

interface Props {
  photoId: string;
  photoName: string;
  onClose: () => void;
  basePath: string;
  canComment: boolean;
  open: boolean;
}

export function PhotoCommentsPanel({
  photoId,
  photoName,
  onClose,
  basePath,
  canComment,
  open,
}: Props) {
  const inputId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const comments = usePhotoComments(basePath, photoId, open);
  const addComment = useAddPhotoComment(basePath);
  const [drafts, setDrafts] = useState<
    Record<string, { content: string; mutationId: string }>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const draft = drafts[photoId];
  const content = draft?.content ?? "";
  const list = comments.data?.pages.flatMap((page) => page.comments) ?? [];

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft || !content.trim() || addComment.isPending) return;
    const targetId = photoId;
    setErrors((previous) => ({ ...previous, [targetId]: "" }));
    try {
      await addComment.mutateAsync({
        photoId: targetId,
        content: content.trim(),
        clientMutationId: draft.mutationId,
      });
      toast({ description: "Đã gửi bình luận.", duration: 2500 });
      setDrafts((previous) => ({
        ...previous,
        [targetId]: { content: "", mutationId: crypto.randomUUID() },
      }));
    } catch {
      setErrors((previous) => ({
        ...previous,
        [targetId]:
          "Chưa gửi được bình luận. Nội dung vẫn được giữ lại, hãy thử gửi lại.",
      }));
    }
  };

  return (
    <PopoverContent
      ref={contentRef}
      align="end"
      side="bottom"
      sideOffset={12}
      collisionPadding={16}
      aria-label="Bình luận ảnh"
      className="guest-album z-[60] w-[360px] max-w-[calc(100vw-32px)] max-h-[min(70dvh,var(--radix-popover-content-available-height))] overflow-y-auto rounded-2xl border-stone-700 bg-[#262220] p-0 text-stone-100 shadow-xl shadow-black/40 select-text"
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        if (canComment) textareaRef.current?.focus();
        else contentRef.current?.focus();
      }}
      onEscapeKeyDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between px-4 pb-2 pt-3">
        <h2 className="text-sm font-semibold">Bình luận</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Đóng bình luận"
          onClick={onClose}
          className="-mr-1 h-8 w-8 rounded-lg text-stone-400 hover:bg-stone-700 hover:text-stone-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {canComment && (
        <form onSubmit={submit} className="space-y-3 px-4 pb-4">
          <div className="space-y-2">
            <Label htmlFor={inputId} className="text-[13px] font-medium">
              Yêu cầu cho ảnh này
            </Label>
            <Textarea
              ref={textareaRef}
              id={inputId}
              value={content}
              maxLength={2000}
              disabled={addComment.isPending}
              placeholder="Ví dụ: Làm sáng gương mặt, giữ màu áo tự nhiên…"
              className="h-[106px] min-h-[106px] resize-none rounded-xl border-stone-600 bg-stone-900 p-3 text-base leading-relaxed text-stone-100 placeholder:text-stone-400 focus-visible:border-stone-400 focus-visible:ring-stone-400/20 focus-visible:ring-offset-0 md:text-sm"
              onChange={(event) => {
                const value = event.target.value;
                setDrafts((previous) => ({
                  ...previous,
                  [photoId]: {
                    content: value,
                    mutationId: crypto.randomUUID(),
                  },
                }));
                setErrors((previous) => ({ ...previous, [photoId]: "" }));
              }}
            />
          </div>
          {errors[photoId] && (
            <p role="alert" className="text-xs text-red-400">
              {errors[photoId]}
            </p>
          )}
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="truncate font-mono text-[11px] text-stone-400" title={photoName}>
              {photoName}
            </span>
            <Button
              type="submit"
              disabled={!content.trim() || addComment.isPending}
              className="h-10 shrink-0 rounded-xl bg-rose-300 px-3.5 text-[13px] font-semibold text-stone-900 shadow-none hover:bg-rose-200"
            >
              {addComment.isPending ? "Đang gửi…" : "Gửi bình luận"}
            </Button>
          </div>
        </form>
      )}
      {(comments.isPending || comments.isError || list.length > 0 || !canComment) && (
        <div className="space-y-3 border-t border-stone-700 px-4 py-3">
          {comments.isPending && (
            <p role="status" className="text-xs text-stone-400">Đang tải bình luận…</p>
          )}
          {comments.isError && (
            <div role="alert" className="flex items-center justify-between gap-3 text-xs text-red-400">
              Không tải được bình luận.
              <Button variant="outline" className="shrink-0 border-stone-600 bg-stone-800 text-stone-100 hover:bg-stone-700 hover:text-white" onClick={() => void comments.refetch()}>
                Thử lại
              </Button>
            </div>
          )}
          {!comments.isPending && !comments.isError && list.length === 0 && (
            <p className="text-xs text-stone-400">Chưa có bình luận nào.</p>
          )}
          <div className="space-y-3" aria-live="polite">
            {list.map((comment) => (
              <article key={comment.id} className="space-y-1 border-b border-stone-700 pb-3 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium">Khách hàng</span>
                  <time dateTime={comment.createdAt} title={new Date(comment.createdAt).toLocaleString("vi-VN")} className="text-xs text-stone-400">
                    {new Date(comment.createdAt).toLocaleString("vi-VN")}
                  </time>
                </div>
                <p className="whitespace-pre-wrap break-words text-[13px] leading-relaxed [overflow-wrap:anywhere]">{comment.content}</p>
              </article>
            ))}
          </div>
          {comments.hasNextPage && (
            <Button variant="outline" className="border-stone-600 bg-stone-800 text-stone-100 hover:bg-stone-700 hover:text-white" disabled={comments.isFetchingNextPage} onClick={() => void comments.fetchNextPage()}>
              Xem thêm bình luận
            </Button>
          )}
        </div>
      )}
    </PopoverContent>
  );
}
