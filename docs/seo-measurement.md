# Thiết lập GA4 và Search Console cho Lumipic

Measurement ID đã cấu hình trong `.env.production`: `G-DQ2K1W0FF0`.
Vite tự đọc file này khi build production; biến cùng tên trên hosting sẽ ghi đè giá trị trong file. Sau deploy, kiểm tra Realtime để xác nhận dữ liệu thực tế.

## Lấy mã GA4

1. Mở https://analytics.google.com/, vào Admin → Create → Account (nếu chưa có) → Property. Chọn múi giờ Việt Nam, tiền tệ VND.
2. Data collection → Data streams → Web. Nhập `https://lumipic.space`, tên Lumipic.
3. Tắt Enhanced measurement để tránh tự gửi URL của album riêng tư và page_view trùng.
4. Mở stream, sao chép Measurement ID dạng `G-...`.
5. Đặt `VITE_GA_MEASUREMENT_ID=G-...` trong môi trường build production rồi build/deploy lại. Không cần chèn thêm Google tag hay GTM.
6. Mở trang chủ production, kiểm tra Realtime. Tạo album thật khi cần: sự kiện `album_created` chỉ gửi sau API thành công. Đánh dấu sự kiện này là key event trong GA4.
7. Traffic acquisition → Session default channel group → Organic Search để xem lượt truy cập và key event từ tìm kiếm. Thêm `accounts.google.com` vào unwanted referrals nếu OAuth làm sai nguồn phiên. Không tự gán mọi lượt tạo album là organic.

Code chỉ bật GA4 khi production, đúng origin `https://lumipic.space` và có mã hợp lệ. Không gửi tên album, ID, mật khẩu, link Drive, query string hoặc hash. Các URL dashboard riêng tư được gom thành `/dashboard`; trang khách không khởi tạo GA4. Không ghi page_view trên dashboard riêng tư. `/dashboard/sign-in` là trang công khai từ bản sửa SEO đăng nhập, được đo page_view với URL canonical, không gửi dữ liệu form.

## Core Web Vitals

Thư viện `web-vitals` đo LCP (ms), CLS (không đơn vị), INP (ms) trên các trang công khai; gửi sự kiện `web_vitals` với metric_name/value/id/rating/delta. `value` là số nguyên; CLS được nhân 1000, `metric_value` giữ giá trị gốc. INP cần tương tác; các báo cáo cuối có thể đến khi người dùng ẩn/rời trang.

Đã tạo ngày 06/10/2026: custom dimensions `Web vital name` → `metric_name`, `Web vital rating` → `metric_rating` (scope Event); custom metric `Web vital value` → `metric_value` (Standard). Luôn lọc theo tên chỉ số: LCP/INP có đơn vị ms; CLS không có đơn vị, không cộng hoặc lấy trung bình chung cả ba. Khi phân tích qua BigQuery, lấy giá trị cuối theo metric_id. So sánh percentile 75 của từng metric, phân nhóm thiết bị và landing page; không lấy trung bình event value chung cho ba metric.

Đo baseline production tại https://pagespeed.web.dev/ cho trang chủ và bài hướng dẫn, chọn mobile; ghi ngày, URL, LCP/CLS/TBT lab và dữ liệu CrUX nếu có. TBT lab không thay thế INP thực tế. Chỉ tối ưu bundle/font/hydration sau khi có kết quả. Nếu chưa đủ traffic, CrUX/Search Console có thể chưa có số liệu.

## Search Console

1. Mở https://search.google.com/search-console, Add property → Domain → `lumipic.space`.
2. Sao chép TXT Google cung cấp, thêm vào DNS của tên miền (host `@`/root), giữ các TXT khác. Quay lại Verify sau khi DNS cập nhật.
3. Sitemaps → gửi `https://lumipic.space/sitemap.xml` sau khi phiên bản mới được deploy.
4. URL Inspection → kiểm tra `/` và `/huong-dan/gui-anh-google-drive`; yêu cầu index nếu nội dung mới chưa được crawl.
5. Theo dõi Pages (index), Performance (queries/clicks/impressions/CTR), Core Web Vitals (mobile/desktop). Lưu baseline 28 ngày và so sánh sau thay đổi.
6. Có thể liên kết Search Console với GA4 ở Admin → Product links → Search Console links sau khi cả hai được xác minh.

