import { Navigate } from "@tanstack/react-router";
import { useOwnerQuery } from "@/features/auth/queries/auth.queries";
import { GlobalLoadingIndicator } from "../components/GlobalLoadingIndicator";
import App from "../App";

export function DashboardRoute() {
  const owner = useOwnerQuery(true);

  if (owner.isPending) {
    return <GlobalLoadingIndicator />;
  }

  if (owner.isSuccess && owner.data === null) {
    return <Navigate to="/dashboard/sign-in" replace />;
  }

  return <App currentRole="photographer" />;
}
