import { useId, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Quotation } from "../types/quotation.types";
import { readLogo } from "../utils/logo";

export function QuotationLogoField() {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const request = useRef(0);
  const { control, setValue } = useFormContext<Quotation>();
  const logo = useWatch({ control, name: "brand.logo" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className="space-y-3">
      <Label htmlFor={id}>Logo studio</Label>
      <div className="flex flex-wrap items-center gap-3">
        {logo && (
          <img
            className="h-14 w-14 rounded-lg border border-stone-200 bg-stone-50 object-contain p-1"
            src={logo}
            alt="Logo đã chọn"
          />
        )}
        <Input
          id={id}
          ref={input}
          type="file"
          className="hidden"
          tabIndex={-1}
          accept="image/png,image/jpeg,image/webp"
          aria-describedby={`${id}-help`}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            const current = ++request.current;
            setLoading(true);
            setError("");
            try {
              const data = await readLogo(file);
              if (current === request.current)
                setValue("brand.logo", data, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
            } catch (cause) {
              if (current === request.current)
                setError(
                  cause instanceof Error
                    ? cause.message
                    : "Không đọc được logo.",
                );
            } finally {
              if (current === request.current) setLoading(false);
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          isLoading={loading}
          onClick={() => input.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {logo ? "Thay logo" : "Tải logo"}
        </Button>
        {logo && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              ++request.current;
              setLoading(false);
              setError("");
              setValue("brand.logo", "", { shouldDirty: true });
            }}
          >
            <X className="h-4 w-4" />
            Xóa logo
          </Button>
        )}
      </div>
      <p id={`${id}-help`} className="text-xs text-stone-500">
        PNG, JPEG hoặc WebP · tối đa 2 MB
      </p>
      {error && (
        <p role="alert" className="text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
