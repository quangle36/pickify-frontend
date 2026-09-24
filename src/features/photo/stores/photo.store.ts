import { create } from "zustand";
import type { PhotoFilters } from "../types/photo.types";

interface PhotoState {
  filters: Record<string, PhotoFilters>;
  saving: Record<string, boolean>;
  failedSelections: Record<string, boolean>;
  setFilters: (albumId: string, filters: PhotoFilters) => void;
  setSaving: (photoId: string, saving: boolean) => void;
  clearFailedSelection: (photoId: string) => void;
  setFailedSelection: (photoId: string, selected: boolean) => void;
  reset: () => void;
}

const initialState = {
  filters: {},
  saving: {},
  failedSelections: {},
};

export const usePhotoStore = create<PhotoState>((set) => ({
  ...initialState,
  setFilters: (albumId, filters) =>
    set((state) => ({
      filters:
        state.filters[albumId]?.selected === filters.selected &&
        state.filters[albumId]?.search === filters.search
          ? state.filters
          : { ...state.filters, [albumId]: filters },
    })),
  setSaving: (photoId, saving) =>
    set((state) => ({ saving: { ...state.saving, [photoId]: saving } })),
  clearFailedSelection: (photoId) =>
    set((state) => {
      const failedSelections = { ...state.failedSelections };
      delete failedSelections[photoId];
      return { failedSelections };
    }),
  setFailedSelection: (photoId, selected) =>
    set((state) => ({
      failedSelections: { ...state.failedSelections, [photoId]: selected },
    })),
  reset: () => set(initialState),
}));
