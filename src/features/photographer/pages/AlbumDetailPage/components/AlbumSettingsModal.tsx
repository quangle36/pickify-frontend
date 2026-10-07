import { useEffect, useRef, useState, FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LockOpen,
  Target,
  Trash2,
} from "lucide-react";
import { errorMessage } from "@/api/errors";
import { useAppStore } from "@/app/stores/app.store";
import { AppModal } from "@/components/ui/app-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  useSetAlbumSelectionLocked,
  useUpdateAlbumPasscode,
  useRevealAlbumPasscode,
  useUpdateAlbum,
  useDeleteAlbum,
} from "@/features/photographer/queries/album.mutations";
import type { Album } from "@/features/photographer/types/album.types";

interface AlbumSettingsModalProps {
  album: Album;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AlbumSettingsModal: FC<AlbumSettingsModalProps> = ({
  album,
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const report = useAppStore((state) => state.report);
  const { toast } = useToast();

  const updateAlbum = useUpdateAlbum();
  const updatePasscode = useUpdateAlbumPasscode();
  const selectionLock = useSetAlbumSelectionLocked();
  const deleteAlbum = useDeleteAlbum();
  const revealPasscode = useRevealAlbumPasscode();

  // State: Selection Limit editing
  const [editingLimit, setEditingLimit] = useState(false);
  const [editLimit, setEditLimit] = useState(
    String(album.selectionLimit ?? album.totalPhotos),
  );

  // State: Passcode editing & revealing
  const [editingPasscode, setEditingPasscode] = useState(false);
  const [newPasscode, setNewPasscode] = useState("");
  const [visiblePasscode, setVisiblePasscode] = useState<string | null>(null);
  const [newPasscodeVisible, setNewPasscodeVisible] = useState(false);
  const revealRequest = useRef(0);

  // Reset states when opening or album changes
  useEffect(() => {
    revealRequest.current++;
    setVisiblePasscode(null);
    setNewPasscodeVisible(false);
    setEditingPasscode(false);
    setNewPasscode("");
    setEditingLimit(false);
    setEditLimit(String(album.selectionLimit ?? album.totalPhotos));
  }, [open, album.id, album.title, album.slug, album.selectionLimit, album.totalPhotos]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      revealRequest.current++;
      setVisiblePasscode(null);
      setNewPasscodeVisible(false);
      revealPasscode.reset();
      setEditingPasscode(false);
      setNewPasscode("");
      setEditingLimit(false);
    }
    onOpenChange(nextOpen);
  };

  // Toggle reveal passcode
  const togglePasscode = async () => {
    if (visiblePasscode !== null) {
      setVisiblePasscode(null);
      return;
    }
    const request = ++revealRequest.current;
    try {
      const result = await revealPasscode.mutateAsync(album.id);
      revealPasscode.reset();
      if (request !== revealRequest.current) return;
      if (result.password === null) {
        toast({
          variant: "dark",
          title:
            "Mật khẩu cũ chưa hỗ trợ hiển thị. Hãy đổi mật khẩu một lần để sử dụng tính năng này.",
        });
      } else {
        setVisiblePasscode(result.password);
      }
    } catch (error) {
      revealPasscode.reset();
      if (request === revealRequest.current) report(error);
    }
  };

  // Save new passcode
  const handleSavePasscode = async () => {
    if (newPasscode.length < 4) {
      toast({
        variant: "destructive",
        title: "Mật khẩu phải có ít nhất 4 ký tự.",
      });
      return;
    }

    try {
      await updatePasscode.mutateAsync({
        albumId: album.id,
        password: newPasscode,
      });
      revealRequest.current++;
      setVisiblePasscode(null);
      setNewPasscodeVisible(false);
      setEditingPasscode(false);
      setNewPasscode("");
      toast({
        variant: "dark",
        title:
          "Đã đổi mật khẩu và thu hồi toàn bộ phiên đăng nhập cũ của khách hàng.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Không thể đổi mật khẩu khách.",
        description: errorMessage(error),
      });
    }
  };

  // Save selection limit
  const handleSaveLimit = async () => {
    const limitNum = Number(editLimit);
    if (limitNum === (album.selectionLimit ?? album.totalPhotos)) return;
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 1500) {
      toast({
        variant: "destructive",
        title: "Số lượng ảnh được chọn phải từ 1 đến 1.500.",
      });
      return;
    }

    if (limitNum < album.selectedPhotosCount) {
      toast({
        variant: "destructive",
        title: `Giới hạn không được thấp hơn ${album.selectedPhotosCount} ảnh khách đã chọn.`,
      });
      return;
    }

    try {
      await updateAlbum.mutateAsync({
        albumId: album.id,
        input: {
          name: album.title,
          slug: album.slug,
          selectionLimit: limitNum,
        },
      });
      setEditingLimit(false);
      toast({
        variant: "dark",
        title: "Đã cập nhật giới hạn số ảnh chọn.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Không thể cập nhật giới hạn ảnh chọn.",
        description: errorMessage(error),
      });
    }
  };

