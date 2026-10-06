import type { GuideStepData } from "./guide";

export function GuideStep({ step, number }: { step: GuideStepData; number: number }) {
  return <section id={step.id} className="scroll-mt-28 border-t border-neutral-200 py-10 sm:py-14" aria-labelledby={`${step.id}-title`}>
    <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">Bước {String(number).padStart(2, "0")} · {step.audience}</p>
    <h2 id={`${step.id}-title`} className="text-2xl font-medium leading-snug tracking-tight sm:text-3xl">{step.title}</h2>
    <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-neutral-700 sm:text-base">
      {step.instructions.map(instruction => <li key={instruction} className="pl-1">{instruction}</li>)}
    </ol>
    {step.note && <p className="mt-6 border-l-2 border-neutral-900 pl-4 text-sm leading-6 text-neutral-600">{step.note}</p>}
    {step.id === "chuan-bi-drive" && <a href="https://support.google.com/drive/answer/7166529?hl=vi" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm underline underline-offset-4">Xem hướng dẫn chia sẻ thư mục của Google ↗</a>}
    {step.imageUrl && <figure className="mt-8">
      <a href={step.imageUrl} target="_blank" rel="noopener noreferrer" aria-label={`Xem ảnh lớn: ${step.title}`} className="block overflow-hidden rounded-2xl border border-neutral-200 bg-stone-50 p-3 sm:p-5">
        <img src={step.imageUrl} alt={step.alt} width={step.width} height={step.height} loading="lazy" decoding="async" className={`mx-auto h-auto w-full rounded-lg ${step.narrow ? "max-w-md" : ""}`} />
      </a>
    </figure>}
  </section>;
}
