import { useCallback, useState, type ReactNode } from "react";
import { GlobalLoadingContext } from "../globalLoading";
import { GlobalLoadingOverlay } from "../components/GlobalLoadingOverlay";

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [pendingCount, setPendingCount] = useState(0);
  const register = useCallback(() => {
    setPendingCount((count) => count + 1);
    return () => setPendingCount((count) => count - 1);
  }, []);

  return (
    <GlobalLoadingContext.Provider value={register}>
      {children}
      {/* One host survives auth, Suspense, and data-loading handoffs. */}
      {pendingCount > 0 && <GlobalLoadingOverlay />}
    </GlobalLoadingContext.Provider>
  );
}
