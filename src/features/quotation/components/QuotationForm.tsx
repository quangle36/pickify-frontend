import { useFieldArray, useFormContext } from "react-hook-form";
import { Calendar, Gift, Plus, Sparkles, UserCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { Quotation } from "../types/quotation.types";
import { createDay } from "../utils/quotation";
import { QuotationField } from "./QuotationField";
import { QuotationLogoField } from "./QuotationLogoField";
import { QuotationDayEditor } from "./QuotationDayEditor";

export function QuotationForm({
  sections,
  onSectionsChange,
}: {
  sections: string[];
  onSectionsChange: (sections: string[]) => void;
}) {
  const { control, formState } = useFormContext<Quotation>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "days",
    keyName: "formKey",
  });
  return (
    <Accordion
      type="multiple"
      value={sections}
      onValueChange={onSectionsChange}
      className="quotation-form"
    >
      <AccordionItem value="brand">
        <AccordionTrigger>
          <span>
            <Sparkles />
            Thương hiệu & Studio
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <QuotationField
            name="brand.name"
            label="Tên studio / Nhiếp ảnh gia"
            required
          />
          <QuotationField name="brand.tagline" label="Tagline / Phương châm" />
          <QuotationLogoField />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="customer">
        <AccordionTrigger>
          <span>
            <UserCheck />
            Thông tin khách hàng
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <QuotationField name="customerName" label="Tên khách hàng" required />
          <div className="grid grid-cols-2 gap-3">
            <QuotationField
              name="issuedOn"
              label="Ngày lập"
              type="date"
              required
            />
            <QuotationField name="code" label="Mã báo giá" />
          </div>
          <QuotationField name="title" label="Tiêu đề báo giá" required />
          <QuotationField name="intro" label="Dòng giới thiệu" />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="schedule">
        <AccordionTrigger>
          <span>
            <Calendar />
            Lịch trình & Gói chụp
            <span className="quotation-day-count">{fields.length} ngày</span>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {fields.map((day, index) => (
              <QuotationDayEditor
                key={day.formKey}
                index={index}
                canRemove={fields.length > 1}
                onRemove={() => remove(index)}
              />
            ))}
          </div>
          {formState.errors.days?.root?.message && (
            <p role="alert" className="mt-3 text-xs text-rose-600">
              {formState.errors.days.root.message}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full border-dashed"
            onClick={() => append(createDay())}
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm ngày chụp / dịch vụ mới
          </Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="terms">
        <AccordionTrigger>
          <span>
            <Gift />
            Quà tặng & Điều khoản
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <QuotationField name="gift" label="Quà tặng ưu đãi" multiline />
          <QuotationField
            name="terms"
            label="Quy định thanh toán & bàn giao"
            multiline
          />
          <QuotationField name="closing" label="Lời kết" multiline />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
