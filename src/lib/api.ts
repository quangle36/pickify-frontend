import type { Album, Photo, PhotographerProfile } from "@/types";
export const messages: Record<string, string> = {
  DRIVE_NOT_PUBLIC:
    "Không thể đọc link Drive public. Đặt folder và ảnh thành “Bất kỳ ai có đường liên kết — Người xem”, rồi thử lại.",
  DRIVE_API_KEY_NOT_CONFIGURED:
    "Máy chủ chưa được cấu hình API key cho Google Drive.",
  DRIVE_API_KEY_INVALID:
    "API key Google Drive không hợp lệ hoặc Drive API chưa được bật.",

  UNAUTHENTICATED: "Vui lòng đăng nhập Google.",
  INVALID_CREDENTIALS: "Mật khẩu không đúng hoặc phiên đã hết hạn.",
  ORIGIN_DENIED: "Nguồn truy cập không hợp lệ.",
  DRIVE_DISCONNECTED: "Hãy kết nối Google Drive.",
  DRIVE_REAUTH_REQUIRED: "Hãy kết nối lại Google Drive.",
  ACTIVE_ALBUM_LIMIT: "Bạn đã đạt giới hạn 3 album.",
  IMPORT_ALREADY_RUNNING: "Một album đang được nhập. Vui lòng chờ hoàn tất.",
  ALBUM_UNAVAILABLE: "Album chưa sẵn sàng, đã hết hạn hoặc đã bị xóa.",
  NOT_FOUND: "Không tìm thấy album hoặc ảnh.",
  RATE_LIMITED: "Bạn thử quá nhiều lần. Vui lòng chờ một phút.",
  INVALID_INPUT: "Thông tin không hợp lệ.",
  INVALID_JPEG: "Có ảnh JPEG hỏng. Sửa ảnh trên Drive rồi thử lại.",
  LIMIT_EXCEEDED: "Folder vượt giới hạn 1.500 JPEG.",
  FILE_TOO_LARGE: "Có ảnh lớn hơn 50 MB.",
  NO_JPEG: "Folder không có ảnh JPEG.",
  DRIVE_PERMISSION_DENIED: "Không có quyền đọc folder hoặc ảnh trên Drive.",
};
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(messages[code] ?? `Không thể hoàn tất: ${code}`);
  }
}
export const errorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Không thể kết nối máy chủ. Vui lòng thử lại.";
let csrf = "";
export function setCsrf(token: string) {
  csrf = token;
}
export async function api<T>(
  path: string,
  method = "GET",
  body?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method,
    signal,
    credentials: "include",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(csrf ? { "X-CSRF-Token": csrf } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(response.status, data.error?.code ?? "NETWORK_ERROR");
  }
  return response.json();
}
export const emptyProfile: PhotographerProfile = {
  id: "",
  name: "",
  email: "",
  avatarUrl: "",
  activeAlbumsCount: 0,
  maxAlbumsLimit: 3,
  maxPhotosLimit: 1500,
  albumLifespanDays: 30,
};
export type Page = {
  photos: Photo[];
  nextCursor: string | null;
  album: Partial<Album> & { id: string };
};