Hướng dẫn chính thức: [Google tag ID](https://support.google.com/analytics/answer/9539598), [xác minh Search Console](https://support.google.com/webmasters/answer/9008080), [web-vitals](https://github.com/GoogleChrome/web-vitals).

## Liên kết bài hướng dẫn

Hiện có 4 bài được prerender, liên kết từ trang chủ và giữa các bài bằng `<a href>`:
- `/huong-dan/gui-anh-google-drive`
- `/huong-dan/loc-anh-raw`
- `/huong-dan/chon-anh-tren-dien-thoai`
- `/huong-dan/loi-google-drive`

## Kiểm tra bản triển khai SEO mới

`dist/index.html` phải là trang chủ đã prerender, không chứa `noindex`; `dist/app.html` là khung ứng dụng riêng tư có `noindex`. Dashboard riêng tư rewrite về `/app.html`; `/dashboard/sign-in` được prerender thành `sign-in.html`, có canonical/index và không nhận header noindex; `/index.html` và `/home.html` redirect về `/`. Không thêm rewrite `/` về `home.html`: file index trên filesystem có thể được Vercel phục vụ trước rewrite.

Chạy `pnpm build && pnpm test:seo` trước deploy. Bộ kiểm tra đọc trực tiếp file index và app ngoài kiểm tra HTTP preview, để không bỏ sót khác biệt giữa preview và Vercel. Sau deploy, kiểm tra lại response HTML thật của `/`, `/dashboard`, `/sitemap.xml` và một URL lạ. Chỉ gửi sitemap/yêu cầu index sau khi `/` trả đúng nội dung và không còn `noindex`.

GA4 property Lumipic (`557674306`) / stream Lumipic Website (`G-DQ2K1W0FF0`) đã báo nhận dữ liệu trong 48 giờ gần nhất ngày 06/10/2026. Enhanced measurement đang tắt. `album_created` đã được đăng ký là key event, đếm mỗi sự kiện, không gán giá trị tiền tệ. Chưa có bằng chứng sự kiện tạo album thật đã được GA4 xử lý; báo cáo organic cần lưu lượng thực tế.


## Baseline production — 06/10/2026, 17:29 GMT+7

[PageSpeed mobile report](https://pagespeed.web.dev/analysis/https-lumipic-space/6cygukc3tt?form_factor=mobile), URL `https://lumipic.space/`, Lighthouse 13.5.0, Moto G Power, Slow 4G:

| Chỉ số | Kết quả lab |
| --- | --- |
| Performance | 95/100 |
| FCP | 2,3 s |
| LCP | 2,4 s |
| TBT | 0 ms |
| CLS | 0,001 |
| Speed Index | 2,3 s |
| Accessibility / Best Practices / SEO | 89 / 96 / 91 |

CrUX: No Data; chưa có bằng chứng INP/p75 thực tế hay thứ hạng. Đây là bản production trước những thay đổi local trong phiên này, không phải số đo bản vừa sửa.

Phát hiện production: `/robots.txt` trả HTML shell ứng dụng, báo 32 lỗi trong Lighthouse. Bản build local đã tạo robots.txt đúng và đã kiểm tra HTTP; cần deploy build mới để sửa production. Báo cáo còn chỉ ra render-blocking requests (~600 ms), JS chưa dùng (~67 KiB), CSS chưa dùng (~11 KiB), chặn zoom trong viewport và tương phản. Ưu tiên xác nhận lại sau deploy trước khi tối ưu rộng hơn.