  // Toggle selection locked
  const handleSelectionEditingChange = async (editable: boolean) => {
    try {
      await selectionLock.mutateAsync({
        albumId: album.id,
        locked: !editable,
      });
      toast({
        variant: "dark",
        title: editable
          ? "Đã cho phép khách tiếp tục chọn ảnh."
          : "Đã khóa chỉnh sửa lựa chọn của khách.",
      });
    } catch (error) {
      report(error);
    }
  };

  // Delete album
  const handleDeleteAlbum = async () => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa album "${album.title}"? Thao tác này sẽ xóa vĩnh viễn và không thể hoàn tác.`,
      )
    ) {
      return;
    }

    try {
      await deleteAlbum.mutateAsync(album.id);
      handleOpenChange(false);
      navigate({ to: "/dashboard" });
      toast({
        variant: "dark",
        title: "Đã xóa album.",
      });
    } catch (error) {
      report(error);
    }
  };

  const switchId = `selection-editing-${album.id}`;
  const currentLimit = album.selectionLimit ?? album.totalPhotos;
  const limitUnchanged = Number(editLimit) === currentLimit;

  return (
    <AppModal
      open={open}
      onOpenChange={handleOpenChange}
      onEscapeKeyDown={(event) => {
        if (editingPasscode || editingLimit) {
          event.preventDefault();
          if (editingPasscode && !updatePasscode.isPending) {
            setNewPasscode("");
            setEditingPasscode(false);
            setNewPasscodeVisible(false);
          }
          if (editingLimit && !updateAlbum.isPending) {
            setEditLimit(String(currentLimit));
            setEditingLimit(false);
          }
        }
      }}
      title="Cài đặt album"
      description="Quản lý bảo mật và quyền chọn ảnh."
      contentClassName="max-w-lg"
      bodyClassName="space-y-4"

    >
      {/* Option A: Flat List Container with Hairline Dividers */}
      <section className="rounded-2xl border border-stone-200/90 bg-white shadow-xs divide-y divide-stone-100 overflow-hidden">
        {/* Row 2: Selection Limit */}
        <div className="p-4 transition-colors hover:bg-stone-50/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                <Target className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-semibold text-stone-900">
                  Giới hạn ảnh chọn
                </h3>
                <p className="text-[11px] text-stone-500">
                  Khách đã chọn{" "}
                  <span className="font-semibold text-stone-800">
                    {album.selectedPhotosCount}
                  </span>{" "}
                  / {currentLimit} ảnh tối đa
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {editingLimit ? (
                <Input
                  type="number"
                  inputMode="numeric"
                  min={Math.max(1, album.selectedPhotosCount)}
                  max={1500}
                  step={1}
                  aria-label="Giới hạn ảnh chọn"
                  title="Enter để lưu, Esc để hủy"
                  autoFocus
                  value={editLimit}
                  onFocus={(event) => event.target.select()}
                  onChange={(event) => setEditLimit(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                      event.preventDefault();
                      if (!updateAlbum.isPending) void handleSaveLimit();
                    } else if (event.key === "Escape") {
                      event.preventDefault();
                      event.stopPropagation();
                      if (!updateAlbum.isPending) {
                        setEditLimit(String(currentLimit));
                        setEditingLimit(false);
                      }
                    }
                  }}
                  disabled={updateAlbum.isPending}
                  className="h-8 w-12 rounded-md bg-white px-1 py-0.5 text-center font-mono text-xs font-bold text-stone-700 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              ) : (
                <span className="flex h-8 w-12 items-center justify-center rounded-md bg-stone-100 px-1 py-0.5 font-mono text-xs font-bold text-stone-700">
                  {currentLimit}
                </span>
              )}
              <Button
                type="button"
                variant={editingLimit ? "dark" : "outline"}
                size="sm"
                onClick={() => {
                  if (editingLimit) {
                    void handleSaveLimit();
                  } else {
                    setEditLimit(String(currentLimit));
                    setEditingLimit(true);
                  }
                }}
                disabled={updateAlbum.isPending || (editingLimit && limitUnchanged)}
                className="h-8 w-11 px-0 text-xs font-semibold"
              >
                {editingLimit ? "Lưu" : "Đổi"}
              </Button>
            </div>
          </div>
        </div>

        {/* Row 3: Selection Lock Toggle */}
        <div className="p-4 transition-colors hover:bg-stone-50/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  album.selectionLocked
                    ? "bg-stone-100 text-stone-500"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {album.selectionLocked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <LockOpen className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Label
                  htmlFor={switchId}
                  className="cursor-pointer text-xs font-semibold text-stone-900"
                >
                  Cho phép khách chọn ảnh
                </Label>
                <p className="text-[11px] text-stone-500">
                  {album.selectionLocked
                    ? "Khách chỉ có thể xem các lựa chọn đã lưu."
                    : "Khách có thể thả tim hoặc đổi ảnh trong album."}
                </p>
              </div>
            </div>
            <Switch
              id={switchId}
              checked={!album.selectionLocked}
              onCheckedChange={handleSelectionEditingChange}
              disabled={album.status !== "ready" || selectionLock.isPending}
              aria-label={
                album.selectionLocked
                  ? "Cho phép khách chỉnh sửa lựa chọn"
                  : "Khóa chỉnh sửa lựa chọn của khách"
              }
              className="shrink-0 data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-stone-300"
            />
          </div>
        </div>

        {/* Row 4: Client Passcode */}
        <div className="p-4 transition-colors hover:bg-stone-50/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                <KeyRound className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-semibold text-stone-900">
                  Mật khẩu khách
                </h3>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-stone-500">
                  <span className="shrink-0">Mật khẩu:</span>
                  {editingPasscode ? (
                    <Input
                      type={newPasscodeVisible ? "text" : "password"}
                      autoFocus
                      autoComplete="new-password"
                      aria-label="Mật khẩu mới cho khách"
                      title="Ít nhất 4 ký tự. Enter để lưu, Esc để hủy."
                      minLength={4}
                      maxLength={128}
                      value={newPasscode}
                      onChange={(event) => setNewPasscode(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                          event.preventDefault();
                          if (!updatePasscode.isPending) void handleSavePasscode();
                        } else if (event.key === "Escape") {
                          event.preventDefault();
                          event.stopPropagation();
                          if (!updatePasscode.isPending) {
                            setNewPasscode("");
                            setEditingPasscode(false);
                            setNewPasscodeVisible(false);
                          }
                        }
                      }}
                      disabled={updatePasscode.isPending}
                      className="h-7 w-14 shrink-0 rounded-md bg-white px-1 py-0.5 font-mono text-xs font-bold text-stone-800"
                    />
                  ) : (
                    <span className="flex h-7 w-14 shrink-0 items-center overflow-hidden font-mono font-bold tracking-wider text-stone-800">
                      {visiblePasscode ?? "••••"}
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      if (editingPasscode) {
                        setNewPasscodeVisible((value) => !value);
                      } else {
                        void togglePasscode();
                      }
                    }}
                    disabled={revealPasscode.isPending || updatePasscode.isPending}
                    aria-label={editingPasscode
                      ? (newPasscodeVisible ? "Ẩn mật khẩu mới" : "Hiển thị mật khẩu mới")
                      : (visiblePasscode !== null ? "Ẩn mật khẩu khách" : "Hiển thị mật khẩu khách")}
                    aria-pressed={editingPasscode ? newPasscodeVisible : visiblePasscode !== null}
                    className="h-5 w-5 shrink-0 rounded-full p-0 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                  >
                    {(editingPasscode ? newPasscodeVisible : visiblePasscode !== null) ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant={editingPasscode ? "dark" : "outline"}
              size="sm"
              onClick={() => {
                if (editingPasscode) {
                  void handleSavePasscode();
                } else {
                  revealRequest.current++;
                  setVisiblePasscode(null);
                  setNewPasscode("");
                  setNewPasscodeVisible(false);
                  setEditingPasscode(true);
                }
              }}
              disabled={updatePasscode.isPending || (editingPasscode && newPasscode.length < 4)}
              className="h-8 w-[100px] px-0 text-xs font-semibold shrink-0"
            >
              {editingPasscode ? "Lưu" : "Đổi mật khẩu"}
            </Button>
          </div>
        </div>
      </section>

      {/* Danger Zone: Delete Album */}
      <section className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-rose-200 bg-rose-50/40 p-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <Trash2 className="h-4 w-4 shrink-0 text-rose-500" />
          <span className="truncate text-xs font-medium text-stone-600">
            Xóa album và toàn bộ phiên chọn ảnh
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => void handleDeleteAlbum()}
          disabled={deleteAlbum.isPending}
          className="h-7.5 px-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-100/60 hover:text-rose-700 shrink-0"
        >
          Xóa album
        </Button>
      </section>
    </AppModal>
  );
};

export default AlbumSettingsModal;
