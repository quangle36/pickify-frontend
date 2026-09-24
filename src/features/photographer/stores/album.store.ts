import { create } from "zustand";

interface AlbumState {
  hiddenAlbumIds: string[];
  hideAlbum: (albumId: string) => void;
  showAlbum: (albumId: string) => void;
  reset: () => void;
}

export const useAlbumStore = create<AlbumState>((set) => ({
  hiddenAlbumIds: [],
  hideAlbum: (albumId) =>
    set((state) => ({
      hiddenAlbumIds: state.hiddenAlbumIds.includes(albumId)
        ? state.hiddenAlbumIds
        : [...state.hiddenAlbumIds, albumId],
    })),
  showAlbum: (albumId) =>
    set((state) => ({
      hiddenAlbumIds: state.hiddenAlbumIds.filter((id) => id !== albumId),
    })),
  reset: () => set({ hiddenAlbumIds: [] }),
}));
