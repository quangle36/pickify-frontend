import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { AuthMode } from "./AuthScreen";

interface EmailAuthFormProps {
  mode: AuthMode;
  disabled: boolean;
  pending: boolean;
  onSubmit: (input: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void>;
}

export function EmailAuthForm({
  mode,
  disabled,
  pending,
  onSubmit,
}: EmailAuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const signup = mode === "sign-up";

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Khôi phục mật khẩu",
      description:
        "Tính năng tự thiết lập lại mật khẩu qua email đang được hoàn thiện. Vui lòng đăng nhập nhanh bằng tài khoản Google liên kết.",
    });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) return;
    if (signup && password !== confirmation) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setError("");
    await onSubmit({
      email: email.trim(),
      password,
      ...(signup ? { name: name.trim() } : {}),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {signup && (
        <div className="space-y-1.5">
          <Label htmlFor="auth-name" className="text-sm font-semibold text-stone-900">
            Tên của bạn
          </Label>
          <Input
            id="auth-name"
            name="name"
            autoComplete="name"
            placeholder="Nhập họ và tên"
            required
            maxLength={120}
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={disabled}
            className="h-12 rounded-xl border-stone-300 bg-white text-stone-900 shadow-sm focus-visible:border-stone-900 focus-visible:ring-stone-900/10"
          />
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="auth-email" className="text-sm font-semibold text-stone-900">
          Email
        </Label>
        <Input
          id="auth-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Nhập email"
          required
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={disabled}
          className="h-12 rounded-xl border-stone-300 bg-white text-stone-900 shadow-sm focus-visible:border-stone-900 focus-visible:ring-stone-900/10"
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="auth-password" className="text-sm font-semibold text-stone-900">
            Mật khẩu
          </Label>
          {!signup && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="inline-flex items-center min-h-[36px] py-1 text-xs font-bold text-stone-600 hover:text-stone-950 transition-colors"
            >
              Quên mật khẩu?
            </button>
          )}
        </div>
        <div className="relative flex items-center">
          <Input
            id="auth-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={signup ? "new-password" : "current-password"}
            placeholder={signup ? "Tạo mật khẩu" : "Nhập mật khẩu"}
            required
            minLength={signup ? 8 : 1}
            maxLength={128}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={disabled}
            aria-describedby={signup ? "password-help" : undefined}
            className="h-12 pr-11 rounded-xl border-stone-300 bg-white text-stone-900 shadow-sm focus-visible:border-stone-900 focus-visible:ring-stone-900/10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 min-h-[36px] min-w-[36px] flex items-center justify-center p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {signup && (
          <p id="password-help" className="text-xs text-stone-500">
            Tối thiểu 8 ký tự.
          </p>
        )}
      </div>
      {signup && (
        <div className="space-y-1.5">
          <Label htmlFor="auth-confirmation" className="text-sm font-semibold text-stone-900">
            Xác nhận mật khẩu
          </Label>
          <div className="relative flex items-center">
            <Input
              id="auth-confirmation"
              name="confirmation"
              type={showConfirmation ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              required
              minLength={8}
              maxLength={128}
              value={confirmation}
              onChange={(event) => {
                setConfirmation(event.target.value);
                setError("");
              }}
              disabled={disabled}
              className="h-12 pr-11 rounded-xl border-stone-300 bg-white text-stone-900 shadow-sm focus-visible:border-stone-900 focus-visible:ring-stone-900/10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmation((prev) => !prev)}
              className="absolute right-2 min-h-[36px] min-w-[36px] flex items-center justify-center p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
              aria-label={showConfirmation ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showConfirmation ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <Button
        type="submit"
        disabled={disabled}
        className="h-12 w-full rounded-xl bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-all shadow-sm active:scale-[0.99]"
      >
        {pending ? "Đang xử lý…" : signup ? "Tạo tài khoản" : "Đăng nhập"}
      </Button>
    </form>
  );
}
