import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/api/errors";
import {
  useAuthConfigQuery,
  useOwnerQuery,
} from "@/features/auth/queries/auth.queries";
import { GoogleMark } from "./GoogleMark";
import { ProductPreview } from "./ProductPreview";

export type AuthMode = "sign-in" | "sign-up";

interface AuthScreenProps {
  mode: AuthMode;
}

const content = {
  "sign-in": {
    eyebrow: "Chào mừng bạn trở lại",
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
          <Link to="/" aria-label="Pickify — về trang chủ" className="group flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-stone-900 text-white shadow-lg shadow-stone-900/15 transition-transform group-hover:-rotate-6">
              <Heart className="h-[18px] w-[18px] fill-white" />
            </span>
            <span className="text-xl font-extrabold tracking-[-0.04em]">Pickify</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-bold text-stone-500 transition-colors hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Về trang chủ</span>
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-12 pb-12 pt-4 lg:grid-cols-[minmax(0,0.84fr)_minmax(480px,1.16fr)] lg:gap-20 lg:pb-20">
          <section className="mx-auto w-full max-w-[480px] animate-fade-in lg:mx-0 lg:pl-7">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-rose-700">
              <Sparkles className="h-3.5 w-3.5" />
              {copy.eyebrow}
            </div>
            <h1 className="max-w-md text-[2.55rem] font-extrabold leading-[1.08] tracking-[-0.055em] text-stone-950 sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-stone-600">
              {copy.description}
            </p>

            <div className="mt-9 rounded-[1.75rem] border border-white/90 bg-white/75 p-3 shadow-[0_24px_70px_-38px_rgba(41,37,36,0.45)] backdrop-blur-md">
              <Button
                type="button"
                onClick={continueWithGoogle}
                disabled={isStarting || owner.isPending}
                className="h-14 w-full justify-between rounded-[1.15rem] bg-stone-950 px-5 text-[15px] font-bold text-white shadow-xl shadow-stone-900/15 hover:bg-stone-800"
              >
                <span className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white">
                    <GoogleMark />
                  </span>
                  {isStarting ? "Đang chuyển đến Google…" : copy.action}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {authError ? (
              <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {authError}
              </p>
            ) : null}

            <p className="mt-6 text-sm text-stone-500">
              {copy.alternateText}{" "}
              <Link to={copy.alternateTo} className="font-extrabold text-stone-900 underline decoration-rose-300 decoration-2 underline-offset-4 hover:text-rose-600">
                {copy.alternateAction}
              </Link>
            </p>

            <p className="mt-8 max-w-md text-xs leading-5 text-stone-400">
              Bằng cách tiếp tục, bạn đồng ý với{" "}
              <Link to="/terms" className="font-semibold text-stone-600 hover:text-stone-900">Điều khoản sử dụng</Link>{" "}
              và{" "}
              <Link to="/privacy" className="font-semibold text-stone-600 hover:text-stone-900">Chính sách quyền riêng tư</Link>{" "}
              của Pickify.
            </p>
          </section>

          <section className="relative hidden min-h-[620px] items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/80 bg-[linear-gradient(145deg,#282421_0%,#403731_50%,#6f4b43_100%)] px-12 shadow-[0_40px_100px_-50px_rgba(28,25,23,0.65)] lg:flex">
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(120deg,transparent_45%,rgba(255,255,255,.25)_50%,transparent_55%)]" />
            <div className="absolute left-10 top-10 max-w-sm text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-300">Dành cho photographer & studio</p>
              <p className="mt-3 text-2xl font-extrabold leading-tight tracking-[-0.035em]">Một quy trình chọn ảnh mà khách hàng thực sự muốn dùng.</p>
            </div>
            <div className="mt-24 w-full">
              <ProductPreview />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
