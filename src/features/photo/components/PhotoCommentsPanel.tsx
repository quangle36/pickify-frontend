import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePhotoComments } from "../queries/comment.queries";
import { useAddPhotoComment } from "../queries/comment.mutations";

interface Props {
  photoId: string;
  basePath: string;
  canComment: boolean;
  open: boolean;
}

export function PhotoCommentsPanel({
  photoId,
  basePath,
  canComment,
  open,
}: Props) {
  const inputId = useId();
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
    <section
      hidden={!open}
      aria-label="Bình luận ảnh"
      className="max-h-[45dvh] shrink-0 overflow-y-auto border-t border-stone-700 bg-stone-900 p-4 text-stone-100 select-text md:max-h-[40dvh]"
    >
      <div className="mx-auto max-w-3xl space-y-3">
        <h2 className="text-sm font-semibold">Bình luận</h2>
        {comments.isPending && (
          <p role="status" className="text-sm text-stone-400">
            Đang tải bình luận…
          </p>
        )}
        {comments.isError && (
          <div
            role="alert"
            className="flex items-center gap-3 text-sm text-red-400"
          >
            Không tải được bình luận.
            <Button variant="outline" onClick={() => void comments.refetch()}>
              Thử lại
            </Button>
          </div>
        )}
        {!comments.isPending && !comments.isError && list.length === 0 && (
          <p className="text-sm text-stone-400">Chưa có bình luận nào.</p>
        )}
        <div className="space-y-3" aria-live="polite">
          {list.map((comment) => (
            <article
              key={comment.id}
              className="space-y-1 border-b border-stone-800 pb-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Khách hàng</span>
                <time
                  dateTime={comment.createdAt}
                  title={new Date(comment.createdAt).toLocaleString("vi-VN")}
                  className="text-xs text-stone-400"
                >
                  {new Date(comment.createdAt).toLocaleString("vi-VN")}
                </time>
              </div>
              <p className="whitespace-pre-wrap break-words text-sm [overflow-wrap:anywhere]">
                {comment.content}
              </p>
            </article>
          ))}
        </div>
        {comments.hasNextPage && (
          <Button
            variant="outline"
            disabled={comments.isFetchingNextPage}
            onClick={() => void comments.fetchNextPage()}
          >
            Xem thêm bình luận
          </Button>
        )}
        {canComment && (
          <form onSubmit={submit} className="space-y-2">
            <Label htmlFor={inputId} className="text-sm font-medium">
              Yêu cầu cho ảnh này
            </Label>
            <Textarea
              id={inputId}
              value={content}
              maxLength={2000}
              disabled={addComment.isPending}
              placeholder="Ví dụ: Làm sáng khuôn mặt, in 1 ảnh 60×90 cm…"
              className="min-h-20 rounded-xl border-stone-600 bg-stone-800 text-stone-100 placeholder:text-stone-400 focus-visible:ring-brand-500"
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
            {errors[photoId] && (
              <p role="alert" className="text-xs text-red-400">
                {errors[photoId]}
              </p>
            )}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-stone-400">
                {content.length}/2000 ký tự
              </span>
              <Button
                variant="brand"
                type="submit"
                disabled={!content.trim() || addComment.isPending}
              >
                {addComment.isPending ? "Đang gửi…" : "Gửi bình luận"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
