import { lazy, Suspense } from "react";
import { useRouterState } from "@tanstack/react-router";
import type { ViewRole } from "./app.types";
import { AppShell } from "./components/AppShell";
import { GlobalLoadingIndicator } from "./components/GlobalLoadingIndicator";
import { useAppController } from "./hooks/useAppController";

const LandingPage = lazy(() => import("@/features/landing/pages/LandingPage"));
const GuestAlbumPage = lazy(
  () => import("@/features/guest/pages/GuestAlbumPage"),
);
const PhotographerView = lazy(() =>
  import("@/features/photographer/components/PhotographerView").then(
    (module) => ({ default: module.PhotographerView }),
  ),
);

interface AppProps {
  currentRole: ViewRole;
  selectedAlbumId?: string;
  isDetailView?: boolean;
}

export function App({
  currentRole,
  selectedAlbumId = "",
  isDetailView = false,
}: AppProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const app = useAppController({
    pathname,
    currentRole,
    selectedAlbumId,
    isDetailView,
  });

  const pagePending =
    currentRole === "guest"
      ? app.pending.guest
      : currentRole === "photographer" &&
        (app.pending.owner || app.pending.albums);

  return (
    <AppShell>
      <Suspense fallback={<GlobalLoadingIndicator />}>
        {pagePending && <GlobalLoadingIndicator />}
        {/* Keep pages mounted so loading a new photo filter preserves their state. */}
        <div className={pagePending ? "hidden" : "contents"}>
          {currentRole === "landing" ? (
            <LandingPage
              onLogout={app.actions.logout}
              isAuthenticated={Boolean(app.profile.id)}
              isAuthPending={app.pending.owner}
              userName={app.profile.name || undefined}
              userEmail={app.profile.email || undefined}
              avatarUrl={app.profile.avatarUrl || undefined}
            />
          ) : currentRole === "guest" ? (
            app.pending.guest ? (
              null
            ) : app.album ? (
              <GuestAlbumPage
                album={app.album}
                photos={app.photos}
                hasMorePhotos={app.hasMorePhotos}
                loadingMorePhotos={app.loadingMorePhotos}
                onLoadMorePhotos={app.loadMorePhotos}
                guestVerified={app.verified}
                readOnly={app.guestReadOnly}
                onVerified={() => {}}
                onExitGuestView={app.actions.exitGuest}
              />
            ) : (
              <p className="p-12 text-center">
                Không thể mở album. Kiểm tra lại liên kết hoặc liên hệ nhiếp ảnh
                gia.
              </p>
            )
          ) : (
            <PhotographerView app={app} isDetailView={isDetailView} />
          )}
        </div>
      </Suspense>
    </AppShell>
  );
}
export default App;
