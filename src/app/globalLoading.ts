import { createContext, useContext } from "react";

export const GlobalLoadingContext = createContext<(() => () => void) | null>(null);

export function useGlobalLoadingRegistration() {
  const register = useContext(GlobalLoadingContext);
  if (!register) {
    throw new Error("GlobalLoadingIndicator requires GlobalLoadingProvider");
  }
  return register;
}
