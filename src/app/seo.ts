export const SITE_ORIGIN = "https://lumipic.space";
export const HOME_TITLE = "Lumipic - Phần mềm hỗ trợ chọn ảnh nhanh từ Google Drive";
export const SOCIAL_IMAGE = `${SITE_ORIGIN}/images/lumipic-social.jpg`;
export const websiteSchema = { "@context": "https://schema.org", "@type": "WebSite", name: "Lumipic", url: `${SITE_ORIGIN}/` };

export const publicPages = {
  "/": {
    title: HOME_TITLE,
    description: "Lumipic giúp nhiếp ảnh gia gửi ảnh từ Google Drive cho khách chọn trên điện thoại, nhận danh sách ảnh cần hậu kì và xuất tên file để lọc trong Lightroom.",
    file: "home.html",
  },
  "/huong-dan/gui-anh-google-drive": {
    title: "Cách gửi ảnh từ Google Drive cho khách chọn - Lumipic",
    description: "Hướng dẫn từng bước tạo album từ Google Drive, gửi link cho khách chọn ảnh, nhận danh sách đã tim và lọc ảnh gốc để hậu kì với Lumipic.",
    file: "gui-anh-google-drive.html",
  },
  "/privacy": {
    title: "Chính sách quyền riêng tư - Lumipic",
    description: "Tìm hiểu cách Lumipic xử lý thông tin tài khoản, dữ liệu ảnh và yêu cầu xóa dữ liệu của người dùng.",
    file: "privacy.html",
  },
  "/terms": {
    title: "Điều khoản sử dụng - Lumipic",
    description: "Điều khoản sử dụng Lumipic và trách nhiệm của người dùng khi chia sẻ nội dung và tạo album ảnh.",
    file: "terms.html",
  },
} as const;

export function getPageSeo(pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const page = publicPages[path as keyof typeof publicPages];
  return page
    ? { ...page, canonical: `${SITE_ORIGIN}${path}`, robots: "index,follow", socialImage: SOCIAL_IMAGE, websiteSchema: path === "/" ? websiteSchema : null }
    : { title: path.startsWith("/dashboard") ? "Dashboard — Lumipic" : "Lumipic", description: "", canonical: null, robots: "noindex,nofollow" };
}
