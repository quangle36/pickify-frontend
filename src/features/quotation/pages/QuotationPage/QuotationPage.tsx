import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  FormProvider,
  useForm,
  useWatch,
  type FieldPath,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PhotographerProfile } from "@/features/photographer/types/album.types";
import { quotationSchema } from "../../schemas/quotation.schema";
import type { Quotation } from "../../types/quotation.types";
import {
  loadQuotation,
  useQuotationDraft,
} from "../../hooks/useQuotationDraft";
import { QuotationForm } from "../../components/QuotationForm";
import { QuotationPreview } from "../../components/QuotationPreview";
import { quotationThemes } from "../../components/themes";
import { exportQuotationImage } from "../../utils/exportImage";
import "./quotation.css";

export default function QuotationPage({
  profile,
}: {
  profile: PhotographerProfile;
}) {
  const [initial] = useState(() => loadQuotation(profile.id, profile.name));
  const form = useForm<Quotation>({
    defaultValues: initial.quote,
    resolver: zodResolver(quotationSchema),
    mode: "onTouched",
    shouldFocusError: false,
  });
  const quote = useWatch({ control: form.control }) as Quotation;
  const status = useQuotationDraft(form, profile.id, initial.error);
  const [tab, setTab] = useState("edit");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [snapshot, setSnapshot] = useState<Quotation | null>(null);
  const exportNode = useRef<HTMLDivElement>(null);
  const [sections, setSections] = useState([
    "brand",
    "customer",
    "schedule",
    "terms",
  ]);
  const Theme = quotationThemes[quote.themeId].render;
  const onExport = form.handleSubmit(
    async (data) => {
      if (exporting) return;
      setExportError("");
      setExporting(true);
      const frozen = structuredClone(data);
      try {
        flushSync(() => setSnapshot(frozen));
        if (!exportNode.current)
          throw new Error("Không thể tạo ảnh. Vui lòng thử lại.");
        await exportQuotationImage(exportNode.current, frozen);
      } catch (error) {
        setExportError(
          error instanceof Error
            ? error.message
            : "Không thể xuất ảnh. Vui lòng thử lại.",
        );
      } finally {
        setExporting(false);
        setSnapshot(null);
      }
    },
    () => {
      setExportError("Kiểm tra các ô được đánh dấu trước khi xuất ảnh.");
      setTab("edit");
      setSections(["brand", "customer", "schedule", "terms"]);
      const result = quotationSchema.safeParse(form.getValues());
      if (!result.success) {
        const path = result.error.issues[0]?.path.join(
          ".",
        ) as FieldPath<Quotation>;
        window.setTimeout(() => {
          if (path && path !== "days") form.setFocus(path);
        }, 220);
      }
    },
  );
  return (
    <>
      <FormProvider {...form}>
        <form className="quotation-page" onSubmit={onExport} noValidate>
          <header className="quotation-toolbar">
            <div className="quotation-heading">
              <Button type="button" variant="ghost" size="icon-sm" asChild>
                <Link to="/dashboard" aria-label="Quay lại album">
                  <ArrowLeft />
                </Link>
              </Button>
              <span className="quotation-breadcrumb-divider" aria-hidden="true">
                /
              </span>
              <h1>
                Tạo báo giá
                <span className="quotation-heading-description">
                  {" "}
                  · Soạn thông tin & xuất ảnh gửi khách
                </span>
              </h1>
              <span
                className={`quotation-status ${status}`}
                role="status"
                aria-live="polite"
                title="Nháp chỉ được lưu trên trình duyệt này"
              >
                {status === "saving"
                  ? "Đang lưu…"
                  : status === "saved"
                    ? "Đã lưu nháp"
                    : "Lưu nháp lỗi"}
              </span>
            </div>
            <div className="quotation-actions">
              <div className="quotation-theme-picker">
                <Label htmlFor="quotation-theme">Theme:</Label>
                <Select
                  value={quote.themeId}
                  onValueChange={(value) =>
                    form.setValue("themeId", value as Quotation["themeId"], {
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger id="quotation-theme" className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="quotation-font">
                    {Object.entries(quotationThemes).map(([id, theme]) => (
                      <SelectItem key={id} value={id}>
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                variant="brand"
                size="sm"
                isLoading={exporting}
                disabled={exporting}
              >
                <Download />
                {exporting ? (
                  "Đang xuất ảnh"
                ) : (
                  <>
                    <span className="quotation-export-desktop">
                      Xuất ảnh PNG gửi khách
                    </span>
                    <span className="quotation-export-mobile">Xuất PNG</span>
                  </>
                )}
              </Button>
            </div>
          </header>
          {status === "error" && (
            <p className="quotation-export-error" role="alert">
              Không thể đọc hoặc lưu nháp. Bạn vẫn có thể soạn và xuất ảnh.
            </p>
          )}
          {exportError && (
            <p className="quotation-export-error" role="alert">
              {exportError}
            </p>
          )}
          <Tabs className="quotation-tabs" value={tab} onValueChange={setTab}>
            <TabsList className="quotation-mobile-tabs">
              <TabsTrigger className="min-h-9 text-stone-600" value="edit">
                Nhập thông tin
              </TabsTrigger>
              <TabsTrigger className="min-h-9 text-stone-600" value="preview">
                Xem trước
              </TabsTrigger>
            </TabsList>
            <div className="quotation-workspace">
              <TabsContent
                value="edit"
                forceMount
                className="quotation-editor-panel"
              >
                <QuotationForm
                  sections={sections}
                  onSectionsChange={setSections}
                />
              </TabsContent>
              <TabsContent
                value="preview"
                forceMount
                className="quotation-preview-panel"
              >
                <QuotationPreview quote={quote} />
              </TabsContent>
            </div>
          </Tabs>
        </form>
      </FormProvider>
      {snapshot && (
        <div className="quotation-export-container" aria-hidden="true">
          <div ref={exportNode} style={{ width: 800 }}>
            <Theme quote={snapshot} />
          </div>
        </div>
      )}
    </>
  );
}
