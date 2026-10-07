import DriveTroubleshootingGuidePage from "@/features/landing/pages/DriveTroubleshootingGuidePage";
import PhoneSelectionGuidePage from "@/features/landing/pages/PhoneSelectionGuidePage";
import RawFilterGuidePage from "@/features/landing/pages/RawFilterGuidePage";
import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import DriveSelectionGuidePage from "@/features/landing/pages/DriveSelectionGuidePage";
import SignInPage from "@/features/auth/pages/SignInPage";
import SignUpPage from "@/features/auth/pages/SignUpPage";
import PrivacyPage from "@/features/landing/pages/PrivacyPage";
import TermsPage from "@/features/landing/pages/TermsPage";
import NotFoundPage from "@/features/landing/pages/NotFoundPage";
import { DashboardAlbumRoute } from "./routes/DashboardAlbumRoute";
import { DashboardRoute } from "./routes/DashboardRoute";
import { GuestAlbumRoute } from "./routes/GuestAlbumRoute";
import { LandingRoute } from "./routes/LandingRoute";
import { RootLayout } from "./routes/RootLayout";

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

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

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/sign-in",
  component: SignInPage,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/sign-up",
  component: SignUpPage,
});

const guestAlbumRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/album/$shareId",
  component: GuestAlbumRoute,
});

const guideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/huong-dan/gui-anh-google-drive",
  component: DriveSelectionGuidePage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  dashboardRoute,
  dashboardAlbumRoute,
  signInRoute,
  signUpRoute,
  guestAlbumRoute,
  createRoute({ getParentRoute: () => rootRoute, path: "/huong-dan/loc-anh-raw", component: RawFilterGuidePage }),
  createRoute({ getParentRoute: () => rootRoute, path: "/huong-dan/chon-anh-tren-dien-thoai", component: PhoneSelectionGuidePage }),
  createRoute({ getParentRoute: () => rootRoute, path: "/huong-dan/loi-google-drive", component: DriveTroubleshootingGuidePage }),
  guideRoute,
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
