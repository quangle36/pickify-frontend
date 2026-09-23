import { useRouterState } from "@tanstack/react-router";
import type { ViewRole } from "@/types";
import { useAppController } from "@/hooks/useAppController";
import { AppShell } from "@/components/app/AppShell";
import { PhotographerView } from "@/components/app/PhotographerView";
import LandingPage from "@/features/landing/pages/LandingPage";
import GuestAlbumPage from "@/features/guest/pages/GuestAlbumPage";
import { Skeleton } from "@/components/ui/skeleton";

function GuestAlbumSkeleton() {
  return (
    <div
      role="status"
      aria-label="Đang tải album"
      aria-busy="true"
      className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-24" />
      </div>
      <Skeleton className="h-10 w-2/3" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="aspect-[4/3] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

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
        app.pending.guest ? (
          <GuestAlbumSkeleton />
        ) : app.album ? (
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
