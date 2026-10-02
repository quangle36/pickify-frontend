import { apiRequest } from "@/api/apiClient";
import { apiMessages } from "@/api/errors";
import type { Album } from "../types/album.types";

export interface CreateAlbumInput {
  name: string;
  slug?: string;
  folderUrl: string;
  password: string;
  selectionLimit: number;
}

export interface SelectedFileManifest {
  files: Array<{ name: string }>;
}

export interface UpdateAlbumInput {
  name: string;
  slug: string;
  selectionLimit: number;
  password?: string;
}

export const albumService = {
  getAlbums: async (signal?: AbortSignal) => {
    const result = await apiRequest<{ albums: Album[] }>({
      url: "/albums",
      signal,
    });
    return result.albums
      .filter((album) => !["deleting", "deleted"].includes(album.status))
      .map((album) => ({
        ...album,
        errorMessage: album.errorMessage
          ? (apiMessages[album.errorMessage] ?? album.errorMessage)
          : undefined,
      }));
  },

  createAlbum: (input: CreateAlbumInput) =>
    apiRequest<Album>({ url: "/albums", method: "POST", data: input }),

  updateAlbum: (albumId: string, input: UpdateAlbumInput) =>
    apiRequest<Album>({
      url: `/albums/${albumId}`,
      method: "PUT",
      data: input,
    }),

  retryAlbum: (albumId: string) =>
    apiRequest<Album>({ url: `/albums/${albumId}/retry`, method: "POST" }),

  deleteAlbum: (albumId: string) =>
    apiRequest<{ ok: boolean }>({
      url: `/albums/${albumId}`,
      method: "DELETE",
    }),

  updatePasscode: (albumId: string, password: string) =>
    apiRequest<Album>({
      url: `/albums/${albumId}/password`,
      method: "PUT",
      data: { password },
    }),

  revokeGuestSessions: (albumId: string) =>
    apiRequest<Album>({
      url: `/albums/${albumId}/sessions`,
      method: "DELETE",
    }),

  revealPasscode: (albumId: string) =>
    apiRequest<{ password: string | null }>({
      url: `/albums/${albumId}/password`,
    }),

  setSelectionLocked: (albumId: string, locked: boolean) =>
    apiRequest<Album>({
      url: `/albums/${albumId}/selection-lock`,
      method: "PUT",
      data: { locked },
    }),

  getSelectedFiles: (albumId: string, signal?: AbortSignal) =>
    apiRequest<SelectedFileManifest>({
      url: `/albums/${albumId}/selected-files`,
      signal,
    }),
};
