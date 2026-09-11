# Pickify — Giao Diện Chọn Ảnh Từ Google Drive Cho Photographer & Studio

Ứng dụng web chuyên nghiệp hỗ trợ Photographer tạo album chọn ảnh trực tiếp từ thư mục Google Drive, giúp khách hàng mở link trên điện thoại thả tim và xuất file CSV chuẩn Lightroom/Excel trong 3 giây.
Triển khai bám sát 100% tài liệu đặc tả kỹ thuật MVP [plan.md](./plan.md).

---

## 🚀 Khởi Chạy Ứng Dụng

### 1. Khởi chạy Development Server:
```bash
pnpm run dev
# hoặc
./node_modules/.bin/vite
```
Sau đó mở trình duyệt tại: **`http://localhost:5173`**

### 2. Kiểm tra TypeScript & Build Production:
```bash
pnpm run build
```

---

## 🌟 Các Phân Hệ Đã Triển Khai Hoàn Chỉnh

### 1. Landing Page (Trang Giới Thiệu Chuyên Nghiệp)
- **Hero Section**: Tiêu đề ấn tượng, CTA *"Trải nghiệm Quản lý Album"* & *"Thử Khách Thả Tim Demo"*, các badge hạn mức (1.500 ảnh/album, quyền `drive.readonly` an toàn, tối ưu Mobile First, xuất CSV 1-click).
- **So sánh Trực quan (Problem vs. Solution)**: Đối chiếu cảnh khách nhắn mã ảnh qua Zalo (gây nhầm lẫn, mất 30–60 phút mò mẫm) với giải pháp 1-link thông minh của Pickify.
- **Mockup Tương Tác Trực Tiếp (Interactive Preview)**: Cho phép khách truy cập bấm thả tim thử ngay trên Landing Page, thấy bộ đếm cập nhật tức thì và tải file CSV mẫu về máy tính.
- **Tính năng Cốt lõi (6 Features)**: Trình bày chi tiết quyền `drive.readonly`, tự động nén thumbnail 480px & preview 2.560px, khách không cần đăng nhập, đồng bộ SSE thời gian thực, bảo vệ mật khẩu Argon2id.
- **Quy trình 3 Bước (How It Works)**: Hướng dẫn luồng sử dụng đơn giản cho Photographer.
- **Bảng giá MVP (Pricing)**: Gói Khởi Nghiệp miễn phí (3 album, 1.500 ảnh, 30 ngày) và giới thiệu gói Studio Pro trong tương lai.
- **Câu hỏi thường gặp (FAQ)**: Giải đáp chi tiết các băn khoăn về bảo mật Google Drive, định dạng JPEG 50MB, và cách đưa mã ảnh vào Lightroom Filter.
- **Footer**: Liên kết chuyển đổi nhanh, chỉ báo trạng thái hệ thống.

### 2. Dashboard Quản lý Album của Nhiếp ảnh gia (Photographer Workspace)
- **Thống kê Hạn mức MVP**:
  * Số album đang hoạt động (hiển thị `2/3 Album` theo quota quy định).
  * Tổng số lượng ảnh đang lưu trữ.
  * Tổng số lượng ảnh đã được khách hàng thả tim.
- **Trạng thái Google Drive (`drive.readonly`)**: Nút chỉ báo xanh/vàng với modal thông tin chi tiết, hỗ trợ cấp quyền hoặc ngắt kết nối an toàn.
- **Bộ lọc & Tìm kiếm**: Lọc theo 4 trạng thái (*Tất cả, Sẵn sàng, Đang xử lý, Cần xử lý*) và tìm kiếm theo tên album.
- **Card Album Đa trạng thái**:
  * **Sẵn sàng (Ready)**: Đếm ngược thời hạn 30 ngày (ví dụ: *Còn 26 ngày*), số tim đã chọn, link rút gọn kèm nút copy 1-click, mã passcode, nút mở xem góc nhìn khách, nút xuất file CSV.
  * **Đang quét (Scanning)**: Badge tím kèm animation quét thư mục Google Drive.
  * **Đang nhập (Importing)**: Badge xanh dương kèm thanh tiến trình % và số lượng ảnh đã tạo preview (vd: `340/850 ảnh`).
  * **Cần xử lý (Needs Attention)**: Cảnh báo lỗi cụ thể (ví dụ: *Ảnh DSC_9832.JPG vượt quá 50MB*) kèm nút **"Thử lại phần chưa hoàn thành"**.
- **Modal Tạo Album Mới (Create Album)**:
  * Tự động trích xuất Folder ID từ URL Google Drive.
  * Nút "Điền link mẫu" giúp thử nghiệm nhanh chỉ với 1 click.
  * Thiết lập mật khẩu khách hàng (passcode 4 số).
  * Kiểm tra hạn mức 3 album trước khi tạo.
- **Trang Chi Tiết Album (Album Detail View)**:
  * Thư viện ảnh responsive hỗ trợ chuyển đổi 3 cột, 4 cột, 6 cột.
  * Bộ lọc: *Tất cả ảnh*, *Khách đã thả tim (❤️)*, tìm kiếm tên file (`DSC_0001.JPG`).
  * Đổi mật khẩu album (tự động thu hồi phiên khách cũ theo plan.md).
  * Thu hồi tất cả phiên truy cập của khách.
  * Xuất file CSV định dạng **UTF-8 BOM** chuẩn tiếng Việt (Tên file, Drive File ID, link gốc).
  * Phóng to ảnh trong **Lightbox Modal** sắc nét, hỗ trợ phím mũi tên `←`/`→`, phím `Space`/`L` để thả tim, phím `Esc` để đóng.

### 3. Trải nghiệm Khách Hàng (Guest Photo Picker)
- Màn hình nhập Passcode bảo mật (chống brute-force báo lỗi sau 5 lần thử, có gợi ý mật khẩu demo).
- Giao diện lựa ảnh tối ưu cho Smartphone (Mobile First, tap target ≥ 44px).
- Hiển thị trạng thái "Đồng bộ trực tiếp" (SSE).
- Cơ chế **Optimistic UI** kết hợp báo lỗi *"Chưa lưu - Bấm thử lại"* khi mất kết nối mạng.

### 4. Bảng Điều Khiển Thử Nghiệm (Demo Toolbar)
Nằm ở góc dưới màn hình giúp trải nghiệm mượt mà:
- Chuyển nhanh giữa: **Landing Page** ⇄ **Studio Dashboard** ⇄ **Khách Chọn Ảnh**.
- Chọn nhanh giữa 3 album mẫu.
- Nút **"Giả lập khách khác thả tim (SSE)"** để kiểm tra đồng bộ hai chiều.
- Nút **"Bật Giả lập Lỗi Mạng"** để kiểm tra tính năng "Chưa lưu / Thử lại".
- Nút **"Khôi phục dữ liệu gốc"**.
