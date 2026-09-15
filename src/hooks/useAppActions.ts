import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useApiData } from "@/lib/apiQueries";
import { errorMessage } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export function useAppActions() {
  const store = useApiData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [driveOpen, setDriveOpen] = useState(false);
  const login = async (destination = "home") => {
    try {
      const auth = await store.authConfig();
      if (!auth.googleLoginEnabled)
        throw new Error(
          "Đăng nhập Google chưa được cấu hình. Cần OAuth client ID và secret riêng cho đăng nhập; import Drive chỉ dùng API key.",
        );
      location.assign(`/api/auth/google/start?destination=${destination}`);
    } catch (error) {
      store.report(error);
    }
  };
  const dashboard = () => {
    void navigate({ to: "/dashboard" });
  };
  const action = async (fn: () => Promise<unknown>, message: string) => {
    try {
      await fn();
      toast({ title: message });
    } catch (e) {
      toast({ variant: "destructive", title: errorMessage(e) });
    }
  };
  const openGuest = (share: string) => {
    location.assign(`/album/${share}`);
  };

  const selectAlbum = (id: string) => {
    void navigate({ to: "/dashboard/album/$albumId", params: { albumId: id } });
  };
  return {
    dashboard,
    openGuest,
    loginHome: () => void login(),
    loginDashboard: () => void login("dashboard"),
    exitGuest: () => location.assign("/"),
    reload: () => location.reload(),
    clearError: store.clearError,
    logout: () =>
      action(async () => {
        await store.logout();
        location.assign("/");
      }, "Đã đăng xuất"),
    selectAlbum,
    retryAlbum: (id: string) =>
      action(
        () => store.retryAlbum(id),
        "Đã yêu cầu nhập lại ảnh chưa hoàn tất",
      ),
    deleteAlbum: (id: string) =>
      action(
        () => store.deleteAlbum(id),
        "Đã chặn truy cập và yêu cầu dọn album",
      ),
    openCreate: () => setCreateOpen(true),
    openDrive: () => setDriveOpen(true),
    createModal: {
      isOpen: createOpen,
      onClose: () => setCreateOpen(false),
      onSubmit: async (data: Parameters<typeof store.createAlbum>[0]) => {
        const result = await store.createAlbum(data);
        if (result.success && result.album) {
          selectAlbum(result.album.id);
          toast({ title: "Đã tạo album, đang chờ nhập ảnh" });
        }
        return result;
      },
    },
    driveModal: { isOpen: driveOpen, onClose: () => setDriveOpen(false) },
  };
}
