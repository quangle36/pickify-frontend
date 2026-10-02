import { FC } from "react";
import { Heart } from "lucide-react";
import { Button } from '@/components/ui/button';

interface LandingFooterProps {
  onGoToDashboard: () => void;
  onOpenGuestDemo: () => void;
}

export const LandingFooter: FC<LandingFooterProps> = ({
  onGoToDashboard,
  onOpenGuestDemo,
}) => {
  return (
    <footer className="border-t border-stone-200/80 bg-white py-8">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-neutral-900 grid place-items-center text-white">
            <Heart className="w-3 h-3 fill-white" />
          </div>
          <span className="text-sm font-bold text-stone-900">Pickify</span>
          <span className="text-xs text-stone-400">© 2026</span>
        </div>

        <div className="flex items-center gap-5 text-xs text-stone-500">
          <Button
            variant="ghost"
            type="button"
            onClick={onGoToDashboard}
            className="rounded-full text-xs font-normal text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            type="button"
            onClick={onOpenGuestDemo}
            className="rounded-full text-xs font-normal text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          >
            Demo
          </Button>
        </div>
      </div>
    </footer>
  );
};
export default LandingFooter;
