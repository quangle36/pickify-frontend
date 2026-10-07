import { useQuery } from '@tanstack/react-query';
import { adminKeys } from './admin.key';
import { adminService } from '../services/admin.service';
export function useAdminUsers(search: string, page: number, enabled: boolean) {
  return useQuery({ queryKey: adminKeys.users(search, page), queryFn: ({ signal }) => adminService.users(search, page, signal), enabled });
}
