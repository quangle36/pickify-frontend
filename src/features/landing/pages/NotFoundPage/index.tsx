import { useEffect, useState } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const [canGoBack, setCanGoBack] = useState(false);
  useEffect(() => setCanGoBack(history.length > 1), []);
  const buttonClassName = "w-full min-h-11 cursor-pointer focus-visible:underline focus-visible:underline-offset-4 min-[681px]:w-auto min-[681px]:min-h-10";

  return (
    <main className="flex min-h-screen w-full min-w-0 flex-col bg-background px-6 py-8 text-foreground [--background:40_20%_98%] [--foreground:20_14%_12%] [color-scheme:light] [font-family:'Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] min-[681px]:p-10">
      <a
        href="/"
        className="mx-auto flex w-max items-center gap-2.5 text-xl font-extrabold leading-[normal] tracking-[-0.8px] outline-none focus-visible:underline focus-visible:underline-offset-4"
        aria-label="Lumipic — về trang chủ"
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 text-white" aria-hidden="true">
          <Heart className="h-4 w-4 fill-current" strokeWidth={0} />
        </span>
        Lumipic
      </a>

      <section className="flex min-w-0 flex-1 items-center justify-center py-10" aria-labelledby="not-found-title">
        <div className="w-full min-w-0 max-w-full text-center min-[681px]:max-w-[440px]">
          <p className="m-0 text-sm font-medium leading-5 text-stone-600 tabular-nums">404</p>
          <h1 id="not-found-title" className="mt-1 text-xl font-semibold leading-[1.4]">
            Không tìm thấy trang
          </h1>
          <p className="mx-auto mt-4 max-w-[420px] text-sm leading-[1.75] text-stone-600 [text-wrap:pretty]">
            Đường dẫn có thể bị gõ sai, hoặc trang đã được chuyển sang chỗ khác.
          </p>
          <div className="mt-6 flex w-full flex-col flex-wrap justify-center gap-3 min-[681px]:w-auto min-[681px]:flex-row">
            <Button asChild className={buttonClassName}>
              <a href="/">Về trang chủ</a>
            </Button>
            {canGoBack && (
              <Button
                type="button"
                variant="outline"
                className={buttonClassName}
                onClick={() => history.back()}
              >
                <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                Quay lại trang trước
              </Button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
