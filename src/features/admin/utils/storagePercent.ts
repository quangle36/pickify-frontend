export function storagePercent(bytes: number, limit: number) {
  return limit > 0 ? Math.min(100, Math.max(0, bytes / limit * 100)) : 0;
}
