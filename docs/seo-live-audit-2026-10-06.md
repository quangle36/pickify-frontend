# Kiểm tra SEO live Lumipic — 06/10/2026

Thời điểm: khoảng 21:20–21:26 (Asia/Ho_Chi_Minh). Kiểm tra HTTP/HTML trước JavaScript, request với User-Agent Googlebot, giao diện sau JavaScript, mạng GA4 và PageSpeed mobile. Không thay đổi code sản phẩm hay cấu hình deployment trong lần audit này.

## Kết luận

Bản mới đã live, nhưng trang chủ còn lỗi nghiêm trọng: server trả SPA shell có `noindex,nofollow`. Bài hướng dẫn và các trang pháp lý đã prerender đúng. Cần sửa cách phục vụ trang chủ trên production trước khi yêu cầu Google index.

## Phát hiện cần xử lý

### P0 — Trang chủ trả HTML noindex, rỗng trước JavaScript

`GET https://lumipic.space/` và `/?utm_source=seo-audit` trả HTTP 200, HTML khoảng 1.357 byte. Trang `/` trùng nội dung với `/index.html`.

```html
<meta name="robots" content="noindex,nofollow" />
<div id="root"></div>
```

HTML gốc: 0 H1, 0 canonical, không có nội dung FAQ, không có liên kết điều hướng, không có WebSite JSON-LD, Open Graph hoặc Twitter Card. Favicon đã có.

Request dùng Googlebot User-Agent cũng nhận kết quả trên. Đây là mô phỏng User-Agent, không phải bằng chứng Googlebot thật đã crawl/index.

Sau JavaScript, trang có đúng H1/title/canonical, link href, metadata và WebSite. Tuy nhiên Google có thể bỏ qua render JavaScript nếu gặp noindex ban đầu; crawler chia sẻ link cũng không nhất thiết chạy JavaScript. [Tài liệu Google](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

**Hướng sửa:** đảm bảo `/` trả HTML trang chủ prerender trực tiếp. Cách cụ thể: lưu SPA shell riêng (ví dụ `app.html`), dùng `index.html` cho homepage prerender, đổi rewrite dashboard sang app.html; bỏ header noindex của index.html nếu index.html trở thành trang chủ, chuẩn hóa alias về `/`. Kiểm tra HTTP production sau deploy vì Vite preview hiện qua tests nhưng không phản ánh cách Vercel đang phục vụ root. Cơ chế chính xác khiến rewrite `/` chưa hiệu lực cần đối chiếu deployment/routing; không chỉ xóa noindex toàn bộ index shell vì trang riêng tư vẫn cần noindex.

### P1 — Hiệu năng trang chủ mobile cần cải thiện

Một lần Lighthouse mobile mới: Performance 78, LCP 4,7 s, TBT 210 ms. Baseline trước đó: Performance 95, LCP 2,4 s, TBT 0 ms. Đây là các lần đo lab riêng lẻ, chưa đủ kết luận mức hồi quy ổn định hoặc quy lỗi cho GA4.

Lighthouse chỉ ra render-blocking requests (~610 ms), JS chưa dùng (~135 KiB), CSS chưa dùng (~12 KiB), 4 long tasks. Ưu tiên phục vụ đúng homepage prerender/hydration, rồi đo lại; tiếp theo mới phân tích bundle, font và mã bên thứ ba. Chưa có CrUX/INP thực tế.

### P2 — Những kiểm tra và cấu hình còn cần thực hiện

- Accessibility mobile 90: viewport đang chặn zoom (`maximum-scale=1`, `user-scalable=no`) và một số màu thiếu tương phản.
- Trang chủ có Best Practices 96, Lighthouse báo browser console errors; chưa quy được nguyên nhân. Trình duyệt audit có extension nên các log lỗi ở phiên này không đủ để kết luận lỗi ứng dụng.
- GA4 `page_view` đã gửi đến `/g/collect` với `tid=G-DQ2K1W0FF0` và nhận HTTP 204. Chunk web-vitals tải được (304 cache). Chưa xác minh số liệu trong GA4 Realtime, receipt của `web_vitals`, hay `album_created` vì không tạo album thử trên production.
- Chưa kiểm tra trạng thái index, queries/clicks, hoặc quyền sở hữu property trong Search Console. Sau khi sửa P0: gửi sitemap, URL Inspection → Test live URL → Request indexing cho `/` và bài hướng dẫn. Kiểm tra `album_created` đã được đánh dấu key event; dùng Organic Search trong Traffic acquisition để đọc chuyển đổi.

## Các mục đã đúng trên live

| Hạng mục | Kết quả |
| --- | --- |
| `/huong-dan/gui-anh-google-drive`, `/privacy`, `/terms` | HTTP 200; HTML prerender, 1 H1, 1 canonical, description/title riêng, index,follow |
| Metadata chia sẻ của ba trang trên | Open Graph + Twitter summary_large_image có trong HTML gốc |
| Bài hướng dẫn | 7 bước; link href; 6 ảnh trả 200 image/jpeg, có alt và kích thước |
| `/robots.txt` | 200 text/plain, Allow /, Disallow /api/, trỏ sitemap đúng; lỗi trả HTML trước đây đã sửa |
| `/sitemap.xml` | 200 application/xml; 4 URL canonical công khai, không chứa dashboard/album |
| Favicon PNG/ICO/apple touch và ảnh chia sẻ | 200, đúng Content-Type; ảnh chia sẻ truy cập công khai |
| Alias `.html`, trailing slash | 308 về URL chuẩn |
| HTTP và www | 308 về https://lumipic.space/ |
| URL không tồn tại | 404 thật và trang 404 có meta noindex; không còn soft 404 trong các mẫu đã kiểm tra |
| Dashboard/sign-in/sign-up/album dashboard | HTML shell noindex và header X-Robots-Tag noindex |
| GA4 | Script đúng G-DQ2K1W0FF0; page_view nhận 204 từ endpoint Analytics |

Các URL 404 thử: `/seo-audit-nonexistent-20261006`, `/dashboard/missing`, `/privacy/missing`, `/album/a/b`, `/assets/seo-audit-missing.js`.

## PageSpeed mobile sau deploy

Moto G Power, Slow 4G, Lighthouse 13.5.0; dữ liệu lab, không phải số liệu người dùng thực tế.

| Chỉ số | Trang chủ | Bài hướng dẫn |
| --- | --- | --- |
| Performance | 78 | 100 |
| SEO | 100 | 100 |
| Accessibility | 90 | 90 |
| Best Practices | 96 | 100 |
| FCP | 2,1 s | 1,5 s |
| LCP | 4,7 s | 1,5 s |
| TBT | 210 ms | 20 ms |
| CLS | 0 | 0 |
| Speed Index | 2,6 s | 1,5 s |
| CrUX | No Data | No Data |

SEO 100 của Lighthouse không phủ nhận noindex trong HTML gốc: công cụ quan sát trang sau render, trong khi kiểm tra HTTP độc lập nhận SPA shell noindex.

- [Báo cáo trang chủ — 21:20](https://pagespeed.web.dev/analysis/https-lumipic-space/yjb4me2213?form_factor=mobile)
- [Báo cáo hướng dẫn — 21:23](https://pagespeed.web.dev/analysis/https-lumipic-space-huong-dan-gui-anh-google-drive/hqpgwhwj6b?form_factor=mobile)
- [Kết quả HTTP thô](seo-live-evidence-2026-10-06/http-results.json)
- [HTML trang chủ với Googlebot User-Agent](seo-live-evidence-2026-10-06/home-googlebot.html)
