# Hệ thống thiết kế trang landing

Bộ nhận diện trích xuất để redesign các trang khác: [Lumipic brand kit](brand/README.md), kèm token CSS/JSON, logo SVG, font và trang xem mẫu.

Trang landing (`/`) có hệ thống thiết kế riêng: nền trắng xen hồng nhạt, một màu nhấn hồng `#D61F5B`, tiêu đề Bricolage Grotesque, chữ thường ui-sans-serif.

Toàn bộ nằm trong `src/features/landing/pages/LandingPage/LandingPage.css` và chỉ áp dụng bên trong `.landing-page`. Dashboard và các trang khác vẫn dùng token chung của app (`.agents/skills/ui-ux/references/brand-tokens.md`). Đừng trộn hai bên.

Bản thiết kế gốc: board "Landing page — bản cuối" trong canvas [Lumipic landing redesign](https://claude.ai/artifact/RvhdV7DwZnTDWkZRi7kET5).

## Quy tắc nhanh

- Màu chỉ lấy từ token `--lp-*`. Không viết mã màu trực tiếp trong component.
- Class mới đặt tên `lp-…` và viết trong `LandingPage.css`.
- Nút, badge, accordion dùng shadcn (`Button`, `Badge`, `Accordion`) rồi style bằng class `lp-…`.
- Nút kêu gọi hành động (CTA) luôn là thẻ `<a>`, qua `Button asChild`.
- Ảnh chỉ lấy từ `photos.ts`: 4 ảnh thật của album Glamping.
- Chuyển động nào cũng phải có bản tắt khi người dùng bật giảm chuyển động.

## Màu

| Token | Giá trị | Dùng cho |
| --- | --- | --- |
| `--lp-bg` | `#FFFFFF` | Nền trang |
| `--lp-soft` | `#FFF4F6` | Nền hero, dải chip, khung minh hoạ các bước, thẻ giá, ô FAQ |
| `--lp-card` | `#FFFFFF` | Thẻ đặt trên nền hồng nhạt |
| `--lp-ink` | `#1A1420` | Chữ chính, nút CTA trên header |
| `--lp-muted` | `#5A5160` | Chữ phụ |
| `--lp-line` | `#EEE7EC` | Viền, đường kẻ, rãnh thanh tiến trình |
| `--lp-accent` | `#D61F5B` | Nền CTA chính, tim đã chọn, thanh tiến trình |
| `--lp-accent-hover` | `#B8184D` | Hover của CTA chính |
| `--lp-on-accent` | `#FFFFFF` | Chữ trên nền màu nhấn |
| `--lp-accent-soft` | `#FFE8EE` | Nền pill đếm ảnh, ô icon |
| `--lp-accent-text` | `#9C1240` | Chữ màu nhấn: dòng thứ hai của tiêu đề, số bước đang chạy |
| `--lp-hero-accent` | `#FF7FA3` | Icon trên nền tối (toast) |
| `--lp-band`, `--lp-band-ink`, `--lp-band-muted` | `#1A1420`, `#FFFFFF`, `#C9C0CC` | Dải Lightroom nền tối |
| `--lp-device` | `#15161A` | Khung điện thoại, toast |

Chữ màu nhấn dùng `--lp-accent-text`, không dùng `--lp-accent`. Bản đậm này đạt khoảng 8:1 trên nền trắng. Chữ trắng trên `--lp-accent` đạt khoảng 5:1.

## Chữ

Font chữ chia vai rõ:

- **Bricolage Grotesque** (500–800): h1, h2, logo, số giá, tên album, tiêu đề bước. Tiêu đề lớn dùng 800, tiêu đề nhỏ dùng 700.
- **ui-sans-serif** (400, 500, 600): mọi chữ còn lại. Cỡ gốc 17px, line-height 1.6.

Tiêu đề có letter-spacing âm: mặc định `-0.035em`, logo `-0.045em`.

| Vai trò | Cỡ chữ |
| --- | --- |
| h1 hero | `clamp(44px, 6.6vw, 92px)` |
| h2 phần các bước | `clamp(38px, 5vw, 66px)` |
| h2 phần ảnh và lợi ích | `clamp(34px, 4.2vw, 56px)` |
| h2 dải chip, dải Lightroom | `clamp(32px, 4vw, 52px)` |
| h2 FAQ | `clamp(32px, 3.8vw, 48px)` |
| Số giá `0₫` | 88px |
| Đoạn mở đầu hero | 20px, màu phụ |
| Eyebrow | 13px, 600, chữ in hoa |
| Nhãn nhỏ | 12–15px |

### Nạp font

Bricolage Grotesque được self-host trong thư mục `src/lib/brand/fonts/`. Vite đóng gói vào `/assets/`. Chữ thường dùng font hệ thống `ui-sans-serif, system-ui, sans-serif`, không tải thêm font.

- Chỉ có hai bộ ký tự: latin và tiếng Việt.
- Không thêm link Google Fonts. `scripts/check-seo.mjs` sẽ fail nếu HTML của `/` chứa `fonts.googleapis.com`.
- Cần thêm một độ đậm thì tải cả hai file woff2 (latin và tiếng Việt) rồi thêm `@font-face` tương ứng.

## Bố cục

- Khung nội dung `.lp-wrap`: rộng tối đa 1280px, lề ngang `clamp(20px, 5vw, 48px)`.
- Khoảng cách dọc của section `.lp-section`: `clamp(64px, 8vw, 112px)`. Dải chip và dải Lightroom dùng `clamp(56px, 7vw, 96px)`.
- Bố cục hai cột dùng flex-wrap với flex-basis, không cần media query. Khi màn hình hẹp, hai cột tự xếp chồng.

Nền các section xen kẽ theo thứ tự: hồng nhạt (hero), trắng (các bước), hồng nhạt (chip), trắng (ảnh và lợi ích), tối (Lightroom), trắng (giá và FAQ).

## Bo góc và đổ bóng

Bo góc:

- **999px**: nút, chip, badge.
- **32px**: khối lớn như khung minh hoạ, ảnh lớn, thẻ giá.
- **24px**: thẻ bước.
- **20–22px**: thẻ nhỏ, ô FAQ.
- **12–14px**: ô ảnh trong điện thoại, ô nhập, ô icon.

Đổ bóng:

- Thẻ nổi ở hero: `0 18px 40px rgb(13 21 48 / .12–.2)`.
- Điện thoại ở hero: `0 30px 70px rgb(13 21 48 / .22)`.
- Thẻ trong khung minh hoạ: `0 10px 30px rgb(0 0 0 / .06)`.

## Thành phần

| Thành phần | Class hoặc file | Ghi chú |
| --- | --- | --- |
| Logo | `src/components/ui/lumipic-logo.tsx` | Hai tấm ảnh nghiêng thành trái tim. Biểu tượng dùng `currentColor`, tức màu nhấn. Cỡ 40px ở header, 30px ở footer. |
| CTA chính | `.lp-cta` | Nền màu nhấn |
| CTA phụ | `.lp-cta-ghost` | Nền trắng, có viền |
| Nút header | `.lp-nav-link`, `.lp-nav-cta` | CTA header dùng nền mực |
| Badge | `.lp-eyebrow`, `.lp-count`, `.lp-chip`, `.lp-photo-badge` | Đều là `Badge` của shadcn |
| Tim | `.lp-heart` | `data-on="true"` khi đã chọn |
| Thẻ | `.lp-card`, `.lp-float-card`, `.lp-toast` | |
| Điện thoại | `.lp-phone`, `.lp-mini-phone` | Bản ở hero bấm chọn được; bản ở bước 2 tự chạy |
| FAQ | `Accordion` + `.lp-faq-item` | Giữ `forceMount` để câu trả lời có trong HTML prerender |

Mọi nút cao tối thiểu 44px.

### Style lại component shadcn

Truyền `variant={null} size={null}` để bỏ style của biến thể, rồi thêm class `lp-…`.

Viết selector dạng `.landing-page .lp-…`. Hai class thắng một utility của Tailwind, nên không phụ thuộc thứ tự nạp CSS. Hover cũng phải viết rõ: `.landing-page .lp-…:hover`.

`Button` dùng chung có `outline-none`. Trang landing tự thêm viền focus cho mọi phần tử qua `.landing-page :focus-visible`.

## Chuyển động

- **Chữ xoay ở hero** (`RotatingWord`): đổi từ mỗi 2,5 giây và mờ dần trong 0,3 giây cuối.
- **Thẻ nổi**: lơ lửng theo chu kỳ 6 giây, mỗi thẻ lệch pha một chút.
- **Ba bước** (`useStepsAutoplay`): cứ 100ms tăng một nhịp. Mỗi bước chạy 5 giây rồi giữ khung cuối 1 giây. Giá trị `progress` từ 0 đến 1 điều khiển từng khung minh hoạ.
- **Easing**: `ease` cho mờ và trượt. `cubic-bezier(.34, 1.56, .64, 1)` cho hiệu ứng nảy như tim và ảnh nhỏ.

Khi người dùng bật giảm chuyển động (`prefers-reduced-motion`), chữ không xoay, thẻ không lơ lửng, con trỏ không nháy, và phần ba bước dừng ở khung đã hoàn tất. Chuyển động mới phải được thêm vào khối `@media (prefers-reduced-motion: reduce)` cuối file CSS.

### Giữ đúng HTML prerender

Trang `/` được render sẵn lúc build rồi hydrate trên trình duyệt. Lần render đầu phải giống hệt HTML đó:

- State ban đầu cố định: từ đầu tiên, bước 0, tim ở ảnh 1 và 4.
- Chỉ gọi `matchMedia` và `setInterval` trong `useEffect`.
- Không dùng `Date.now()` hay số ngẫu nhiên cho state ban đầu.

## Responsive

| Độ rộng | Thay đổi |
| --- | --- |
| ≤ 1240px | Thẻ nổi thu còn 85% và dời xuống cạnh điện thoại |
| ≤ 860px | Ẩn thẻ nổi |
| < 768px | Link điều hướng gom vào nút menu |
| < 640px | Header gọn lại: logo 32px, CTA 13px |

Kiểm tra ở 360px: trang không được cuộn ngang.

## Hình ảnh

- Chỉ dùng 4 ảnh trong `photos.ts`. Không dùng ảnh stock.
- Ảnh trang trí để `alt=""`. Ảnh mang nội dung, như ảnh lớn ở phần lợi ích, dùng alt từ `photos.ts`.
- Luôn ghi `width="640" height="960"` để trang không nhảy khi ảnh tải. Ảnh ở hero tải ngay, ảnh còn lại `loading="lazy"`.
- Ảnh gốc chỉ rộng 640px nên hơi mềm khi hiển thị lớn trên màn hình retina. Muốn sắc nét cần bản 1280px.

Các ảnh được chọn phải khớp nhau ở ba chỗ: ảnh 1, 2 và 4 được thả tim, ảnh 3 bị bỏ. Ba chỗ đó là `ClientPickStage`, `RawFilterStage` và `LightroomBand`. Đổi một chỗ thì đổi cả ba.

## Ràng buộc SEO

`scripts/check-seo.mjs` và `scripts/seo-html.mjs` kiểm tra những điều sau. Đổi thiết kế cũng không được phá:

- Chỉ một thẻ h1, nằm ở hero.
- Câu trả lời FAQ giữ nguyên từng chữ.
- Có đủ link `#how-it-works`, `#features`, `#pricing`, `/dashboard/sign-in` và 4 link hướng dẫn (khối `RelatedGuides`).
- CTA chứa "Bắt đầu", "Dashboard" hay "Demo" phải là `<a>`, không phải `<button>`.
- Không nạp Google Fonts.

## Thêm một section mới

1. Tạo component trong `components/`, mỗi component một file.
2. Bọc nội dung bằng `.lp-wrap` và `.lp-section`. Section có nền màu thì bọc thêm một lớp `lp-soft` hoặc `lp-dark` bên ngoài.
3. Chỉ dùng token `--lp-*` và primitive của shadcn.
4. Có chuyển động thì thêm bản tắt vào khối giảm chuyển động.
5. Chạy `npm run build && npm run test:seo`, rồi kiểm tra trang ở 360px.
