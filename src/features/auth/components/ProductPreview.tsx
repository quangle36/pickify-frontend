import { Check, Heart, Images, ShieldCheck } from "lucide-react";

export function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[550px]" aria-hidden="true">
      <div className="absolute -left-16 top-12 h-36 w-36 rounded-full bg-amber-300/30 blur-3xl" />
      <div className="absolute -right-12 bottom-10 h-44 w-44 rounded-full bg-rose-300/30 blur-3xl" />

      <div className="relative rotate-[-2deg] rounded-[2rem] border border-white/70 bg-white/80 p-3 shadow-[0_36px_90px_-32px_rgba(53,39,33,0.38)] backdrop-blur-xl">
        <div className="rounded-[1.45rem] border border-stone-200/80 bg-stone-50 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-stone-900 text-white">
                <Heart className="h-4 w-4 fill-white" />
              </span>
              <div>
                <p className="text-[11px] font-extrabold text-stone-900">Mai & Nam</p>
                <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                  Wedding selection
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[8px] font-bold text-emerald-700">
              42 ảnh đã chọn
            </span>
          </div>

          <div className="grid grid-cols-12 grid-rows-2 gap-2">
            <div className="relative col-span-7 row-span-2 min-h-56 overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#d7c6b8_0%,#f3e7dc_45%,#b98972_100%)]">
              <div className="absolute inset-x-10 bottom-0 h-4/5 rounded-t-[48%] bg-[#fff8ee]/80" />
              <div className="absolute bottom-0 left-[38%] h-2/3 w-[24%] rounded-t-[45%] bg-[#6d4c42]/80" />
              <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-rose-500 shadow-lg">
                <Heart className="h-4 w-4 fill-rose-500" />
              </span>
            </div>
            <div className="relative col-span-5 min-h-28 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#818b76,#d8d0bc)]">
              <div className="absolute -bottom-7 left-5 h-24 w-14 rounded-full bg-[#f8eee2]/85" />
              <div className="absolute bottom-0 right-4 h-20 w-12 rounded-t-full bg-[#54483f]/75" />
              <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-rose-500 shadow">
                <Heart className="h-3.5 w-3.5 fill-rose-500" />
              </span>
            </div>
            <div className="relative col-span-5 min-h-28 overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#e7c5b2,#9d6b60)]">
              <div className="absolute -bottom-5 left-1/3 h-24 w-16 rounded-t-full bg-[#f4e7d8]/80" />
              <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-rose-500 shadow">
                <Heart className="h-3.5 w-3.5 fill-rose-500" />
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3 py-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-rose-50 text-rose-500">
              <Images className="h-3.5 w-3.5" />
            </span>
            <div className="flex-1">
              <div className="h-1.5 w-20 rounded-full bg-stone-800" />
              <div className="mt-1.5 h-1 w-32 rounded-full bg-stone-200" />
            </div>
            <Check className="h-4 w-4 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-7 -left-5 flex items-center gap-2 rounded-2xl border border-white bg-white/95 px-3.5 py-3 shadow-xl sm:-left-10">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[10px] font-extrabold text-stone-900">Lựa chọn đã được lưu</p>
          <p className="text-[8px] text-stone-400">Tự động, an toàn và tức thì</p>
        </div>
      </div>
    </div>
  );
}
