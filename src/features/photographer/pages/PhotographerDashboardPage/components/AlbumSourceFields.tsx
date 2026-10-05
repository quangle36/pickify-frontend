import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_ALBUM_SOURCES } from "@/features/photographer/schemas/album.schema";
import type { AlbumSourceInput } from "@/features/photographer/types/album.types";

export function AlbumSourceFields({
  sources,
  onChange,
  disabled,
}: {
  sources: AlbumSourceInput[];
  onChange: (sources: AlbumSourceInput[]) => void;
  disabled: boolean;
}) {
  const update = (
    index: number,
    field: keyof AlbumSourceInput,
    value: string,
  ) =>
    onChange(
      sources.map((source, current) =>
        current === index ? { ...source, [field]: value } : source,
      ),
    );
  return (
    <fieldset className="space-y-3" disabled={disabled}>
      <legend className="text-sm font-medium text-stone-900">
        Máy ảnh & thư mục Drive
      </legend>
      <p className="text-xs text-stone-500">
        Mỗi link là ảnh từ một máy trong cùng buổi chụp. Tổng tối đa 1.500 ảnh.
      </p>
      {sources.map((source, index) => (
        <div
          key={index}
          className="space-y-2 rounded-xl border border-stone-200 bg-stone-50 p-3"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-stone-500">
              Máy ảnh {index + 1}
            </span>
            {sources.length > 1 && !disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Bỏ máy ảnh ${index + 1}`}
                onClick={() =>
                  onChange(sources.filter((_, current) => current !== index))
                }
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Label htmlFor={`camera-label-${index}`} className="block text-xs">
            Tên máy ảnh
          </Label>
          <Input
            id={`camera-label-${index}`}
            value={source.label}
            maxLength={60}
            placeholder="VD: Sony A7 IV, Canon R6"
            onChange={(event) => update(index, "label", event.target.value)}
            className="h-11 rounded-xl bg-white text-base sm:h-10 sm:text-sm"
          />
          <Label htmlFor={`camera-drive-${index}`} className="block text-xs">
            Link thư mục Drive
          </Label>
          <Input
            id={`camera-drive-${index}`}
            type="url"
            value={source.folderUrl}
            maxLength={2048}
            placeholder="https://drive.google.com/drive/folders/..."
            onChange={(event) => update(index, "folderUrl", event.target.value)}
            className="h-11 rounded-xl bg-white text-base sm:h-10 sm:text-sm"
          />
        </div>
      ))}
      {!disabled && (
        <Button
          type="button"
          variant="outline"
          disabled={sources.length >= MAX_ALBUM_SOURCES}
          onClick={() => {
            let number = sources.length + 1;
            while (sources.some((source) => source.label === `Máy ${number}`))
              number++;
            onChange([...sources, { label: `Máy ${number}`, folderUrl: "" }]);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm máy ảnh
        </Button>
      )}
    </fieldset>
  );
}
