export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  emailVerified: boolean;
  canCreateAlbums: boolean;
  albumCount: number;
  storageBytes: number;
  storageLimitBytes: number;
  createdAt: string;
}
export interface AdminUsersPage {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  budget: {
    storageBytes: number;
    storageLimitBytes: number;
    userStorageLimitBytes: number;
    maxAlbumsPerUser: number;
    importsPerDay: number;
    unaccountedAlbums: number;
  };
}
