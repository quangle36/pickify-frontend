import { useFormContext, type FieldPath } from "react-hook-form";
import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AlbumFormInput } from "@/features/photographer/schemas/album-form.schema";

interface AlbumFormFieldProps extends Omit<InputProps, "name"> {
  name: FieldPath<AlbumFormInput>;
  label: string;
  required?: boolean;
  hint?: string;
  prefix?: string;
}

export function AlbumFormField({
  name,
  label,
  required,
  hint,
  prefix,
  className,
  ...props
}: AlbumFormFieldProps) {
  const { register, getFieldState, formState } =
    useFormContext<AlbumFormInput>();
  const { error } = getFieldState(name, formState);
  const id = `album-${name.replace(/\./g, "-")}`;
  const input = (
    <Input
      id={id}
      {...register(name)}
      {...props}
      aria-invalid={!!error}
      aria-required={required}
      aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      className={cn(
        "h-11 rounded-xl border-stone-200 bg-white text-base text-stone-900 md:h-10 md:text-sm",
        error &&
          "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/10",
        prefix &&
          "h-full min-w-0 flex-1 rounded-none border-0 pl-1 focus-visible:ring-0",
        className,
      )}
    />
  );
  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={id} className="text-xs font-medium text-stone-900">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-rose-700">
            *
          </span>
        )}
      </Label>
      {prefix ? (
        <div
          className={cn(
            "flex h-11 items-center overflow-hidden rounded-xl border border-stone-200 bg-white focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-200/50 md:h-10",
            error &&
              "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/10",
          )}
        >
          <span className="shrink-0 pl-3 text-xs text-stone-500">{prefix}</span>
          {input}
        </div>
      ) : (
        input
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs leading-relaxed text-stone-500">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs leading-relaxed text-red-600"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}
