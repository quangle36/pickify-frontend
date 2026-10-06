import DriveSelectionGuidePage from "@/features/landing/pages/DriveSelectionGuidePage";
import { ApiQueryProvider } from "./providers/ApiQueryProvider";
import { AppShell } from "./components/AppShell";
import { PublicLandingPage } from "@/features/landing/components/PublicLandingPage";
import PrivacyPage from "@/features/landing/pages/PrivacyPage";
import TermsPage from "@/features/landing/pages/TermsPage";
import NotFoundPage from "@/features/landing/pages/NotFoundPage";

export function PublicPage({ pathname }: { pathname: string }) {
  return <ApiQueryProvider><AppShell>
    {pathname === "/" ? <PublicLandingPage />
      : pathname === "/huong-dan/gui-anh-google-drive" ? <DriveSelectionGuidePage />
      : pathname === "/privacy" ? <PrivacyPage />
      : pathname === "/terms" ? <TermsPage /> : <NotFoundPage />}
  </AppShell></ApiQueryProvider>;
}
