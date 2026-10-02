import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Lock, LockOpen } from "lucide-react";
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
} from "@/features/photographer/queries/album.mutations";
import type { Album } from "@/features/photographer/types/album.types";

interface AlbumSettingsModalProps {
  album: Album;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AlbumSettingsModal({
  album,
  open,
  onOpenChange,
}: AlbumSettingsModalProps) {
  const report = useAppStore((state) => state.report);
  const { toast } = useToast();
  const updatePasscode = useUpdateAlbumPasscode();
  const selectionLock = useSetAlbumSelectionLocked();
  const [editingPasscode, setEditingPasscode] = useState(false);
  const [newPasscode, setNewPasscode] = useState("");
  const [visiblePasscode, setVisiblePasscode] = useState<string | null>(null);
  const [newPasscodeVisible, setNewPasscodeVisible] = useState(false);
  const revealPasscode = useRevealAlbumPasscode();
  const revealRequest = useRef(0);

  useEffect(() => {
    revealRequest.current++;
    setVisiblePasscode(null);
    setNewPasscodeVisible(false);
  }, [open, album.id]);

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

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      revealRequest.current++;
      setVisiblePasscode(null);
      setNewPasscodeVisible(false);
      revealPasscode.reset();
      setEditingPasscode(false);
      setNewPasscode("");
    }
    onOpenChange(nextOpen);
  };

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

  const handleSelectionEditingChange = async (editable: boolean) => {
    try {
      await selectionLock.mutateAsync({
        albumId: album.id,
        locked: !editable,
      });
      toast({
        variant: "dark",
        title: editable
          ? "Đã cho phép khách tiếp tục chỉnh sửa lựa chọn."
          : "Đã khóa chỉnh sửa lựa chọn của khách.",
      });
    } catch (error) {
      report(error);
    }
  };

  const switchId = `selection-editing-${album.id}`;

  return (
    <AppModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Cài đặt album"
      description="Quản lý mật khẩu truy cập và quyền chỉnh sửa lựa chọn của khách."
      contentClassName="max-w-lg"
      bodyClassName="space-y-4"
    >
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-stone-600">
            <Lock className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-extrabold text-stone-900">Mật khẩu khách</h3>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-stone-500">
              <p className="min-w-0 break-all">
                Mật khẩu hiện tại:{" "}
                <span className="font-mono">{visiblePasscode ?? "••••"}</span>
              </p>
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
                className="shrink-0 rounded-full hover:bg-stone-100 hover:text-stone-900"
              >
                {visiblePasscode !== null ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {!editingPasscode && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                revealRequest.current++;
                setVisiblePasscode(null);
                setEditingPasscode(true);
              }}
            >
              Đổi mật khẩu
            </Button>
          )}
        </div>

        {editingPasscode && (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Input
                type={newPasscodeVisible ? "text" : "password"}
                value={newPasscode}
                onChange={(event) => setNewPasscode(event.target.value)}
                placeholder="Nhập mật khẩu mới"
                aria-label="Mật khẩu khách mới"
                disabled={updatePasscode.isPending}
                className="font-mono pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setNewPasscodeVisible((value) => !value)}
                aria-label={
                  newPasscodeVisible
                    ? "Ẩn mật khẩu mới"
                    : "Hiển thị mật khẩu mới"
                }
                aria-pressed={newPasscodeVisible}
                className="absolute right-1.5 top-1.5 hover:bg-stone-100 hover:text-stone-900"
              >
                {newPasscodeVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="dark"
                onClick={() => void handleSavePasscode()}
                disabled={updatePasscode.isPending}
                className="flex-1 sm:flex-none"
              >
                Lưu
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setNewPasscode("");
                  setEditingPasscode(false);
                  setNewPasscodeVisible(false);
                }}
                disabled={updatePasscode.isPending}
                className="flex-1 sm:flex-none"
              >
                Hủy
              </Button>
            </div>
          </div>
        )}
      </section>

      <section
        className={`rounded-2xl border p-4 shadow-xs transition-colors ${
          album.selectionLocked
            ? "border-stone-200 bg-white"
            : "border-emerald-200 bg-emerald-50/60"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
              album.selectionLocked
                ? "bg-stone-100 text-stone-500"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {album.selectionLocked ? (
              <Lock className="h-5 w-5" />
            ) : (
              <LockOpen className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Label
              htmlFor={switchId}
              className="cursor-pointer font-extrabold text-stone-900"
            >
              Cho phép chỉnh sửa
            </Label>
            <p className="mt-0.5 text-xs leading-relaxed text-stone-500">
              {album.selectionLocked
                ? "Khách chỉ có thể xem các lựa chọn đã lưu."
                : "Khách có thể thả tim hoặc bỏ tim ảnh trong album."}
            </p>
          </div>
          <Switch
            id={switchId}
            checked={!album.selectionLocked}
            onCheckedChange={handleSelectionEditingChange}
            disabled={album.status !== "ready" || selectionLock.isPending}
            aria-label={
              album.selectionLocked
                ? "Cho phép khách chỉnh sửa lựa chọn"
                : "Ngừng cho phép khách chỉnh sửa lựa chọn"
            }
            className="shrink-0 data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-stone-300"
          />
        </div>
      </section>
    </AppModal>
  );
}
