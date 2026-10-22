# Lumipic brand kit

Trích xuất từ landing hiện tại ngày 19/10/2026, sau khi thay Be Vietnam Pro bằng `ui-sans-serif`. Đây là bộ nhận diện dùng làm đầu vào redesign; chưa đổi theme hay giao diện của các trang khác.

## File dùng lại

| File | Công dụng |
| --- | --- |
| [preview.html](preview.html) | Xem logo, bảng màu và mẫu chữ trên cùng một trang |
| [tokens.json](tokens.json) | Giá trị và nguồn trích xuất cho công cụ hoặc AI |
| [tokens.css](tokens.css) | Biến CSS có tiền tố `--lumipic-*`, chỉ bật trong `.lumipic-brand` |
| [fonts.css](fonts.css) | Khai báo Bricolage Grotesque tự host, đủ latin và tiếng Việt |
| [logos/lumipic-symbol.svg](logos/lumipic-symbol.svg) | Biểu tượng vector, nền trong suốt, viewBox 64 × 64 |
| [logos/lumipic-logo.svg](logos/lumipic-logo.svg) | Logo ngang có chữ, nhúng font latin để mở độc lập |
| [fonts/](fonts/) | Hai file WOFF2 sao chép từ bộ font dùng chung |

Nguồn gốc: `src/features/landing/pages/LandingPage/LandingPage.css` và `src/components/ui/lumipic-logo.tsx`. Bộ này là snapshot; khi thay brand ở landing cần đồng bộ lại bộ trích xuất. SVG logo ngang dùng chữ SVG với font nhúng, chưa chuyển chữ thành outline. Trong app, `src/components/ui/lumipic-logo.tsx` là nguồn chuẩn về bố cục logo responsive.

## Màu và vai trò

| Token CSS (tiền tố `--lumipic-`) | Màu | Dùng cho |
| --- | --- | --- |
| `bg`, `card` | `#FFFFFF` | Nền trang, card |
| `soft` | `#FFF4F6` | Vùng nền nhẹ, phân nhóm nội dung |
| `ink`, `band` | `#1A1420` | Chữ chính, CTA tối, dải nền tối |
| `muted` | `#5A5160` | Chữ phụ |
| `line` | `#EEE7EC` | Viền và rãnh thanh tiến trình |
| `accent` | `#D61F5B` | Logo, CTA chính, trạng thái chọn |
| `accent-hover` | `#B8184D` | Hover CTA chính |
| `on-accent`, `band-ink` | `#FFFFFF` | Chữ trên màu nhấn / dải tối |
| `accent-soft` | `#FFE8EE` | Nền badge và icon có màu thương hiệu |
| `accent-text` | `#9C1240` | Chữ màu nhấn trên nền sáng |
| `hero-accent` | `#FF7FA3` | Icon nhấn trên nền tối |
| `band-muted` | `#C9C0CC` | Chữ phụ trong dải tối |
| `device` | `#15161A` | Khung thiết bị và toast minh hoạ |

`accent` là màu nhận diện; lỗi, cảnh báo, thành công vẫn cần bộ màu mang nghĩa riêng. `band` chỉ là dải tối của landing, chưa phải theme dark hoàn chỉnh.

## Font chữ

- **Bricolage Grotesque**, variable 500–800, normal, `font-display: swap`: logo, tiêu đề, số giá, tên album và tiêu đề bước. Tiêu đề chính 800, tiêu đề nhỏ 700. Stack: `'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif`.
- **ui-sans-serif**, stack `ui-sans-serif, system-ui, sans-serif`: body, navigation, button, label, form. Weight thường 400, nhãn 500, CTA 600. Đây là font hệ thống, hình chữ có thể khác giữa macOS và Windows; không có file font cần tải.
- Be Vietnam Pro không thuộc bộ font hiện tại. Các file cũ còn trong source không nên được import trở lại.

Thông số lấy từ landing: body 17px / 1.6; lead 20px; label 12–15px; heading line-height 1–1.1 và tracking khoảng -0.035em. Hero `clamp(44px, 6.6vw, 92px)` là quy mô marketing, không phải cỡ tiêu đề dashboard.

