import type { ReactNode } from "react";

interface LegalPageProps {
  title: string;
  children: ReactNode;
}

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-700">
      <a className="text-sm font-medium text-indigo-600 hover:underline" href="/">
        ← Pickify
      </a>
      <h1 className="mt-6 text-3xl font-bold text-slate-950">{title}</h1>
      <div className="mt-8 space-y-5 leading-7">{children}</div>
    </main>
  );
}
