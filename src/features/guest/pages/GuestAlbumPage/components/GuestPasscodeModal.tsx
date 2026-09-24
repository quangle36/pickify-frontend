import { FC, useState, FormEvent } from 'react';
import { errorMessage } from "@/api/errors";
import { useGuestVerificationMutation } from "@/features/guest/queries/guest.mutations";
import type { Album } from '@/features/photographer/types/album.types';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GuestPasscodeModalProps {
  album: Album;
  onVerified: () => void;
}

export const GuestPasscodeModal: FC<GuestPasscodeModalProps> = ({
  album,
  onVerified,
}) => {
  const verification = useGuestVerificationMutation(album.shareId);
  const [inputPasscode, setInputPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setPending(true); setError(null);
    try {
      await verification.mutateAsync({
        share: album.shareId,
        password: inputPasscode,
      });
      onVerified();
    }
    catch (error) { setError(errorMessage(error)); }
    finally { setPending(false); }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image Blurred */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="w-full h-full object-cover blur-2xl scale-110"
        />
      </div>

      <Card className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border-stone-200/80 relative z-10 space-y-6 text-center animate-fade-in">
        {/* Heart icon header */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-500 to-rose-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/30">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <Badge variant="secondary" className="font-bold mb-2">
            Album bảo mật
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            {album.title}
          </h2>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            Vui lòng nhập mật khẩu do nhiếp ảnh gia cung cấp để mở xem ảnh và thả tim.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="p-3.5 rounded-2xl text-left">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="ml-2 text-xs font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Passcode Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              value={inputPasscode}
              onChange={(e) => setInputPasscode(e.target.value)}
              placeholder="Nhập mật khẩu (VD: 1234)"
              maxLength={128}
              disabled={pending}
              autoFocus
              className="h-16 text-center text-2xl tracking-widest font-mono font-black py-4 px-4 rounded-2xl border-2 border-stone-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 placeholder:text-stone-300 placeholder:tracking-normal placeholder:font-sans placeholder:text-base"
            />
          </div>

          <Button
            type="submit"
            disabled={pending}
            variant="brand"
            size="lg"
            className="w-full h-12 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-brand-600/25 gap-2"
          >
            <span>Mở Xem Album & Thả Tim</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

      </Card>
    </div>
  );
};
export default GuestPasscodeModal;
