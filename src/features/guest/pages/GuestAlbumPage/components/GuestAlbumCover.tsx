import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Album } from "@/features/photographer/types/album.types";

interface GuestAlbumCoverProps {
  album: Album;
  fallbackUrl?: string;
  readOnly: boolean;
}

export function GuestAlbumCover({ album, fallbackUrl, readOnly }: GuestAlbumCoverProps) {
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const coverUrl = album.coverUrl && !failedUrls[album.coverUrl]
    ? album.coverUrl
    : fallbackUrl && !failedUrls[fallbackUrl] ? fallbackUrl : undefined;

  return (
    <section aria-labelledby="guest-album-title" className="relative isolate mb-5 flex min-h-[420px] items-end overflow-hidden rounded-xl bg-stone-800 md:mb-6 md:min-h-[480px]">
      {coverUrl && (
        <img
          src={coverUrl}
          alt={`Ảnh bìa album ${album.title}`}
          onError={() => setFailedUrls((previous) => ({ ...previous, [coverUrl]: true }))}
          loading="eager"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_35%] md:object-[center_40%]"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_25%,rgba(0,0,0,.35)_55%,rgba(0,0,0,.88)_100%)]" />
      <div className="min-w-0 max-w-xl p-6 text-white md:p-8">
        <p className="text-xs text-stone-200">ALBUM CỦA BẠN</p>
        <h1 id="guest-album-title" className="my-2 break-words text-2xl font-semibold leading-snug md:text-3xl">{album.title}</h1>
        <p className="mb-5 text-sm text-stone-200">
          {album.totalPhotos} ảnh
          {!readOnly && album.selectionLimit !== null && ` · Chọn tối đa ${album.selectionLimit} ảnh`}
        </p>
        <Button asChild variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
          <a href="#guest-gallery">{album.selectionLocked && !readOnly ? "Xem lại album" : "Xem bộ ảnh"}<ChevronRight className="h-5 w-5" /></a>
        </Button>
        <p className="mt-4 text-xs text-stone-200">
          {readOnly ? "Chế độ chỉ xem" : album.selectionLocked
            ? `${album.selectedPhotosCount} ảnh đã chọn · Lựa chọn đã khóa`
            : "Lựa chọn của bạn được lưu tự động"}
        </p>
      </div>
    </section>
  );
}
