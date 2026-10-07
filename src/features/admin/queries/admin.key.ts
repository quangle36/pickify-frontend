export const adminKeys = {
  all: ['admin', 'users'] as const,
  users: (search: string, page: number) => ['admin', 'users', search, page] as const,
};
