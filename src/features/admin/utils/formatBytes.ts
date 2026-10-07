export function formatBytes(bytes: number) {
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} KiB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} MiB`;
  return `${(bytes / 1024 ** 3).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} GiB`;
}
