import axios from "axios";

export const apiMessages: Record<string, string> = {
  ADMIN_REQUIRED: 'Trang này chỉ dành cho quản trị viên.',
  ADMIN_PERMISSION_PROTECTED: 'Không thể thu hồi quyền của quản trị viên tại đây.',
  USER_NOT_FOUND: 'Không tìm thấy tài khoản đã đăng ký.',
  EMAIL_VERIFICATION_REQUIRED: 'Hãy đăng nhập bằng Google với cùng email để xác minh tài khoản.',
  ACCOUNT_LINK_REQUIRED: 'Email này có nhiều tài khoản liên kết. Vui lòng liên hệ quản trị viên.',
  ALBUM_CREATION_NOT_ALLOWED: 'Tài khoản chưa được quản trị viên cấp quyền tạo album.',
  ALBUM_LIMIT_REACHED: 'Bạn đã đạt giới hạn album. Hãy xoá album không còn dùng và chờ dọn xong.',
  USER_STORAGE_LIMIT_REACHED: 'Tài khoản đã đạt hạn mức dung lượng. Hãy xoá album không còn dùng.',
  GLOBAL_STORAGE_LIMIT_REACHED: 'Hệ thống tạm dừng import vì đã đạt hạn mức dung lượng.',
  STORAGE_RECONCILIATION_REQUIRED: 'Hệ thống đang đối soát dung lượng. Vui lòng thử lại sau.',
  DAILY_IMPORT_LIMIT_REACHED: 'Bạn đã đạt giới hạn tạo hoặc thử lại album trong ngày.',
  DISPLAY_FILE_TOO_LARGE: 'Ảnh sau xử lý vượt giới hạn dung lượng cho phép.',
  IMPORT_RETENTION_EXPIRED: 'Album import đã hết hạn lưu trữ. Hãy xoá album này và tạo album mới.',
  SELECTION_FILTER_NOT_ALLOWED: 'Chế độ chỉ xem không hỗ trợ lọc ảnh đã chọn.',
  SOURCE_REQUIRED: "Hãy chọn máy ảnh cần lọc file.",
  CAPTURE_TIME_MISSING: "Ảnh này thiếu giờ gốc. Hãy đặt giờ riêng cho ảnh thay vì bù giờ cả máy.",
  ALBUM_NOT_READY_FOR_TIME_EDIT: "Hãy chờ import hoàn tất trước khi chỉnh giờ hoặc thứ tự ảnh.",

  ALBUM_PASSWORD_REVEAL_UNAVAILABLE:
    "Không thể hiển thị mật khẩu này. Hãy đổi mật khẩu album để sử dụng tính năng hiển thị.",
  EMAIL_INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng.",
  EMAIL_ALREADY_REGISTERED:
    "Email này đã có tài khoản. Vui lòng đăng nhập bằng phương thức đã đăng ký.",
  BETA_INVITE_REQUIRED: "Email này chưa được cấp quyền tạo tài khoản.",
  NETWORK_ERROR: "Không thể kết nối máy chủ. Vui lòng thử lại.",
  INTERNAL_ERROR: "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.",
  DRIVE_NOT_PUBLIC:
    "Không thể đọc link Drive public. Đặt folder và ảnh thành “Bất kỳ ai có đường liên kết — Người xem”, rồi thử lại.",
  DRIVE_API_KEY_NOT_CONFIGURED:
    "Máy chủ chưa được cấu hình API key cho Google Drive.",
  DRIVE_API_KEY_INVALID:
    "API key Google Drive không hợp lệ hoặc Drive API chưa được bật.",
  UNAUTHENTICATED: "Vui lòng đăng nhập.",
  INVALID_CREDENTIALS: "Mật khẩu không đúng hoặc phiên đã hết hạn.",
  ORIGIN_DENIED: "Nguồn truy cập không hợp lệ.",
  DRIVE_DISCONNECTED: "Hãy kết nối Google Drive.",
  DRIVE_REAUTH_REQUIRED: "Hãy kết nối lại Google Drive.",
  IMPORT_ALREADY_RUNNING: "Một album đang được nhập. Vui lòng chờ hoàn tất.",
  SLUG_ALREADY_EXISTS:
    "Đường dẫn album này đã được sử dụng. Hãy chọn slug khác.",
  SELECTION_LIMIT_REACHED: "Album đã đạt đủ số lượng ảnh được phép chọn.",
  SELECTION_LIMIT_BELOW_SELECTED: "Giới hạn không được thấp hơn số ảnh khách đã chọn.",
  ALBUM_SELECTION_LOCKED:
    "Album đã khóa lựa chọn. Liên hệ nhiếp ảnh gia nếu bạn cần thay đổi.",
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
