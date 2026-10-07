import { RelatedGuides } from "../../components/RelatedGuides";
import { useRef, type FC } from 'react';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FeaturesSection } from './components/FeaturesSection';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { LandingFooter } from './components/LandingFooter';
import { useLandingMotion } from './hooks/useLandingMotion';
import './LandingPage.css';

interface LandingPageProps {
  onLogout: () => void;
  isAuthenticated: boolean;
  isAuthPending?: boolean;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
}

const LandingPage: FC<LandingPageProps> = ({
  onLogout,
  isAuthenticated,
  isAuthPending,
  userName,
  userEmail,
  avatarUrl,
}) => {
  const root = useRef<HTMLDivElement>(null);
  const activeChapter = useLandingMotion(root);
  const startHref = isAuthenticated ? "/dashboard" : "/dashboard/sign-in";

  return (
    <div ref={root} className="landing-page flex-1 flex flex-col bg-white text-neutral-900">
      <LandingNavbar
        onLogout={onLogout}
        isAuthenticated={isAuthenticated}
        isAuthPending={isAuthPending}
        userName={userName}
        userEmail={userEmail}
        avatarUrl={avatarUrl}
      />
      <main className="flex-1">
        <HeroSection startHref={startHref} />
        <HowItWorksSection />
        <FeaturesSection activeChapter={activeChapter} />
        <PricingSection startHref={startHref} />
        <FAQSection />
        <div className="landing-container landing-guides"><RelatedGuides /></div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
