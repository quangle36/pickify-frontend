import { guides } from "../guides/catalog";

export function RelatedGuides({ currentPath }: { currentPath?: string }) {
  return <section className="border-t border-neutral-200 py-10" aria-label="Hướng dẫn Lumipic">
    <h2 className="text-2xl font-medium tracking-tight">Hướng dẫn Lumipic</h2>
    <ul className="mt-6 grid gap-6 sm:grid-cols-2">
      {guides.filter(guide => guide.path !== currentPath).map(guide => <li key={guide.path}>
        <a href={guide.path} className="text-base font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900">{guide.title}</a>
        <p className="mt-2 text-sm leading-6 text-neutral-600">{guide.description}</p>
      </li>)}
    </ul>
  </section>;
}
