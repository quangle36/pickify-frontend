import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppModal } from "@/components/ui/app-modal";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  albumFormSchema,
  type AlbumFormInput,
  type AlbumFormOutput,
} from "@/features/photographer/schemas/album-form.schema";
import type {
  Album,
  AlbumSourceInput,
  PhotoSortMode,
  PhotographerProfile,
} from "@/features/photographer/types/album.types";
import { StorageUsage } from "@/features/photographer/components/StorageUsage";
import { AlbumFormField } from "./AlbumFormField";
import { AlbumSourceFields } from "./AlbumSourceFields";

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  album?: Album;
  profile?: PhotographerProfile;
  onSubmit: (data: {
    name: string;
    slug: string;
    sources: AlbumSourceInput[];
    sortMode: PhotoSortMode;
    passcode: string;
    selectionLimit: number;
  }) => Promise<{ success: boolean; error?: string }>;
}

export function CreateAlbumModal({
  isOpen,
  onClose,
  onSubmit,
  album,
  profile,
}: CreateAlbumModalProps) {
  const storageBlocked = !album && !!profile && (
    profile.storageReconciliationRequired ||
    (profile.storageBytes !== undefined && profile.storageLimitBytes !== undefined &&
      profile.storageBytes >= profile.storageLimitBytes)
  );
  const [customization, setCustomization] = useState("");
  const defaults = useMemo<AlbumFormInput>(
    () => ({
      name: album?.title ?? "",
      slug: album?.slug ?? "",
      sources: album?.sources?.length
        ? album.sources.map(({ label, folderUrl }) => ({ label, folderUrl }))
        : [{ label: "", folderUrl: album?.folderUrl ?? "" }],
      multipleCameras: (album?.sources?.length ?? 0) > 1,
      sortMode: album?.sortMode ?? "capture_time",
      passcode: "",
      selectionLimit: album
        ? String(album.selectionLimit ?? album.totalPhotos)
        : "",
    }),
    [album],
  );
  const schema = useMemo(
    () =>
      albumFormSchema({
        editing: !!album,
        selectedPhotosCount: album?.selectedPhotosCount,
      }),
    [album],
  );
  const form = useForm<AlbumFormInput, unknown, AlbumFormOutput>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const {
    reset,
    formState: { isSubmitting, errors },
    handleSubmit,
    setError,
  } = form;

  useEffect(() => {
    if (isOpen) {
      reset(defaults);
      setCustomization("");
    }
  }, [isOpen, defaults, reset]);

  const submit = async (data: AlbumFormOutput) => {
    // Camera names are internal for a single source, never prefilled in the form.
    const sources = data.multipleCameras
      ? data.sources
      : data.sources
          .slice(0, 1)
          .map((source) => ({ ...source, label: source.label || "Máy 1" }));
    try {
      const result = await onSubmit({
        name: data.name,
        slug: data.slug,
        sources,
        sortMode: data.sortMode,
        passcode: data.passcode,
        selectionLimit: data.selectionLimit,
      });
      if (result.success) onClose();
      else
        setError("root.server", {
          message: result.error || "Không thể lưu album. Vui lòng thử lại.",
        });
    } catch {
      setError("root.server", {
        message: "Không thể lưu album. Vui lòng thử lại.",
      });
    }
  };

  return (
    <AppModal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      preventClose={isSubmitting}
      title={album ? "Chỉnh sửa album" : "Tạo album mới"}
      description={
        album
          ? "Cập nhật thông tin và thiết lập chọn ảnh."
          : undefined
      }
      contentClassName="w-[calc(100%-2rem)] max-w-lg rounded-2xl border-stone-200 sm:rounded-2xl [&>button]:flex [&>button]:h-8 [&>button]:w-8 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-lg [&>button>svg]:h-4 [&>button>svg]:w-4"
      headerClassName="border-stone-200 px-5 py-5 sm:px-6 sm:py-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-[1.35] [&_p]:text-xs [&_p]:leading-relaxed"
      bodyClassName="bg-white px-5 py-5 sm:px-6 sm:py-6"
      footerClassName="flex-row justify-end gap-2 space-x-0 border-stone-200 bg-white px-5 py-4 sm:px-6 sm:space-x-0"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="min-h-11 flex-1 md:min-h-10 sm:flex-none"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="create-album-form"
            isLoading={isSubmitting}
            disabled={!!storageBlocked}
            className="min-h-11 flex-1 md:min-h-10 sm:flex-none"
          >
            {album ? "Lưu thay đổi" : "Tạo album"}
          </Button>
        </>
      }
    >
      <FormProvider {...form}>
        <form
          id="create-album-form"
          noValidate
          onSubmit={handleSubmit(submit, (validationErrors) => {
            if (validationErrors.slug || validationErrors.sortMode)
              setCustomization("customization");
          })}
          className="space-y-6"
        >
          {!album && profile && <div className="space-y-3">
            <StorageUsage profile={profile} />
          </div>}
          {errors.root?.server && (
            <Alert
              variant="destructive"
              className="rounded-xl border-0 bg-red-50 px-3 py-3 text-red-700"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs leading-relaxed">
                {errors.root.server.message}
              </AlertDescription>
            </Alert>
          )}
          <fieldset className="space-y-6" disabled={isSubmitting}>
            <AlbumFormField
              name="name"
              label="Tên album"
              required
              maxLength={120}
              autoFocus
            />
            <AlbumSourceFields disabled={isSubmitting || !!album} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AlbumFormField
                name="passcode"
                label={album ? "Mật khẩu mới" : "Mật khẩu khách"}
                type={album ? "password" : "text"}
                required={!album}
                maxLength={128}
                autoComplete="new-password"
                hint={album ? "Để trống để giữ mật khẩu hiện tại." : undefined}
              />
              <AlbumFormField
                name="selectionLimit"
                label="Số ảnh chọn tối đa"
                required
                type="number"
                min={1}
                max={1500}
                step={1}
                inputMode="numeric"
              />
            </div>
            <Accordion
              type="single"
              collapsible
              value={customization}
              onValueChange={setCustomization}
              className="border-t border-stone-200"
            >
              <AccordionItem value="customization" className="border-b-0">
                <AccordionTrigger className="min-h-11 text-sm font-normal text-stone-600 hover:no-underline md:min-h-10">
                  Tùy chỉnh đường dẫn & sắp xếp
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-0">
                  <AlbumFormField
                    name="slug"
                    label="Đường dẫn tùy chỉnh"
                    prefix="/album/"
                    maxLength={80}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    hint="Không bắt buộc."
                  />
                  <div className="space-y-2">
                    <Label
                      htmlFor="album-sort-mode"
                      className="text-xs font-medium"
                    >
                      Sắp xếp ảnh
                    </Label>
                    <Controller
                      control={form.control}
                      name="sortMode"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isSubmitting || !!album}
                        >
                          <SelectTrigger
                            id="album-sort-mode"
                            ref={field.ref}
                            onBlur={field.onBlur}
                            className="h-11 rounded-xl bg-white text-base md:h-10 md:text-sm"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="capture_time">
                              Thời gian chụp
                            </SelectItem>
                            <SelectItem value="source">
                              Theo từng máy · tên file
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <p className="text-xs leading-relaxed text-stone-500">
                      Ảnh thiếu giờ chụp nằm cuối album. Có thể đồng bộ giờ các
                      máy sau khi nhập.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </fieldset>
        </form>
      </FormProvider>
    </AppModal>
  );
}

export default CreateAlbumModal;
