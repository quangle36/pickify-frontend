import { apiRequest } from '@/api/apiClient';
import type { AdminUsersPage } from '../types/admin.types';
export const adminService = {
  setStorageLimit: (id: string, storageLimitBytes: number) =>
    apiRequest<{ id: string; storageLimitBytes: number }>({ url: `/admin/users/${id}/storage-limit`, method: 'PUT', data: { storageLimitBytes } }),
  users: (search: string, page: number, signal?: AbortSignal) =>
    apiRequest<AdminUsersPage>({ url: '/admin/users', params: { search, page, limit: 20 }, signal }),
  setAlbumPermission: (id: string, canCreateAlbums: boolean) =>
    apiRequest<{ id: string; canCreateAlbums: boolean }>({ url: `/admin/users/${id}/album-permission`, method: 'PUT', data: { canCreateAlbums } }),
};
