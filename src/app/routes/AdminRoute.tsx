import { lazy, Suspense } from 'react';
import { GlobalLoadingIndicator } from '../components/GlobalLoadingIndicator';
const AdminUsersPage = lazy(() => import('@/features/admin/pages/AdminUsersPage/AdminUsersPage'));
export function AdminRoute() {
  return <Suspense fallback={<GlobalLoadingIndicator />}><AdminUsersPage /></Suspense>;
}
