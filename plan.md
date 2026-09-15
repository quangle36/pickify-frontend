# Thiết kế MVP: Website lựa ảnh từ Google Drive

## 1. Mục tiêu và phạm vi

Website mở đăng ký công khai cho photographer. Mỗi người đăng nhập Google, kết nối Drive riêng, dán link folder JPEG để tạo album. Hệ thống tự nhập ảnh xem trước; khách mở link album, nhập mật khẩu rồi thả tim.

**Tiêu chí thành công:** nhập đủ album tối đa 1.500 JPEG, không âm thầm bỏ sót ảnh; lựa chọn được lưu bền vững và đồng bộ giữa các thiết bị.

Các quyết định đã chốt:

- Một album có **một danh sách tim chung** cho tất cả khách.
- Khách không đăng nhập và luôn được thả/bỏ tim; không có bước gửi hoặc khóa lựa chọn.
- Photographer chỉ quản lý tài khoản, kết nối Drive và album của mình.
- MVP miễn phí: tối đa **3 album chưa hết hạn/tài khoản**, **1.500 ảnh/album**, thời hạn **30 ngày**.
- Sử dụng hạ tầng managed; chưa triển khai thanh toán.

## 2. Trải nghiệm sản phẩm

### Photographer

1. Đăng nhập bằng Google.
2. Chọn “Kết nối Google Drive” để cấp quyền đọc và nhập ảnh nền.
3. Tạo album với tên, link folder và mật khẩu.
4. Theo dõi các trạng thái: **Đang quét → Đang nhập → Sẵn sàng**, hoặc **Cần xử lý**.
5. Nếu lỗi, xem số ảnh và nguyên nhân; có thể thử lại phần chưa hoàn thành.
6. Khi sẵn sàng, sao chép link gửi khách.
7. Xem toàn bộ ảnh, lọc ảnh có tim và xuất CSV gồm tên file, Drive file ID, link file gốc.
8. Đổi mật khẩu, thu hồi phiên khách hoặc xóa album.

### Khách hàng

- Mở link và nhập mật khẩu trước khi nhận danh sách hoặc preview ảnh.
- Xem lưới thumbnail, mở lightbox để xem ảnh lớn.
- Thả/bỏ tim trong lưới hoặc lightbox; xem bộ đếm và bộ lọc “Đã chọn”.
- Tim cập nhật ngay trên giao diện, chỉ được coi là đã lưu khi server xác nhận.
- Nếu mạng lỗi, hiển thị “Chưa lưu” và cho thử lại; không giả báo thành công.
- Thay đổi từ người khác tự cập nhật. Người này bỏ tim sẽ bỏ ảnh khỏi danh sách chung.

Giao diện tiếng Việt, ưu tiên điện thoại, hỗ trợ bàn phím trong lightbox và nút tim có nhãn truy cập rõ ràng.

## 3. Kiến trúc và dữ liệu

### Stack

| Thành phần  | Lựa chọn                                                  |
| ----------- | --------------------------------------------------------- |
| Frontend    | React, Vite, TypeScript, Tailwind, shadcn/ui              |
| Backend     | Node.js, TypeScript, Fastify                              |
| Database    | PostgreSQL managed, Prisma                                |
| Hàng đợi    | BullMQ và Redis managed hỗ trợ BullMQ                     |
| Worker      | Tiến trình Node.js riêng, dùng Sharp xử lý JPEG           |
| Media       | Object storage riêng tư tương thích S3, CDN hỗ trợ URL ký |
| Đồng bộ tim | SSE; gửi thao tác qua HTTP                                |

Một monorepo chứa web, API, worker và kiểu dữ liệu dùng chung. API và worker triển khai độc lập; tác vụ nhập không chạy bên trong request tạo album.

### Dữ liệu chính

- **Photographer:** Google subject ID, thông tin hiển thị.
- **Drive connection:** chủ sở hữu, token mã hóa, trạng thái kết nối.
- **Album:** chủ sở hữu, folder ID, mã chia sẻ ngẫu nhiên, mật khẩu băm, trạng thái, thời hạn.
- **Photo:** album, Drive file ID, tên gốc, phiên bản nguồn, trạng thái nhập, đường dẫn preview, trạng thái tim.
- **Import job:** tiến độ phân trang, lỗi và số lần thử.
- **Guest session:** album được phép truy cập, hạn phiên, phiên bản quyền truy cập.

Ràng buộc duy nhất `(albumId, driveFileId)` ngăn ảnh trùng khi chạy lại tác vụ. PostgreSQL là nguồn dữ liệu chuẩn; Redis không phải nơi lưu tim duy nhất.

### Quyền truy cập

- Đăng nhập Google và cấp quyền Drive là hai bước riêng.
- Dùng authorization code flow và refresh token để nhập tiếp khi photographer đóng trình duyệt.
- Backend dùng quyền Drive của đúng chủ album; token không gửi xuống frontend.
- Mọi truy vấn quản trị kiểm tra chủ sở hữu, không tin `photographerId` do client gửi.
- Khách nhận cookie phiên `HttpOnly`, `Secure`, `SameSite`; mật khẩu băm bằng Argon2id.
- Đổi mật khẩu thu hồi toàn bộ phiên khách của album.
- Preview lưu riêng tư, cấp URL ký sống 5 phút sau khi kiểm tra phiên. URL đã cấp có thể còn dùng được đến khi hết hạn.
- Giới hạn thử mật khẩu theo IP và album; không công khai folder Drive.

## 4. Nhập ảnh, API và hành vi lỗi

### Quy trình nhập

