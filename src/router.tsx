import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import App from "./App";

function RootLayout() {
  return <Outlet />;
}

function LandingRoute() {
  return <App currentRole="landing" />;
}

function DashboardRoute() {
  return <App currentRole="photographer" />;
}

function DashboardAlbumRoute() {
  const { albumId } = dashboardAlbumRoute.useParams();
  return (
    <App currentRole="photographer" selectedAlbumId={albumId} isDetailView />
  );
}

function GuestAlbumRoute() {
  return <App currentRole="guest" />;
}

function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-700">
      <a className="text-sm font-medium text-indigo-600 hover:underline" href="/">
        ← Pickify
      </a>
      <h1 className="mt-6 text-3xl font-bold text-slate-950">{title}</h1>
      <div className="mt-8 space-y-5 leading-7">{children}</div>
    </main>
  );
}

function PrivacyRoute() {
  return (
    <LegalPage title="Chính sách quyền riêng tư">
      <p>Pickify dùng thông tin tài khoản Google để xác thực người dùng và chỉ truy cập các thư mục Google Drive mà người dùng chủ động kết nối.</p>
      <p>Dữ liệu ảnh được xử lý để tạo album và bản xem trước. Thông tin xác thực được mã hóa khi lưu trữ và không được bán cho bên thứ ba.</p>
      <p>Người dùng có thể thu hồi quyền truy cập trong phần bảo mật của Tài khoản Google và yêu cầu xóa dữ liệu qua email mqevoto@gmail.com.</p>
    </LegalPage>
  );
}

function TermsRoute() {
  return (
    <LegalPage title="Điều khoản sử dụng">
      <p>Người dùng chịu trách nhiệm về quyền sử dụng và chia sẻ nội dung được đưa vào Pickify.</p>
      <p>Dịch vụ được cung cấp theo khả năng hiện có. Pickify có thể giới hạn hoặc ngừng quyền truy cập khi phát hiện hành vi lạm dụng hay vi phạm pháp luật.</p>
      <p>Liên hệ về điều khoản sử dụng: mqevoto@gmail.com.</p>
    </LegalPage>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingRoute,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardRoute,
});

const dashboardAlbumRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/album/$albumId",
  component: DashboardAlbumRoute,
});

const guestAlbumRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/album/$shareId",
  component: GuestAlbumRoute,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyRoute,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsRoute,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  dashboardRoute,
  dashboardAlbumRoute,
  guestAlbumRoute,
  privacyRoute,
  termsRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
