import { useId } from "react";
import { useFormContext, type FieldPath } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Quotation } from "../types/quotation.types";

export function QuotationField({
  name,
  label,
  type = "text",
  multiline = false,
  required = false,
}: {
  name: FieldPath<Quotation>;
  label: string;
  type?: "text" | "date" | "time" | "number";
  multiline?: boolean;
  required?: boolean;
}) {
  const id = useId();
  const { register, getFieldState, formState } = useFormContext<Quotation>();
  const error = getFieldState(name, formState).error;
  const props = {
    ...register(name),
    id,
    "aria-invalid": !!error,
    "aria-describedby": `${id}-error`,
    "aria-required": required,
    className: `bg-white text-base md:text-sm ${error ? "border-rose-500" : "border-stone-300"}`,
  };
  return (
    <div className="quotation-field">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-rose-600">*</span>}
      </Label>
      {multiline ? (
        <Textarea {...props} rows={3} />
      ) : (
        <Input
          {...props}
          type={type}
          min={
            type === "number" ? (name.endsWith("quantity") ? 1 : 0) : undefined
          }
          step={type === "number" ? 1 : undefined}
        />
      )}
      <p id={`${id}-error`} className="min-h-4 text-xs text-rose-600">
        {error?.message}
      </p>
    </div>
  );
}
