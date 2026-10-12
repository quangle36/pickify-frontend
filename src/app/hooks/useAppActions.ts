import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { errorMessage } from "@/api/errors";
import { useToast } from "@/components/ui/use-toast";
import {
  createAlbumResult,
  useCreateAlbum,
  useDeleteAlbum,
  useRetryAlbum,
  type CreateAlbumFormInput,
} from "@/features/photographer/queries/album.mutations";
import { useLogoutMutation } from "@/features/auth/queries/auth.mutations";
import { useAppStore } from "../stores/app.store";

export function useAppActions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createAlbum = useCreateAlbum();
  const retryAlbum = useRetryAlbum();
  const deleteAlbumMutation = useDeleteAlbum();
  const logout = useLogoutMutation();
  const clearError = useAppStore((state) => state.clearError);
  const [createOpen, setCreateOpen] = useState(false);
  const [driveOpen, setDriveOpen] = useState(false);
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
  const deleteAlbum = async (id: string) => {
    try {
      await deleteAlbumMutation.mutateAsync(id);
      toast({ title: "Đã chặn truy cập và yêu cầu dọn album" });
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Không thể xóa album",
        description: `Album đã được khôi phục. ${errorMessage(error)}`,
      });
      return false;
    }
  };
  return {
    dashboard,
    openGuest,
    loginHome: () => void navigate({ to: "/dashboard/sign-in" }),
    loginDashboard: () => void navigate({ to: "/dashboard/sign-in" }),
    exitGuest: () => location.assign("/"),
    reload: () => location.reload(),
    clearError,
    logout: () =>
      action(async () => {
        await logout.mutateAsync();
        location.assign("/");
      }, "Đã đăng xuất"),
    selectAlbum,
    retryAlbum: (id: string) =>
      action(
        () => retryAlbum.mutateAsync(id),
        "Đã yêu cầu nhập lại ảnh chưa hoàn tất",
      ),
    deleteAlbum,
    openCreate: () => setCreateOpen(true),
    openDrive: () => setDriveOpen(true),
    createModal: {
      isOpen: createOpen,
      onClose: () => setCreateOpen(false),
      onSubmit: async (data: CreateAlbumFormInput) => {
        const result = await createAlbumResult(createAlbum.mutateAsync, data);
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
