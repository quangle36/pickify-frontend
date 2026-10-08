import { Plus, X } from "lucide-react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MAX_ALBUM_SOURCES } from "@/features/photographer/schemas/album.schema";
import type { AlbumFormInput } from "@/features/photographer/schemas/album-form.schema";
import { AlbumFormField } from "./AlbumFormField";

export function AlbumSourceFields({ disabled }: { disabled: boolean }) {
  const { control, clearErrors } = useFormContext<AlbumFormInput>();
  const multipleCameras = useWatch({ control, name: "multipleCameras" });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sources",
  });
  return (
    <fieldset className="space-y-4" disabled={disabled}>
      {multipleCameras ? (
        <div className="space-y-3">
          {fields.map((source, index) => (
            <div
              key={source.id}
              className="space-y-3 rounded-xl border border-stone-200 bg-stone-50 p-4"
            >
              <div className="flex min-h-8 items-center justify-between gap-2">
                <span className="text-xs font-medium text-stone-600">
                  Máy ảnh {index + 1}
                </span>
                {index > 0 && !disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Bỏ máy ảnh ${index + 1}`}
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <AlbumFormField
                name={`sources.${index}.label`}
                label="Tên máy ảnh"
                required
                maxLength={60}
              />
              <AlbumFormField
                name={`sources.${index}.folderUrl`}
                label="Link thư mục Drive"
                required
                type="url"
                maxLength={2048}
              />
            </div>
          ))}
        </div>
      ) : (
        <AlbumFormField
          name="sources.0.folderUrl"
          label="Link thư mục Google Drive"
          required
          type="url"
          maxLength={2048}
        />
      )}
      <div className="flex min-h-10 items-center gap-3">
        <Controller
          control={control}
          name="multipleCameras"
          render={({ field }) => (
            <Checkbox
              id="album-multiple-cameras"
              className="relative before:absolute before:-inset-3 before:content-['']"
              checked={field.value}
              disabled={disabled}
              onCheckedChange={(checked) => {
                field.onChange(checked === true);
                clearErrors("sources");
              }}
              onBlur={field.onBlur}
              ref={field.ref}
            />
          )}
        />
        <Label
          htmlFor="album-multiple-cameras"
          className="cursor-pointer py-3 text-sm font-normal leading-relaxed text-stone-900"
        >
          Chụp bằng nhiều máy ảnh
        </Label>
      </div>
      {multipleCameras && !disabled && (
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            disabled={fields.length >= MAX_ALBUM_SOURCES}
            onClick={() => append({ label: "", folderUrl: "" })}
            className="min-h-11 md:min-h-10"
          >
            <Plus className="h-4 w-4" />
            Thêm máy ảnh
          </Button>
          <p className="text-xs leading-relaxed text-stone-500">
            Tối đa 10 máy · mỗi máy một thư mục riêng.
          </p>
        </div>
      )}
    </fieldset>
  );
}
