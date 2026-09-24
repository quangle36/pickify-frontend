import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import SignInPage from "@/features/auth/pages/SignInPage";
import SignUpPage from "@/features/auth/pages/SignUpPage";
import PrivacyPage from "@/features/landing/pages/PrivacyPage";
import TermsPage from "@/features/landing/pages/TermsPage";
import { DashboardAlbumRoute } from "./routes/DashboardAlbumRoute";
import { DashboardRoute } from "./routes/DashboardRoute";
import { GuestAlbumRoute } from "./routes/GuestAlbumRoute";
import { LandingRoute } from "./routes/LandingRoute";
import { RootLayout } from "./routes/RootLayout";

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
