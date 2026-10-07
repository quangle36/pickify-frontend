import { ShortGuideArticle } from "../../components/ShortGuideArticle";

const guide = {
  "path": "/huong-dan/loc-anh-raw",
  "title": "Lọc ảnh RAW theo ảnh khách đã chọn",
  "intro": "Dùng Chrome hoặc Edge trên máy tính. Giữ cùng tên gốc giữa ảnh JPEG gửi khách và ảnh RAW.",
  "sections": [
    {
      "title": "Mở danh sách đã chọn",
      "steps": [
        "Dashboard → Mở album → Đã tim để kiểm tra lựa chọn.",
        "Mở Lọc ảnh; nếu có nhiều máy ảnh, chọn đúng máy ảnh."
      ]
    },
    {
      "title": "Chọn file gốc",
      "steps": [
        "Chọn định dạng RAW của máy ảnh: ARW, CR2, CR3, NEF, RAF, DNG, ORF hoặc RW2.",
        "Chọn thư mục nguồn chứa trực tiếp các file; công cụ không đọc thư mục con.",
        "Tên DSC_0001.jpg sẽ khớp DSC_0001.ARW khi chọn định dạng ARW."
      ]
    },
    {
      "title": "Sao chép ảnh để hậu kì",
      "steps": [
        "Chọn thư mục đích và cấp quyền đọc/ghi → Bắt đầu lọc ảnh.",
        "Kiểm tra kết quả: file thiếu, trùng tên hoặc sao chép lỗi cần xử lý lại.",
        "File gốc được giữ nguyên. Mở ảnh đã sao chép trong phần mềm hậu kì."
      ]
    }
  ],
  "image": {
    "name": "loc-anh-ve-may.jpg",
    "alt": "Hộp Lọc ảnh về máy của Lumipic với định dạng và thư mục nguồn, đích",
    "width": 560,
    "height": 465
  }
};

export default function RawFilterGuidePage() {
  return <ShortGuideArticle {...guide} />;
}
