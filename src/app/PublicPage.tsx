import DriveTroubleshootingGuidePage from "@/features/landing/pages/DriveTroubleshootingGuidePage";
import PhoneSelectionGuidePage from "@/features/landing/pages/PhoneSelectionGuidePage";
import RawFilterGuidePage from "@/features/landing/pages/RawFilterGuidePage";
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
      : pathname === "/huong-dan/loc-anh-raw" ? <RawFilterGuidePage />
      : pathname === "/huong-dan/chon-anh-tren-dien-thoai" ? <PhoneSelectionGuidePage />
      : pathname === "/huong-dan/loi-google-drive" ? <DriveTroubleshootingGuidePage />
      : pathname === "/privacy" ? <PrivacyPage />
      : pathname === "/terms" ? <TermsPage /> : <NotFoundPage />}
  </AppShell></ApiQueryProvider>;
}
