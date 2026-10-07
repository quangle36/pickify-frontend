import { RelatedGuides } from "../../components/RelatedGuides";
import { FC } from 'react';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FeaturesSection } from './components/FeaturesSection';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { LandingFooter } from './components/LandingFooter';
import { ScrollReveal } from './components/ScrollReveal';
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
    <div className="landing-page flex-1 flex flex-col bg-white text-neutral-900">
      <LandingNavbar
        onLogout={onLogout}
        isAuthenticated={isAuthenticated}
        isAuthPending={isAuthPending}
        userName={userName}
        userEmail={userEmail}
        avatarUrl={avatarUrl}
      />
      <main className="flex-1">
        <ScrollReveal>
          <HeroSection startHref={startHref} />
        </ScrollReveal>
        <ScrollReveal>
          <HowItWorksSection />
        </ScrollReveal>
        <ScrollReveal>
          <FeaturesSection />
        </ScrollReveal>
        <ScrollReveal>
          <PricingSection startHref={startHref} />
        </ScrollReveal>
        <ScrollReveal>
          <FAQSection />
        </ScrollReveal>
        <div className="mx-auto max-w-5xl px-6 sm:px-8"><RelatedGuides /></div>
      </main>
      <ScrollReveal>
        <LandingFooter />
      </ScrollReveal>
    </div>
  );
};

export default LandingPage;
