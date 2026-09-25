import { FolderPlus, Plus } from "lucide-react";

interface CreateAlbumCardProps {
  onCreate: () => void;
}

export function CreateAlbumCard({ onCreate }: CreateAlbumCardProps) {
  return (
    <button
      type="button"
      onClick={onCreate}
      className="group relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-stone-300 bg-white px-8 py-10 text-center shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-50/40 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 md:aspect-auto"
      aria-label="Tạo album mới"
    >
      <span className="pointer-events-none absolute inset-x-10 top-0 h-28 rounded-full bg-brand-100/60 blur-3xl transition-colors group-hover:bg-brand-200/70" />
      <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-stone-900 text-white shadow-lg shadow-stone-900/15 transition-transform duration-200 group-hover:scale-105 group-hover:bg-brand-600">
        <FolderPlus className="h-7 w-7" />
        <span className="absolute -bottom-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-brand-500 text-white">
          <Plus className="h-3.5 w-3.5 stroke-[3]" />
        </span>
      </span>

      <span className="relative mt-6 text-lg font-extrabold tracking-tight text-stone-900">
        Tạo album mới
      </span>
    </button>
  );
}