1. Kiểm tra hạn mức và quyền đọc folder.
2. Quét các JPEG trực tiếp trong folder, lấy đủ các trang; không dừng chỉ vì trang có ít ảnh.
3. Lưu danh sách nguồn vào database. Không công bố album khi quá trình quét chưa hoàn tất hoặc kết quả không đầy đủ.
4. Worker tải từng JPEG, tạo thumbnail và preview, tải lên storage rồi xóa file tạm.
5. Đánh dấu sẵn sàng chỉ khi mọi JPEG trong danh sách đều có preview thành công.

Mặc định thumbnail rộng tối đa 960 px để hiển thị rõ trên màn hình Retina, preview cạnh dài tối đa 2.560 px; không phóng lớn ảnh nhỏ. Tự xoay theo EXIF và loại metadata vị trí khỏi bản phục vụ khách.

- Giới hạn 50 MB/JPEG; folder vượt 1.500 JPEG hoặc chứa JPEG không hợp lệ phải báo rõ, không bỏ qua âm thầm.
- Bỏ qua định dạng khác và báo số lượng; chưa nhập thư mục con hoặc shortcut.
- Một album đang nhập/tài khoản, tối đa hai lượt tải đồng thời/tài khoản và tám lượt toàn hệ thống lúc khởi chạy.
- Retry lỗi rate limit, mạng và lỗi server với exponential backoff cùng jitter; sau tám lần chuyển sang cần xử lý.
- Token hết hiệu lực cần kết nối lại; lỗi quyền và file bị xóa cần photographer xử lý.
- Khi phân trang phải chạy lại, dùng Drive file ID để đối soát và loại trùng. Worker khởi động lại tiếp tục từ trạng thái bền vững.
- Album là **bản nhập cố định**. MVP không đồng bộ thay đổi Drive sau khi hoàn tất; muốn bộ ảnh khác thì tạo album mới.

### API tối thiểu

- Đăng nhập/đăng xuất Google; kết nối/ngắt Drive.
- Tạo, liệt kê, xem và xóa album; đổi mật khẩu; thử lại nhập; xuất CSV.
- Xác thực mật khẩu album và tạo phiên khách.
- Đọc ảnh theo trang, lọc ảnh đã chọn và lấy tổng số tim.
- `PUT /guest/albums/:shareId/photos/:photoId/selection` với `{ selected: boolean }`.
- SSE thông báo thay đổi tim và phiên bản danh sách.

Ghi tim theo trạng thái mong muốn, không dùng thao tác đảo trạng thái. Hai người ghi ngược nhau thì lần ghi được database áp dụng sau cùng thắng. Mỗi thay đổi có phiên bản tăng dần; khi SSE nối lại, client đọc lại trạng thái server để bù sự kiện bị lỡ.

### Hạn mức và vòng đời

- Hạn mức được kiểm tra trong giao dịch để không vượt giới hạn bằng nhiều request đồng thời.
- Album hết hạn sau 30 ngày từ lúc sẵn sàng: dừng truy cập ngay, xóa preview và dữ liệu lựa chọn trong vòng 24 giờ.
- Photographer thấy ngày hết hạn và được xuất CSV trước đó.
- Album nhập lỗi quá 7 ngày được dọn dữ liệu tạm.
- Xóa album thu hồi truy cập và lên lịch xóa media; không sửa hoặc xóa file gốc trên Drive.

## 5. Kiểm thử và phát hành

### Kiểm thử bắt buộc

- Nhập 1.500 JPEG, đối chiếu tập Drive file ID và preview: không thiếu, không trùng.
- Giả lập `403` rate limit, `429`, lỗi mạng, token hết hạn, pagination lỗi và worker dừng giữa chừng.
- Xác nhận album không báo sẵn sàng khi còn ảnh lỗi.
- Hai photographer không đọc, sửa hoặc xuất dữ liệu của nhau.
- Chưa nhập mật khẩu không lấy được danh sách, SSE hoặc URL preview.
- Đổi mật khẩu làm phiên khách cũ mất quyền.
- Hai thiết bị thả/bỏ tim đồng thời; gửi lại request không đảo tim; tải lại trang vẫn đúng.
- Mất kết nối SSE rồi nối lại khôi phục danh sách chuẩn.
- Kiểm tra hạn mức, hết hạn, xóa album và xử lý tên file trùng.
- Kiểm tra điện thoại: tải thumbnail theo vùng nhìn thấy, không tải toàn bộ preview lớn khi mở album.

### Thứ tự triển khai

1. Kiểm chứng OAuth với hai tài khoản Google độc lập và quy trình nhập 1.500 JPEG.
2. Hoàn thiện API, database, hàng đợi và bảo vệ media.
3. Xây dashboard photographer và album khách bằng React.
4. Kiểm thử tích hợp, triển khai staging, sau đó mở production khi đáp ứng điều kiện Google.

CI chạy typecheck, kiểm thử và build. Theo dõi số job lỗi, thời gian nhập, lỗi OAuth, tỷ lệ lưu tim thất bại và dung lượng media; log không chứa token hoặc mật khẩu.

**Điều kiện phát hành công khai:** hoàn tất quy trình áp dụng cho quyền `drive.readonly`, gồm xác minh và yêu cầu đánh giá bảo mật khi dữ liệu đi qua server. Chưa chốt chi phí hoặc thời gian duyệt cho đến khi kiểm tra với Google. [Tài liệu quyền Drive](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)

**Ngoài MVP:** thanh toán, RAW, tải ảnh gốc cho khách, bình luận, danh sách tim riêng, watermark, đồng bộ Drive liên tục và khóa lựa chọn.
