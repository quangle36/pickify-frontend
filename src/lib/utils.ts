import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getDaysRemaining(expiresAt: string): number {
  try {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  } catch {
    return 30;
  }
}

export function extractDriveFolderId(url: string): string | null {
  if (!url) return null;
  // Match https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ or similar
  const matchFolder = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (matchFolder && matchFolder[1]) return matchFolder[1];

  // Match https://drive.google.com/open?id=1aBcDeFgHiJkLmNoPqRsTuVwXyZ
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];

  // If the user directly pasted a clean ID
  if (/^[a-zA-Z0-9_-]{25,}$/.test(url.trim())) {
    return url.trim();
  }

  return null;
}
