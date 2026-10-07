# Trang đăng nhập, hướng dẫn và favicon trên Google — 07/10/2026

## Đã sửa source, chưa deploy

- `/dashboard/sign-in` là trang công khai được prerender vào `dist/sign-in.html`. Title: Đăng nhập - Lumipic; H1: Đăng nhập Lumipic; canonical trỏ URL chính, robots index,follow.
- Vercel rewrite sign-in về HTML riêng, bỏ header noindex bao trùm cả namespace dashboard. Dashboard, sign-up, album và app.html tiếp tục noindex; URL lạ vẫn 404 noindex. Cấu hình Nginx mẫu đã cập nhật tương ứng.
- PublicPage dùng lại màn hình đăng nhập hiện có. AuthScreen không phụ thuộc router khi prerender; liên kết dùng href, chuyển sau đăng nhập bằng location.replace, truy vấn tài khoản chỉ bắt đầu sau mount. React giữ metadata index cho sign-in.
- Thêm liên kết Đăng nhập tại footer trang chủ; màn hình đăng nhập liên kết tới hướng dẫn. Các bài hướng dẫn đã có liên kết từ trang chủ và giữa các bài, HTML công khai và metadata riêng.
- Sitemap tăng từ 7 lên 8 URL, thêm duy nhất trang đăng nhập; không đưa dashboard riêng tư, sign-up hay album vào sitemap.
- Rút gọn title hướng dẫn lỗi Drive để không lặp tên Lumipic.

## Favicon đã tồn tại và hoạt động trên live

`https://lumipic.space/favicon.png`: PNG 96×96 vuông, biểu tượng trái tim trắng trên nền đen, HTTP 200 / image/png khi kiểm tra với Googlebot-Image user-agent. Header trang chủ có rel=icon và robots cho phép crawl. Không thay URL hoặc tạo icon khác vì không tìm thấy lỗi cấu hình asset hiện tại. Giả lập user-agent không chứng minh mọi IP Google thật đều truy cập được.

Google cần crawl/xử lý thông tin trang chủ để cập nhật icon; theo tài liệu Google có thể mất vài ngày đến vài tuần, và không đảm bảo luôn hiển thị. Trang chủ đã được gửi yêu cầu crawl lại trong phiên kiểm tra deploy trước đó. Ảnh chụp kết quả tìm kiếm chưa có favicon không đủ để kết luận source hiện tại thiếu icon.

## Sitelinks và index

Các mục Login/Hướng dẫn dưới kết quả chính như ảnh ví dụ là sitelinks tự động. Không có cấu hình hoặc schema buộc Google hiển thị những mục cụ thể. Title/H1 rõ ràng, cấu trúc link và trang có thể index giúp Google hiểu các trang quan trọng; kết quả còn phụ thuộc truy vấn và đánh giá của Google.

Cả 4 bài hướng dẫn đã được Request indexing ngày 07/10. Request indexing không tương đương đã được index. Search Console trước đó báo sitemap Couldn't fetch dù HTTP/XML hợp lệ; việc thêm sign-in vào sitemap không tự chứng minh đã giải quyết lỗi đọc sitemap.

Sau deploy bản này:
1. Kiểm tra HTML/header thật `/dashboard/sign-in`: không noindex, đúng canonical, có form/nội dung.
2. Kiểm tra sitemap có 8 URL và favicon vẫn 200; dashboard riêng tư vẫn noindex.
3. URL Inspection → Test live URL → Request indexing cho trang đăng nhập; gửi lại sitemap nếu cần và xem trạng thái Google đọc thực tế.
4. Theo dõi Pages/Performance; không đánh giá thứ hạng hay sitelinks chỉ từ điểm Lighthouse.

## Kiểm tra

Build đạt, prerender 8 trang. Hai nhóm kiểm tra HTML/HTTP SEO đạt; 31 tests đạt. Kiểm tra trình duyệt trang đăng nhập sau hydration: title/robots/canonical đúng, 1 H1, nút hiện/ẩn mật khẩu hoạt động, không lỗi ứng dụng trong log đã đọc. Chưa thực hiện đăng nhập thật hoặc OAuth trong phiên này. Cảnh báo fetchPriority cũ của Lightbox không liên quan thay đổi đăng nhập.

Tài liệu chính thức: [Sitelinks](https://developers.google.com/search/docs/appearance/sitelinks), [favicon](https://developers.google.com/search/docs/appearance/favicon-in-search).
