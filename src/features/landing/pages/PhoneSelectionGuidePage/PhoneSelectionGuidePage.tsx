import { ShortGuideArticle } from "../../components/ShortGuideArticle";

const guide = {
  "path": "/huong-dan/chon-anh-tren-dien-thoai",
  "title": "Cách chọn ảnh trên điện thoại với Lumipic",
  "intro": "Khách mở link do nhiếp ảnh gia gửi, không cần tạo tài khoản Lumipic.",
  "sections": [
    {
      "title": "Mở album",
      "steps": [
        "Mở Link khách chọn ảnh trong trình duyệt điện thoại.",
        "Nhập mật khẩu được gửi kèm → Mở album."
      ]
    },
    {
      "title": "Chọn ảnh",
      "steps": [
        "Chạm ảnh để xem lớn; thả tim để chọn, bấm lại để bỏ chọn.",
        "Theo dõi số ảnh đã chọn và giới hạn của album.",
        "Mở Đã chọn để kiểm tra lại lựa chọn."
      ]
    },
    {
      "title": "Hoàn tất",
      "steps": [
        "Lựa chọn tự lưu; chọn xong, báo nhiếp ảnh gia.",
        "Không thả tim được? Kiểm tra đang dùng link khách chọn, không phải link người thân chỉ xem.",
        "Nếu đã hết giới hạn hoặc album khóa chọn, liên hệ nhiếp ảnh gia."
      ]
    }
  ],
  "image": {
    "name": "khach-mo-album.jpg",
    "alt": "Màn hình nhập mật khẩu để khách mở album Lumipic",
    "width": 432,
    "height": 464
  }
};

export default function PhoneSelectionGuidePage() {
  return <ShortGuideArticle {...guide} />;
}
