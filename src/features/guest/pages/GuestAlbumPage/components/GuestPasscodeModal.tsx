import { FC, useId, useState, FormEvent } from 'react';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { errorMessage } from '@/api/errors';
import { useGuestVerificationMutation } from '@/features/guest/queries/guest.mutations';
import type { Album } from '@/features/photographer/types/album.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GuestPasscodeModalProps {
  album: Album;
  onVerified: () => void;
}

export const GuestPasscodeModal: FC<GuestPasscodeModalProps> = ({
  album,
  onVerified,
}) => {
  const verification = useGuestVerificationMutation(album.shareId);
  const passwordId = useId();
  const errorId = `${passwordId}-error`;
  const [inputPasscode, setInputPasscode] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      await verification.mutateAsync({
        share: album.shareId,
        password: inputPasscode,
      });
      onVerified();
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setPending(false);
    }
  };

  return (
    <main
      className="guest-album flex min-h-dvh items-center justify-center bg-background px-8 py-12 text-foreground md:px-6 md:py-14"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="w-full max-w-[360px] md:max-w-[400px]">
        <div className="mb-8 flex items-center gap-2 text-lg font-extrabold md:mb-10">
          <span className="grid size-7 place-items-center rounded-full bg-neutral-900 text-white">
            <Heart className="size-[18px] fill-current" aria-hidden="true" />
          </span>
          <span>Lumipic</span>
        </div>

        <div className="mb-8">
          <h1 className="break-words text-2xl font-bold leading-[1.3] tracking-[-0.6px] md:text-[28px]">
            {album.title || 'Album của bạn'}
          </h1>
          <p className="mt-3 max-w-[38ch] text-pretty text-sm leading-[1.7] text-stone-500">
            Nhập mật khẩu do nhiếp ảnh gia cung cấp để xem ảnh và thả tim.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!album.title && (
            <p className="mb-4 text-xs leading-[1.7] text-stone-500">
              Album chưa có tên. Bạn vẫn có thể mở bằng mật khẩu.
            </p>
          )}
          <Label htmlFor={passwordId} className="mb-2 block w-fit cursor-pointer text-sm font-medium leading-[1.6]">
            Mật khẩu album
          </Label>
          <div className="relative">
            <Input
              id={passwordId}
              type={passwordVisible ? 'text' : 'password'}
              value={inputPasscode}
              onChange={(e) => setInputPasscode(e.target.value)}
              placeholder="Nhập mật khẩu"
              maxLength={128}
              autoComplete="current-password"
              readOnly={pending}
              autoFocus
              aria-invalid={Boolean(error)}
              aria-describedby={errorId}
              className={`h-12 rounded-xl border-stone-300 bg-white py-3 pl-4 pr-12 text-base leading-[1.6] placeholder:text-stone-500 focus-visible:border-brand-600 focus-visible:ring-brand-600/10 md:text-sm ${
                error ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/10' : ''
              }`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setPasswordVisible((visible) => !visible)}
              aria-label={passwordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              aria-pressed={passwordVisible}
              className="absolute inset-y-0 right-1 my-auto size-10 border-0 bg-transparent p-0 text-stone-500 hover:bg-transparent hover:text-foreground"
            >
              {passwordVisible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
            </Button>
          </div>
          <p id={errorId} role="status" aria-live="polite" className="mb-3 mt-2 min-h-9 text-xs leading-4 text-red-600">
            {error}
          </p>
          <Button
            type="submit"
            variant="brand"
            isLoading={pending}
            className="min-h-12 w-full rounded-xl px-4 py-3 text-sm font-semibold"
          >
            Mở album
          </Button>
        </form>

        <p className="mt-5 text-pretty text-xs leading-[1.7] text-stone-500">
          Chưa có mật khẩu? Hỏi nhiếp ảnh gia.
        </p>
      </div>
    </main>
  );
};
export default GuestPasscodeModal;
