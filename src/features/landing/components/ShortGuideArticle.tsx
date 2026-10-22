import { LumipicLogo } from "@/components/ui/lumipic-logo";
import { Button } from "@/components/ui/button";
import { RelatedGuides } from "./RelatedGuides";

type Section = { title: string; steps: readonly string[] };
interface Props { path: string; title: string; intro: string; sections: readonly Section[]; image: { name: string; alt: string; width: number; height: number }; }

export function ShortGuideArticle({ path, title, intro, sections, image }: Props) {
  return <div className="min-h-screen bg-white text-neutral-900">
    <header className="border-b border-neutral-200"><div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 sm:px-8">
      <a href="/" aria-label="Lumipic — về trang chủ"><LumipicLogo /></a>
      <Button asChild className="rounded-full"><a href="/dashboard">Tạo album</a></Button>
    </div></header>
    <main className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
      <article>
        <a href="/huong-dan/gui-anh-google-drive" className="text-sm text-neutral-600 underline underline-offset-4">Hướng dẫn gửi ảnh từ Google Drive</a>
        <h1 className="mt-8 text-4xl font-medium leading-tight tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-neutral-600">{intro}</p>
        {sections.map((section, index) => <section key={section.title} className="mt-10 border-t border-neutral-200 pt-8">
          <h2 className="text-2xl font-medium tracking-tight">{String(index + 1).padStart(2, "0")} · {section.title}</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-neutral-700 leading-7">{section.steps.map(step => <li key={step}>{step}</li>)}</ol>
        </section>)}
        <img src={`/images/guides/gui-anh-google-drive/${image.name}`} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" className="mx-auto my-10 h-auto max-w-full rounded-xl border border-neutral-200" />
      </article>
      <RelatedGuides currentPath={path} />
      <Button asChild className="rounded-full"><a href="/dashboard">Mở Dashboard</a></Button>
    </main>
    <footer className="border-t border-neutral-200"><div className="mx-auto flex max-w-5xl flex-wrap gap-6 px-6 py-6 text-sm text-neutral-600 sm:px-8"><span>Lumipic © 2026</span><a href="/privacy">Quyền riêng tư</a><a href="/terms">Điều khoản</a></div></footer>
  </div>;
}
