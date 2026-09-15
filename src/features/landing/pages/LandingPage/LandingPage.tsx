import { FC } from 'react';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { ProblemSolution } from './components/ProblemSolution';
import { InteractivePreview } from './components/InteractivePreview';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { LandingFooter } from './components/LandingFooter';

interface LandingPageProps {
  onGoToDashboard: () => void;
  onLogin: () => void;
  userName?: string;
  onOpenGuestDemo: () => void;
}

const LandingPage: FC<LandingPageProps> = ({
  onGoToDashboard,
  onOpenGuestDemo,
  onLogin,
  userName,
}) => {
  return (
    <div className="flex-1 flex flex-col">
      <LandingNavbar onGoToDashboard={onGoToDashboard} onLogin={onLogin} userName={userName} />
      <main className="flex-1">
        <HeroSection
          onStartDashboard={onGoToDashboard}
          onOpenGuestDemo={onOpenGuestDemo}
        />
        <ProblemSolution />
        <InteractivePreview
          onOpenGuestDemo={onOpenGuestDemo}
          onGoToDashboard={onGoToDashboard}
        />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection onStartDashboard={onGoToDashboard} />
        <FAQSection />
      </main>
      <LandingFooter
        onGoToDashboard={onGoToDashboard}
        onOpenGuestDemo={onOpenGuestDemo}
      />
    </div>
  );
};

export default LandingPage;
