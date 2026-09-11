import { Album, Photo } from '../types/index.ts';

/**
 * Xuất danh sách ảnh đã được khách thả tim ra file CSV.
 * Sử dụng UTF-8 BOM (\uFEFF) để Excel hiển thị tiếng Việt chuẩn không bị lỗi font.
 */
export function exportSelectedPhotosToCsv(album: Album, photos: Photo[]): void {
  const selectedPhotos = photos.filter((p) => p.isSelected);

  if (selectedPhotos.length === 0) {
    alert('Chưa có ảnh nào được khách thả tim trong album này.');
    return;
  }

  // Headers theo tài liệu đặc tả plan.md: tên file, Drive file ID, link file gốc
  const headers = ['STT', 'Tên File', 'Google Drive File ID', 'Link File Gốc', 'Ngày Chọn'];

  const rows = selectedPhotos.map((photo, index) => [
    (index + 1).toString(),
    `"${photo.name.replace(/"/g, '""')}"`,
    `"${photo.driveFileId}"`,
    `"${photo.originalUrl}"`,
    `"${photo.selectedAt ? new Date(photo.selectedAt).toLocaleString('vi-VN') : 'Đã chọn'}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

  // Thêm UTF-8 Byte Order Mark (BOM)
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  // Format filename: [TenAlbum]_DanhSachChon_[YYYYMMDD].csv
  const cleanTitle = album.title.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  link.setAttribute('href', url);
  link.setAttribute('download', `${cleanTitle}_DanhSachChon_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
