import axios from "axios";

export const apiMessages: Record<string, string> = {
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
    public requestId?: string,
  ) {
    super(apiMessages[code] ?? `Không thể hoàn tất: ${code}`);
    this.name = "ApiError";
  }
}

interface ErrorPayload {
  error?: { code?: string; requestId?: string };
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError<ErrorPayload>(error)) {
    const status = error.response?.status ?? 0;
    const code = error.response?.data?.error?.code ?? "NETWORK_ERROR";
    const requestId =
      error.response?.data?.error?.requestId ??
      (error.response?.headers?.["x-request-id"] as string | undefined);
    return new ApiError(status, code, requestId);
  }
  return new ApiError(0, "NETWORK_ERROR");
}

export const errorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Không thể kết nối máy chủ. Vui lòng thử lại.";
