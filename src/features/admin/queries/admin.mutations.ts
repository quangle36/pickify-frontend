import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from './admin.key';
import { adminService } from '../services/admin.service';
import { authKeys } from '@/features/auth/queries/auth.key';
export function useSetAlbumPermission() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, allowed }: { id: string; allowed: boolean }) => adminService.setAlbumPermission(id, allowed),
    onSuccess: async () => { await Promise.all([client.invalidateQueries({ queryKey: adminKeys.all }), client.invalidateQueries({ queryKey: authKeys.owner })]); },
  });
}
