import { z } from "zod";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const logo = z
  .string()
  .max(3_000_000)
  .refine(
    (value) =>
      value === "" ||
      /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value),
    "Logo không hợp lệ.",
  );
// Drafts preserve unfinished input, including blank numbers and dates.
export const quotationDraftSchema = z.object({
  schemaVersion: z.literal(1),
  themeId: z.literal("minimal"),
  brand: z.object({ name: z.string(), tagline: z.string(), logo }),
  intro: z.string(),
  title: z.string(),
  customerName: z.string(),
  code: z.string().optional(),
  issuedOn: z.string(),
  days: z
    .array(
      z.object({
        id: z.string().min(1),
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        services: z
          .array(
            z.object({
              id: z.string().min(1),
              name: z.string(),
              quantity: z.string(),
              unitPrice: z.string(),
            }),
          )
          .min(1),
      }),
    )
    .min(1),
  terms: z.string(),
  gift: z.string(),
  closing: z.string(),
});

const required = z.string().trim().min(1, "Vui lòng nhập thông tin.");
const date = required.refine(
  (value) =>
    datePattern.test(value) &&
    Number(value.slice(0, 4)) >= 1000 &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value,
  "Ngày không hợp lệ.",
);
const integer = (minimum: number) =>
  z
    .string()
    .refine(
      (value) =>
        /^\d+$/.test(value) &&
        Number.isSafeInteger(Number(value)) &&
        Number(value) >= minimum,
      minimum === 1
        ? "Số lượng phải là số nguyên dương."
        : "Đơn giá phải là số nguyên không âm.",
    );
export const quotationSchema = quotationDraftSchema
  .extend({
    brand: quotationDraftSchema.shape.brand.extend({ name: required }),
    title: required,
    customerName: required,
    issuedOn: date,
    days: z
      .array(
        quotationDraftSchema.shape.days.element
          .extend({
            date,
            startTime: required.refine(
              (value) => timePattern.test(value),
              "Giờ không hợp lệ.",
            ),
            endTime: required.refine(
              (value) => timePattern.test(value),
              "Giờ không hợp lệ.",
            ),
            services: z
              .array(
                quotationDraftSchema.shape.days.element.shape.services.element.extend(
                  {
                    name: required,
                    quantity: integer(1),
                    unitPrice: integer(0),
                  },
                ),
              )
              .min(1),
          })
          .superRefine((day, ctx) => {
            if (
              timePattern.test(day.startTime) &&
              timePattern.test(day.endTime) &&
              day.endTime <= day.startTime
            ) {
              ctx.addIssue({
                code: "custom",
                path: ["endTime"],
                message: "Giờ kết thúc phải sau giờ bắt đầu.",
              });
            }
            day.services.forEach((service, index) => {
              if (
                !Number.isSafeInteger(
                  Number(service.quantity) * Number(service.unitPrice),
                )
              )
                ctx.addIssue({
                  code: "custom",
                  path: ["services", index, "unitPrice"],
                  message: "Thành tiền vượt giới hạn cho phép.",
                });
            });
          }),
      )
      .min(1),
  })
  .superRefine((quote, ctx) => {
    const total = quote.days.reduce(
      (sum, day) =>
        sum +
        day.services.reduce(
          (subtotal, row) =>
            subtotal + Number(row.quantity) * Number(row.unitPrice),
          0,
        ),
      0,
    );
    if (!Number.isSafeInteger(total))
      ctx.addIssue({
        code: "custom",
        path: ["days"],
        message: "Tổng báo giá vượt giới hạn cho phép.",
      });
  });
