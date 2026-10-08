import { lazy, Suspense } from "react";
import { Navigate } from "@tanstack/react-router";
import { useOwnerQuery } from "@/features/auth/queries/auth.queries";
import { Button } from "@/components/ui/button";
import { GlobalLoadingIndicator } from "../components/GlobalLoadingIndicator";
const QuotationPage = lazy(
  () => import("@/features/quotation/pages/QuotationPage/QuotationPage"),
);
export function QuotationRoute() {
  const owner = useOwnerQuery(true);
  if (owner.isPending) return <GlobalLoadingIndicator />;
  if (owner.isError)
    return (
      <main className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="text-xl font-semibold">Không thể tải tài khoản</h1>
        <p className="my-4 text-sm text-stone-500">
          Kiểm tra kết nối và thử lại để mở báo giá của bạn.
        </p>
        <Button variant="outline" onClick={() => void owner.refetch()}>
          Thử lại
        </Button>
      </main>
    );
  if (!owner.data) return <Navigate to="/dashboard/sign-in" replace />;
  return (
    <Suspense fallback={<GlobalLoadingIndicator />}>
      <QuotationPage key={owner.data.id} profile={owner.data} />
    </Suspense>
  );
}
