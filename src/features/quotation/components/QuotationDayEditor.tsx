import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Quotation } from "../types/quotation.types";
import { createService, dayAmount, formatMoney } from "../utils/quotation";
import { QuotationField } from "./QuotationField";

export function QuotationDayEditor({
  index,
  onRemove,
  canRemove,
}: {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const { control } = useFormContext<Quotation>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `days.${index}.services`,
    keyName: "formKey",
  });
  const day = useWatch({ control, name: `days.${index}` });
  return (
    <div className="quotation-day-editor">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">
          Ngày {String(index + 1).padStart(2, "0")}
        </h3>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={!canRemove}
          onClick={onRemove}
          aria-label={`Xóa ngày ${index + 1}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Xóa ngày
        </Button>
      </div>
      <QuotationField
        name={`days.${index}.date`}
        label="Ngày thực hiện"
        type="date"
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <QuotationField
          name={`days.${index}.startTime`}
          label="Giờ bắt đầu"
          type="time"
          required
        />
        <QuotationField
          name={`days.${index}.endTime`}
          label="Giờ kết thúc"
          type="time"
          required
        />
      </div>
      <div className="space-y-4">
        {fields.map((row, serviceIndex) => (
          <div key={row.formKey} className="border-t border-stone-200 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs text-stone-500">
                Dịch vụ {serviceIndex + 1}
              </p>
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                disabled={fields.length === 1}
                aria-label={`Xóa dịch vụ ${serviceIndex + 1} ngày ${index + 1}`}
                onClick={() => remove(serviceIndex)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <QuotationField
              name={`days.${index}.services.${serviceIndex}.name`}
              label="Tên dịch vụ"
              required
            />
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3">
              <QuotationField
                name={`days.${index}.services.${serviceIndex}.quantity`}
                label="Số lượng"
                type="number"
                required
              />
              <QuotationField
                name={`days.${index}.services.${serviceIndex}.unitPrice`}
                label="Đơn giá (đ)"
                type="number"
                required
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(createService())}
        >
          <Plus className="h-3.5 w-3.5" />
          Thêm dịch vụ
        </Button>
        <p className="text-xs text-stone-600">
          Tổng ngày:{" "}
          <strong className="font-medium text-stone-900">
            {formatMoney(dayAmount(day))} đ
          </strong>
        </p>
      </div>
    </div>
  );
}
