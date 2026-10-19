import { RelatedGuides } from "../../components/RelatedGuides";
import { type FC } from 'react';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { EventTypesSection } from './components/EventTypesSection';
import { FeaturesSection } from './components/FeaturesSection';
import { LightroomBand } from './components/LightroomBand';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { LandingFooter } from './components/LandingFooter';
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
  const startHref = isAuthenticated ? "/dashboard" : "/dashboard/sign-in";

  return (
    <div className="landing-page flex-1 flex flex-col">
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
        <EventTypesSection />
        <FeaturesSection />
        <LightroomBand />
        <section className="lp-wrap lp-section lp-pricing-faq">
          <PricingSection startHref={startHref} />
          <FAQSection />
        </section>
        <div className="lp-wrap lp-guides"><RelatedGuides /></div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
