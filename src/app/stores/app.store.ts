import { create } from "zustand";
import { errorMessage } from "@/api/errors";

interface AppState {
  error: string | null;
  report: (error: unknown) => void;
  clearError: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  error: null,
  report: (error) => set({ error: errorMessage(error) }),
  clearError: () => set({ error: null }),
  reset: () => set({ error: null }),
}));
