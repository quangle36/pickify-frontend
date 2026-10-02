import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/api/errors";
import {
  useAuthConfigQuery,
  useOwnerQuery,
} from "@/features/auth/queries/auth.queries";
import { GoogleMark } from "./GoogleMark";
import { EmailAuthForm } from "./EmailAuthForm";
import { useEmailAuthMutation } from "../queries/auth.mutations";

export type AuthMode = "sign-in" | "sign-up";

interface AuthScreenProps {
  mode: AuthMode;
}

const content = {
  "sign-in": {
    eyebrow: null,
    title: "Tiếp tục với những khoảnh khắc đẹp.",
    description:
      "Đăng nhập để quản lý album, theo dõi ảnh khách đã chọn và xuất danh sách cho Lightroom.",
    action: "Đăng nhập với Google",
    alternateText: "Chưa có tài khoản?",
    alternateAction: "Tạo tài khoản miễn phí",
    alternateTo: "/dashboard/sign-up" as const,
  },
  "sign-up": {
    eyebrow: "Bắt đầu với Pickify",
    title: "Trao ảnh tinh tế. Chốt lựa chọn nhanh hơn.",
    description:
      "Tạo không gian làm việc cho studio và biến mỗi album Drive thành trải nghiệm chọn ảnh thật dễ chịu.",
    action: "Đăng ký với Google",
    alternateText: "Đã có tài khoản?",
    alternateAction: "Đăng nhập",
    alternateTo: "/dashboard/sign-in" as const,
  },
} satisfies Record<AuthMode, object>;

export function AuthScreen({ mode }: AuthScreenProps) {
  const copy = content[mode];
  const navigate = useNavigate();
  const owner = useOwnerQuery(true);
  const authConfig = useAuthConfigQuery();
  const [isStarting, setIsStarting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const emailAuth = useEmailAuthMutation(mode);
  const busy = isStarting || emailAuth.isPending || owner.isPending;

  const continueWithEmail = async (input: {
    email: string;
    password: string;
    name?: string;
  }) => {
    setAuthError(null);
    try {
      await emailAuth.mutateAsync(input);
      await navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      setAuthError(errorMessage(error));
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = `${mode === "sign-in" ? "Đăng nhập" : "Đăng ký"} — Pickify`;
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.append(robots);
    }
    robots.content = "noindex,nofollow";
  }, [mode]);

  useEffect(() => {
    if (!owner.isPending && owner.data?.id) {
      void navigate({ to: "/dashboard", replace: true });
    }
  }, [navigate, owner.data?.id, owner.isPending]);

  const continueWithGoogle = async () => {
    setIsStarting(true);
    setAuthError(null);
    try {
      const auth = await authConfig();
      if (!auth.googleLoginEnabled) {
        throw new Error(
          "Đăng nhập Google chưa được cấu hình trên máy chủ. Vui lòng thử lại sau.",
        );
      }
      window.location.assign("/api/auth/google/start?destination=dashboard");
    } catch (error) {
      setAuthError(errorMessage(error));
      setIsStarting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4ef] text-stone-900">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#a8a29e_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute -left-44 -top-44 h-[34rem] w-[34rem] rounded-full bg-rose-200/50 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col px-5 sm:px-8 lg:px-12">
        <header className="flex h-20 items-center justify-between sm:h-24">
          <Link
            to="/"
            aria-label="Pickify — về trang chủ"
            className="group flex items-center gap-2.5"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-stone-900 text-white shadow-lg shadow-stone-900/15 transition-all duration-200 group-hover:-rotate-6">
              <Heart className="h-[18px] w-[18px] fill-white" />
            </span>
            <span className="text-xl font-extrabold tracking-[-0.04em]">
              Pickify
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-[40px] items-center gap-2 px-2.5 py-1 text-sm font-bold text-stone-700 transition-colors hover:text-stone-950"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Về trang chủ</span>
          </Link>
        </header>

        <div className="my-auto py-8">
          <div className="mx-auto w-full max-w-[480px] rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-10 shadow-xl shadow-stone-900/5 animate-fade-in">
            {/* Khối 2: Tiêu đề & Giới thiệu */}
            <div className="mb-8">
              {copy.eyebrow && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-rose-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  {copy.eyebrow}
                </div>
              )}
              <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-stone-950 sm:text-4xl">
                {copy.title}
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-stone-600">
                {copy.description}
              </p>
            </div>

            {/* Khối 4: Form Email & Mật khẩu (Hoán đổi lên trước theo yêu cầu) */}
            <EmailAuthForm
              key={mode}
              mode={mode}
              disabled={busy}
              pending={emailAuth.isPending}
              onSubmit={continueWithEmail}
            />

            {/* Vạch ngăn cách */}
            <div className="my-6 flex items-center gap-4 text-xs font-semibold text-stone-600">
              <span className="h-px flex-1 bg-stone-200" />
              <span>hoặc {mode === "sign-in" ? "đăng nhập" : "đăng ký"} với Google</span>
              <span className="h-px flex-1 bg-stone-200" />
            </div>

            {/* Khối 3: Nút Google (Hoán đổi xuống dưới Form Email) */}
            <Button
              type="button"
              onClick={continueWithGoogle}
              disabled={busy}
              variant="outline"
              className="h-12 w-full justify-between rounded-xl border-stone-300 bg-white px-5 text-sm font-semibold text-stone-900 hover:bg-stone-100 transition-all shadow-sm active:scale-[0.99]"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white">
                  <GoogleMark />
                </span>
                <span>{isStarting ? "Đang chuyển đến Google…" : copy.action}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-stone-500" />
            </Button>

            {authError ? (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700"
              >
                {authError}
              </p>
            ) : null}

            {/* Khối 5: Chuyển đổi tài khoản & Điều khoản */}
            <div className="mt-8 border-t border-stone-100 pt-6 text-center">
              <p className="text-sm text-stone-700">
                {copy.alternateText}{" "}
                <Link
                  to={copy.alternateTo}
                  className="font-extrabold text-stone-950 underline decoration-stone-400 decoration-2 underline-offset-4 hover:decoration-stone-900 transition-colors"
                >
                  {copy.alternateAction}
                </Link>
              </p>

              <p className="mt-6 text-xs leading-relaxed text-stone-600">
                Bằng cách tiếp tục, bạn đồng ý với{" "}
                <Link
                  to="/terms"
                  className="font-semibold text-stone-700 hover:text-stone-950 underline"
                >
                  Điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link
                  to="/privacy"
                  className="font-semibold text-stone-700 hover:text-stone-950 underline"
                >
                  Chính sách quyền riêng tư
                </Link>{" "}
                của Pickify.
              </p>
            </div>
          </div>
        </div>

        <footer className="pb-6 text-center text-xs text-stone-600">
          Pickify &copy; 2026. Nền tảng chọn ảnh số 1 cho photographer.
        </footer>
      </div>
    </main>
  );
}
