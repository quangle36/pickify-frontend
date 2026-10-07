import { RelatedGuides } from "../../components/RelatedGuides";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { guideSteps } from "./guide";
import { GuideStep } from "./GuideStep";
import { useActiveGuideSection } from "./useActiveGuideSection";

export default function DriveSelectionGuidePage() {
  const activeId = useActiveGuideSection();
  return <div className="min-h-screen bg-white text-neutral-900">
    <header className="sticky top-0 z-30 border-b border-neutral-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-6 sm:px-8">
        <a href="/" className="flex items-center gap-2.5 text-xl font-medium tracking-tight" aria-label="Lumipic — về trang chủ">
          <span className="grid size-8 place-items-center rounded-full bg-neutral-900 text-white"><Heart className="size-4 fill-current" aria-hidden="true" /></span>Lumipic
        </a>
        <Button asChild className="rounded-full bg-neutral-900 px-5 text-white shadow-none hover:bg-neutral-700"><a href="/dashboard">Tạo album <ArrowRight className="ml-2 size-4" aria-hidden="true" /></a></Button>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-6 pb-16 sm:px-8">
      <div className="max-w-3xl pb-12 pt-12 sm:pb-16 sm:pt-20">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900"><ArrowLeft className="size-4" aria-hidden="true" /> Về trang chủ</a>
        <p className="mb-5 mt-8 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">Hướng dẫn sử dụng · Google Drive</p>
        <h1 className="text-4xl font-medium leading-[1.15] tracking-[-0.045em] sm:text-5xl lg:text-6xl">Cách gửi ảnh từ Google Drive cho khách chọn</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-500">7 bước để gửi ảnh, nhận lựa chọn và lọc ảnh hậu kì.</p>
        <p className="mt-5 text-sm text-neutral-500">Chuẩn bị: ảnh JPEG trên Drive · tài khoản Lumipic · ảnh gốc trên máy</p>
      </div>
      <div className="grid gap-x-14 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="mb-8 lg:mb-0">
          <nav aria-label="Các bước trong hướng dẫn" className="border-t border-neutral-200 pt-6 lg:sticky lg:top-28">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">Trong hướng dẫn này</p>
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {guideSteps.map((step,index) => <li key={step.id}>
                <a
                  href={`#${step.id}`}
                  aria-current={activeId === step.id ? "step" : undefined}
                  className={`flex items-start gap-3 border-l-2 pl-3 text-sm leading-6 transition-colors hover:text-neutral-900 ${activeId === step.id ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-500"}`}
                >
                  <span className={`tabular-nums ${activeId === step.id ? "text-neutral-900" : "text-neutral-400"}`}>{String(index+1).padStart(2,"0")}</span>
                  <span>{step.title}</span>
                </a>
              </li>)}
            </ol>
          </nav>
        </aside>
        <article className="min-w-0">
          {guideSteps.map((step,index) => <GuideStep key={step.id} step={step} number={index+1} />)}
          <section className="border-t border-neutral-200 py-10 sm:py-14" aria-labelledby="guide-questions">
            <h2 id="guide-questions" className="text-2xl font-medium tracking-tight">Nếu chưa thực hiện được</h2>
            <div className="mt-6 space-y-7 text-sm leading-7 text-neutral-600">
              <div><h3 className="font-medium text-neutral-900">Lumipic không đọc được thư mục Drive?</h3><p>Kiểm tra link thư mục, quyền chia sẻ và định dạng JPEG.</p></div>
              <div><h3 className="font-medium text-neutral-900">Khách xem được nhưng không thả tim được?</h3><p>Dùng Link khách chọn ảnh, bật quyền chọn và kiểm tra giới hạn.</p></div>
              <div><h3 className="font-medium text-neutral-900">Lọc ảnh trên máy không tìm thấy file?</h3><p>Kiểm tra định dạng, thư mục nguồn và tên file.</p></div>
            </div>
          </section>
          <RelatedGuides currentPath="/huong-dan/gui-anh-google-drive" />
          <section className="border-t border-neutral-200 py-10">
            <h2 className="text-2xl font-medium tracking-tight">Bắt đầu với album đầu tiên của bạn</h2>
            <Button asChild className="mt-6 rounded-full bg-neutral-900 px-6 text-white shadow-none hover:bg-neutral-700"><a href="/dashboard">Mở Dashboard <ArrowRight className="ml-2 size-4" aria-hidden="true" /></a></Button>
          </section>
        </article>
      </div>
    </main>
    <footer className="border-t border-neutral-200"><div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-6 py-7 text-xs text-neutral-500 sm:px-8"><span>Lumipic © 2026</span><div className="flex gap-5"><a href="/privacy">Quyền riêng tư</a><a href="/terms">Điều khoản</a></div></div></footer>
  </div>;
}
