export const GUIDE_PATH = "/huong-dan/gui-anh-google-drive";
const imageBase = "/images/guides/gui-anh-google-drive";

export const guideSteps = [
  {
    id: "chuan-bi-drive", title: "Chuẩn bị thư mục ảnh trên Google Drive", audience: "Nhiếp ảnh gia",
    instructions: ["Tải ảnh JPEG lên một thư mục Drive, giữ nguyên tên file.", "Chia sẻ → Bất kỳ ai có đường liên kết → Người xem.", "Sao chép link thư mục."],
    note: "Người có link đều xem được ảnh trên Drive; mật khẩu Lumipic không bảo vệ thư mục này.",
  },
  {
    id: "tao-album", title: "Tạo album và dán link thư mục", audience: "Nhiếp ảnh gia",
    instructions: ["Dashboard → Tạo album mới.", "Nhập tên album, máy ảnh và link Drive.", "Đặt mật khẩu (ít nhất 4 ký tự), giới hạn chọn → Tạo album."],
    image: "tao-album.jpg", width: 528, height: 752, narrow: true,
    alt: "Form Tạo album mới của Lumipic với tên album, tên máy ảnh và ô dán link thư mục Google Drive",
  },
  {
    id: "kiem-tra-album", title: "Chờ ảnh được xử lý và kiểm tra album", audience: "Nhiếp ảnh gia",
    instructions: ["Chờ nhập ảnh xong, kiểm tra số lượng và ảnh xem trước."],
    image: "album-san-sang.jpg", width: 1244, height: 680,
    alt: "Album grad 3 trên Lumipic local hiển thị lưới ảnh JPEG, tên file và nút Chia sẻ",
  },
  {
    id: "gui-link", title: "Gửi đúng link chọn ảnh cho khách", audience: "Nhiếp ảnh gia",
    instructions: ["Chia sẻ → Sao chép Link khách chọn ảnh.", "Gửi link cùng mật khẩu cho khách."],
    note: "Link người thân chỉ xem không cho phép chọn ảnh.",
    image: "chia-se-album.jpg", width: 528, height: 482, narrow: true,
    alt: "Hộp Chia sẻ album có Link khách chọn ảnh và Link người thân chỉ xem, mỗi loại có nút sao chép",
  },
  {
    id: "khach-chon", title: "Khách mở link, nhập mật khẩu và thả tim", audience: "Khách hàng",
    instructions: ["Mở link → Nhập mật khẩu → Mở album.", "Thả tim để chọn; bấm lại để bỏ chọn.", "Lựa chọn tự lưu. Chọn xong, báo nhiếp ảnh gia."],
    image: "khach-mo-album.jpg", width: 432, height: 464, narrow: true,
    alt: "Màn hình khách mở album grad 3, nhập mật khẩu và nhấn nút Mở album",
  },
  {
    id: "nhan-ket-qua", title: "Xem danh sách ảnh khách đã chọn", audience: "Nhiếp ảnh gia",
    instructions: ["Mở album → Đã tim để xem ảnh khách chọn.", "Muốn khóa lựa chọn: Cài đặt → Tắt Cho phép khách chọn ảnh."],
    image: "anh-da-chon.jpg", width: 1244, height: 680,
    alt: "Tab Đã tim trong album grad 3 hiển thị 20 ảnh khách đã chọn trên tổng giới hạn 20 ảnh",
  },
  {
    id: "loc-anh", title: "Lọc ảnh gốc trên máy để bắt đầu hậu kì", audience: "Nhiếp ảnh gia",
    instructions: ["Lọc ảnh → Chọn định dạng, thư mục nguồn và đích.", "Cấp quyền thư mục → Bắt đầu lọc ảnh."],
    note: "Dùng Chrome/Edge trên máy tính. Tên file ảnh gốc phải khớp ảnh JPEG.",
    image: "loc-anh-ve-may.jpg", width: 560, height: 465,
    alt: "Hộp Lọc ảnh về máy với lựa chọn định dạng, thư mục nguồn, thư mục đích và nút Bắt đầu lọc ảnh",
  },
].map(step => ({ ...step, imageUrl: step.image ? `${imageBase}/${step.image}` : undefined }));

export type GuideStepData = typeof guideSteps[number];
