import { useRouterState } from "@tanstack/react-router";
import type { ViewRole } from "@/types";
import { useAppController } from "@/hooks/useAppController";
import { AppShell } from "@/components/app/AppShell";
import { PhotographerView } from "@/components/app/PhotographerView";
import LandingPage from "@/features/landing/pages/LandingPage";
import GuestAlbumPage from "@/features/guest/pages/GuestAlbumPage";

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

  return (
    <AppShell app={app}>
      {currentRole === "landing" ? (
        <LandingPage
          onGoToDashboard={app.actions.dashboard}
          onOpenGuestDemo={app.actions.dashboard}
          onLogin={app.actions.loginHome}
          userName={app.profile.id ? app.profile.name : undefined}
        />
      ) : currentRole === "guest" ? (
        app.album ? (
          <GuestAlbumPage
            album={app.album}
            guestVerified={app.verified}
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
    </AppShell>
  );
}
export default App;
