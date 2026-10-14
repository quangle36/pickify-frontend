import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserPermissionRow } from '../src/features/admin/pages/AdminUsersPage/components/UserPermissionRow';
import type { AdminUser } from '../src/features/admin/types/admin.types';

const GB = 1024 ** 3;
const user: AdminUser = {
  id: 'user', email: 'user@example.com', name: 'Test user', role: 'user',
  emailVerified: true, canCreateAlbums: true, albumCount: 1,
  storageBytes: GB, createdAt: '',
};

function render(account: AdminUser) {
  return renderToStaticMarkup(
    <QueryClientProvider client={new QueryClient()}>
      <UserPermissionRow user={account} storageLimit={2 * GB} pending={false} onChange={() => {}} />
    </QueryClientProvider>,
  );
}

describe('admin storage quota API compatibility', () => {
  it('uses the shared quota when the API omits the per-user limit', () => {
    const html = render(user);
    expect(html).toContain('value="2"');
    expect(html).toContain('translateX(-50%)');
    expect(html).not.toContain('NaN');
    expect(html).not.toContain('Sửa hạn mức');
  });

  it('uses a supplied per-user limit and keeps editing available', () => {
    const html = render({ ...user, storageLimitBytes: 4 * GB });
    expect(html).toContain('value="4"');
    expect(html).toContain('translateX(-75%)');
    expect(html).toContain('Sửa hạn mức');
  });

  it('preserves an explicit zero quota rather than using the shared limit', () => {
    const html = render({ ...user, storageLimitBytes: 0 });
    expect(html).toContain('value="0"');
    expect(html).not.toContain('NaN');
  });
});
