import { useEffect } from "react";
import { installImageProtection } from "../utils/imageProtection";

export function useImageProtection(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    return installImageProtection(window);
  }, [enabled]);
}
