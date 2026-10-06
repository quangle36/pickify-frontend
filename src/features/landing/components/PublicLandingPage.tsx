import { useEffect, useState } from "react";
import LandingPage from "../pages/LandingPage";
import { useOwnerQuery } from "@/features/auth/queries/auth.queries";
import { useLogoutMutation } from "@/features/auth/queries/auth.mutations";
import { toast } from "@/components/ui/use-toast";
import { errorMessage } from "@/api/errors";

export function PublicLandingPage() {
  // The first browser render matches the anonymous build-time HTML.
  const [mounted, setMounted] = useState(false);
  const owner = useOwnerQuery(mounted);
  const logout = useLogoutMutation();
  const profile = mounted ? owner.data : null;
  useEffect(() => {
    if (owner.error) toast({ variant: "destructive", title: errorMessage(owner.error) });
  }, [owner.error]);
  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(location.search);
    if (params.has("dashboard")) location.replace("/dashboard");
    const authError = params.get("authError");
    if (authError) {
      toast({ variant: "destructive", title: authError === "OAUTH_DENIED" ? "Bạn đã hủy đăng nhập Google. Hãy thử lại khi sẵn sàng." : "Không thể đăng nhập Google. Vui lòng thử lại." });
      params.delete("authError");
      history.replaceState(null, "", `${location.pathname}${params.size ? `?${params}` : ""}${location.hash}`);
    }
  }, []);
  return <LandingPage
    isAuthenticated={Boolean(profile?.id)}
    isAuthPending={mounted && owner.isPending}
    userName={profile?.name}
    userEmail={profile?.email}
    avatarUrl={profile?.avatarUrl}
    onLogout={() => {
      void logout.mutateAsync().then(() => location.assign("/")).catch((error) => toast({ variant: "destructive", title: errorMessage(error) }));
    }}
  />;
}
