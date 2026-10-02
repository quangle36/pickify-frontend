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
      report(error);
    }
  };

  // Save selection limit
  const handleSaveLimit = async () => {
    const limitNum = Number(editLimit);
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
          slug: album.slug ?? album.shareId,
          selectionLimit: limitNum,
        },
      });
      setEditingLimit(false);
      toast({
        variant: "dark",
        title: "Đã cập nhật giới hạn số ảnh chọn.",
      });
    } catch (error) {
      report(error);
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

  return (
    <AppModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Cài đặt album"
      description="Quản lý bảo mật và quyền chọn ảnh."
      contentClassName="max-w-lg"
      bodyClassName="space-y-4"
      footer={
        <div className="flex w-full justify-end">
          <Button
            type="button"
            variant="dark"
            onClick={() => handleOpenChange(false)}
            className="h-8.5 px-4 rounded-xl text-xs font-semibold"
          >
            Xong
          </Button>
        </div>
      }
    >
      {/* Option A: Flat List Container with Hairline Dividers */}
      <section className="rounded-2xl border border-stone-200/90 bg-white shadow-xs divide-y divide-stone-100 overflow-hidden">
        {/* Row 2: Selection Limit */}
        <div className="p-4 transition-colors hover:bg-stone-50/40">
          {!editingLimit ? (
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
                <span className="rounded-md bg-stone-100 px-2 py-0.5 font-mono text-xs font-bold text-stone-700">
                  {currentLimit}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingLimit(true)}
                  className="h-7.5 px-2.5 text-xs font-semibold"
                >
                  Đổi
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-0.5">
              <div>
                <Label className="text-[11px] font-semibold text-stone-700">
                  Số lượng ảnh khách được chọn
                </Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    type="number"
                    min={album.selectedPhotosCount}
                    max={1500}
                    value={editLimit}
                    onChange={(e) => setEditLimit(e.target.value)}
                    disabled={updateAlbum.isPending}
                    className="h-8 w-28 font-mono text-xs font-bold"
                  />
                  <span className="text-xs text-stone-500">ảnh</span>
                </div>
                <p className="mt-1 text-[11px] text-stone-400">
                  Tối thiểu {album.selectedPhotosCount} ảnh (đã chọn), tối đa 1.500 ảnh.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditLimit(String(album.selectionLimit ?? album.totalPhotos));
                    setEditingLimit(false);
                  }}
                  disabled={updateAlbum.isPending}
                  className="h-7.5 px-3 text-xs"
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  variant="dark"
                  size="sm"
                  onClick={() => void handleSaveLimit()}
                  disabled={updateAlbum.isPending}
                  className="h-7.5 px-3 text-xs font-semibold"
                >
                  Lưu
                </Button>
              </div>
            </div>
          )}
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
          {!editingPasscode ? (
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
                    <span>Mật khẩu:</span>
                    <span className="font-mono font-bold tracking-wider text-stone-800">
                      {visiblePasscode ?? "••••"}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => void togglePasscode()}
                      disabled={revealPasscode.isPending || updatePasscode.isPending}
                      aria-label={
                        visiblePasscode !== null
                          ? "Ẩn mật khẩu khách"
                          : "Hiển thị mật khẩu khách"
                      }
                      aria-pressed={visiblePasscode !== null}
                      className="h-5 w-5 rounded-full p-0 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                    >
                      {visiblePasscode !== null ? (
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
                variant="outline"
                size="sm"
                onClick={() => {
                  revealRequest.current++;
                  setVisiblePasscode(null);
                  setEditingPasscode(true);
                }}
                className="h-7.5 px-2.5 text-xs font-semibold shrink-0"
              >
                Đổi mật khẩu
              </Button>
            </div>
          ) : (
            <div className="space-y-3 pt-0.5">
              <div>
                <Label className="text-[11px] font-semibold text-stone-700">
                  Mật khẩu mới cho khách
                </Label>
                <div className="relative mt-1">
                  <Input
                    type={newPasscodeVisible ? "text" : "password"}
                    value={newPasscode}
                    onChange={(event) => setNewPasscode(event.target.value)}
                    placeholder="Nhập mật khẩu mới (ít nhất 4 ký tự)"
                    disabled={updatePasscode.isPending}
                    className="h-8 font-mono text-xs pr-8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setNewPasscodeVisible((val) => !val)}
                    aria-label={
                      newPasscodeVisible ? "Ẩn mật khẩu mới" : "Hiển thị mật khẩu mới"
                    }
                    className="absolute right-1 top-1 h-6 w-6 p-0 text-stone-400 hover:text-stone-700"
                  >
                    {newPasscodeVisible ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <p className="mt-1 text-[11px] text-stone-400">
                  Đổi mật khẩu sẽ tự động thu hồi toàn bộ phiên đăng nhập cũ của khách hàng.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setNewPasscode("");
                    setEditingPasscode(false);
                    setNewPasscodeVisible(false);
                  }}
                  disabled={updatePasscode.isPending}
                  className="h-7.5 px-3 text-xs"
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  variant="dark"
                  size="sm"
                  onClick={() => void handleSavePasscode()}
                  disabled={updatePasscode.isPending || newPasscode.length < 4}
                  className="h-7.5 px-3 text-xs font-semibold"
                >
                  Lưu
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 p-3.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Label htmlFor={`share-preview-${album.id}`}>Hiển thị tên và ảnh bìa khi chia sẻ</Label>
            <p className="mt-1 text-[11px] text-stone-500">
              Messenger và Zalo có thể lưu tên và ảnh đầu tiên của album để xem trước.
              Tắt để dùng ảnh Pickify và tiêu đề trung tính. Preview đã gửi có thể vẫn được lưu.
            </p>
          </div>
          <Switch
            id={`share-preview-${album.id}`}
            checked={album.sharePreviewEnabled ?? false}
            disabled={updateAlbum.isPending}
            onCheckedChange={async (enabled) => {
              try {
                await updateAlbum.mutateAsync({
                  albumId: album.id,
                  input: {
                    name: album.title,
                    slug: album.slug ?? "",
                    selectionLimit: album.selectionLimit ?? 50,
                    sharePreviewEnabled: enabled,
                  },
                });
                toast({ variant: "dark", title: "Đã cập nhật xem trước link chia sẻ." });
              } catch (error) { report(error); }
            }}
          />
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
