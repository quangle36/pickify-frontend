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

const routeTree = rootRoute.addChildren([
  landingRoute,
  dashboardRoute,
  dashboardAlbumRoute,
  guestAlbumRoute,
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
