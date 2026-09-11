import { FC, useState, FormEvent } from 'react';
import { Album } from '@/types';
import { Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
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
  const [inputPasscode, setInputPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!inputPasscode.trim()) {
      setError('Vui lòng nhập mật khẩu được cấp.');
      return;
    }

    if (inputPasscode.trim() === album.passcode) {
      onVerified();
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setError('Bạn đã nhập sai 5 lần. Tạm khóa thử lại theo chính sách bảo mật (plan.md).');
      } else {
        setError(`Mật khẩu không chính xác. Bạn còn ${5 - nextAttempts} lần thử.`);
      }
    }
  };

  const handleQuickFill = () => {
    setInputPasscode(album.passcode);
    setError(null);
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
            Vui lòng nhập mã mật khẩu 4 chữ số do nhiếp ảnh gia cung cấp để mở xem ảnh và thả tim.
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
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputPasscode}
              onChange={(e) => setInputPasscode(e.target.value)}
              placeholder="Nhập mật khẩu (VD: 1234)"
              maxLength={8}
              disabled={attempts >= 5}
              autoFocus
              className="h-16 text-center text-2xl tracking-widest font-mono font-black py-4 px-4 rounded-2xl border-2 border-stone-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 placeholder:text-stone-300 placeholder:tracking-normal placeholder:font-sans placeholder:text-base"
            />
          </div>

          <Button
            type="submit"
            disabled={attempts >= 5}
            variant="brand"
            size="lg"
            className="w-full h-12 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-brand-600/25 gap-2"
          >
            <span>Mở Xem Album & Thả Tim</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Quick Demo Hint */}
        <div className="pt-2 border-t border-stone-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleQuickFill}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Điền nhanh mật khẩu mẫu ({album.passcode})</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default GuestPasscodeModal;
