import { useLayoutEffect } from "react";
import { useGlobalLoadingRegistration } from "../globalLoading";

export function GlobalLoadingIndicator() {
  const register = useGlobalLoadingRegistration();
  // Register before paint. React batches cleanup/setup when loading owners change,
  // keeping the shared overlay mounted and its animation running continuously.
  useLayoutEffect(register, [register]);
  return null;
}