Font Bricolage đang self-host. Giữ hai subset latin / tiếng Việt và `unicode-range` trong `fonts.css`. Không cần gọi Google Fonts. Bộ này dùng asset đã có trong repo; chưa kèm hồ sơ giấy phép riêng để phân phối font bên ngoài dự án.

## Logo

Biểu tượng gồm hai thẻ ảnh nghiêng thành trái tim, một lớp opacity 0.5 và một chấm trắng. Giữ đúng hình học, opacity và tỷ lệ. Wordmark viết thường **lumipic**, Bricolage Grotesque 800, tracking -0.045em, màu `ink`; biểu tượng màu `accent`.

Thông số đang chạy: header icon 40px + chữ 26px, gap 8px; mobile icon 32px + chữ 22px; footer icon 30px + chữ 22px, gap 6px. Chưa có biến thể logo trắng được chuẩn hoá trong source. Khi đặt logo trên nền tối, cần kiểm tra lại tương phản trước khi tạo biến thể.

## Hình khối, khoảng cách, chuyển động

Giá trị trích xuất nằm trong JSON/CSS:

- Bo góc: input 14px, icon 12px, card 22px, step 24px, panel 32px, pill 999px.
- Shadow card: `0 10px 30px rgb(0 0 0 / .06)`; float: `0 18px 40px rgb(13 21 48 / .12)`; phone: `0 30px 70px rgb(13 21 48 / .22)`.
- Landing rộng tối đa 1280px, gutter `clamp(20px, 5vw, 48px)`, section `clamp(64px, 8vw, 112px)`.
- Motion: 150ms cho phản hồi nhanh, 350ms cho thay đổi trạng thái, 500ms cho panel; `ease` và spring `cubic-bezier(.34, 1.56, .64, 1)`. Tôn trọng `prefers-reduced-motion`.

## Áp dụng khi redesign trang khác

Các bước dưới đây là **gợi ý áp dụng**, không phải thông số đã tồn tại ở mọi màn:

1. Giữ bảng màu, logo và vai trò hai font. Body trong bảng/form có thể dùng 14–16px, tiêu đề trang 28–36px để phù hợp mật độ dữ liệu; không bê hero 92px hoặc section padding marketing vào dashboard.
2. Dùng lại Button, Input, Badge, Card, Dialog… trong `src/components/ui/`. Chốt cùng một kích thước control, padding và bo góc cho cả nhóm trang trước khi dựng.
3. Import `fonts.css` và `tokens.css` từ app hoặc entry của trang; thêm `.lumipic-brand` vào wrapper. Các file này không tự ghi đè theme shadcn toàn cục.
4. Dùng token như `background: var(--lumipic-soft)` và `font-family: var(--lumipic-font-display)`; không import toàn bộ `LandingPage.css` chỉ để lấy brand.
5. Dự án dùng **Tailwind v3**. Token shadcn hiện tại lưu HSL channel (`hsl(var(--primary))`); không gán HEX trực tiếp vào `--primary`. Khi migrate cần chuyển HEX sang HSL hoặc map `--lumipic-*` trong `theme.extend.colors`. Portal của dialog/dropdown cần được áp cùng phạm vi theme.
6. Bảng màu app trong `src/index.css`, thang `brand` trong `tailwind.config.js`, và font Plus Jakarta Sans ở guest page hiện vẫn khác landing. Chỉ đổi trong phạm vi redesign được chọn; brand kit chưa migrate các trang đó.

Brief dùng lại: “Redesign trang … theo `docs/brand/README.md` và `tokens.json`. Giữ logo Lumipic, hồng #D61F5B, nền #FFFFFF/#FFF4F6, chữ #1A1420, Bricolage Grotesque cho tiêu đề và ui-sans-serif cho body. Dùng shadcn hiện có, điều chỉnh mật độ theo nhiệm vụ của trang, xử lý đủ loading/empty/error/focus và mobile.”
