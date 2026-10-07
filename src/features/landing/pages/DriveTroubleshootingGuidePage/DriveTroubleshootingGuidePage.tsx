import { ShortGuideArticle } from "../../components/ShortGuideArticle";

const guide = {
  "path": "/huong-dan/loi-google-drive",
  "title": "Sửa lỗi nhập ảnh từ Google Drive vào Lumipic",
  "intro": "Kiểm tra ba mục dưới đây khi album thiếu ảnh hoặc không đọc được thư mục Drive.",
  "sections": [
    {
      "title": "Kiểm tra link và quyền xem",
      "steps": [
        "Dùng link thư mục Drive, không dùng link của một ảnh riêng lẻ.",
        "Drive → Chia sẻ → Bất kỳ ai có đường liên kết → Người xem.",
        "Thử mở link ở cửa sổ ẩn danh để kiểm tra quyền truy cập."
      ]
    },
    {
      "title": "Kiểm tra ảnh và trạng thái",
      "steps": [
        "Dùng ảnh JPEG làm ảnh xem trước, giữ nguyên tên file để lọc ảnh gốc.",
        "Đợi Drive tải lên xong và Lumipic nhập ảnh xong rồi kiểm tra số lượng.",
        "Nếu dùng nhiều máy ảnh, kiểm tra link thư mục cho từng máy ảnh."
      ]
    },
    {
      "title": "Kiểm tra link gửi khách",
      "steps": [
        "Trong album → Chia sẻ → Sao chép Link khách chọn ảnh.",
        "Gửi đúng mật khẩu; kiểm tra quyền cho phép chọn và giới hạn ảnh.",
        "Nếu vẫn lỗi, ghi lại thông báo lỗi và bước bị lỗi để được hỗ trợ."
      ]
    }
  ],
  "image": {
    "name": "chia-se-album.jpg",
    "alt": "Hai loại link chia sẻ album Lumipic: khách chọn ảnh và người thân chỉ xem",
    "width": 528,
    "height": 482
  }
};

export default function DriveTroubleshootingGuidePage() {
  return <ShortGuideArticle {...guide} />;
}
