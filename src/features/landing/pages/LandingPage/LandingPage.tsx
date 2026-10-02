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
  onGoToDashboard: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onCreateAlbum: () => void;
  isAuthenticated: boolean;
  isAuthPending?: boolean;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  onOpenGuestDemo: () => void;
}

const LandingPage: FC<LandingPageProps> = ({
  onGoToDashboard,
  onOpenGuestDemo,
  onLogin,
  onLogout,
  onCreateAlbum,
  isAuthenticated,
  isAuthPending,
  userName,
  userEmail,
  avatarUrl,
}) => {
  const handleStart = isAuthenticated ? onGoToDashboard : onLogin;

  return (
    <div className="landing-page flex-1 flex flex-col bg-white text-neutral-900">
      <LandingNavbar
        onGoToDashboard={onGoToDashboard}
        onLogin={onLogin}
        onLogout={onLogout}
        onCreateAlbum={onCreateAlbum}
        isAuthenticated={isAuthenticated}
        isAuthPending={isAuthPending}
        userName={userName}
        userEmail={userEmail}
        avatarUrl={avatarUrl}
      />
      <main className="flex-1">
        <ScrollReveal>
          <HeroSection onStartDashboard={handleStart} />
        </ScrollReveal>
        <ScrollReveal>
          <HowItWorksSection />
        </ScrollReveal>
        <ScrollReveal>
          <FeaturesSection />
        </ScrollReveal>
        <ScrollReveal>
          <PricingSection onStartDashboard={handleStart} />
        </ScrollReveal>
        <ScrollReveal>
          <FAQSection />
        </ScrollReveal>
      </main>
      <ScrollReveal>
        <LandingFooter
          onGoToDashboard={onGoToDashboard}
          onOpenGuestDemo={onOpenGuestDemo}
        />
      </ScrollReveal>
    </div>
  );
};

export default LandingPage;
