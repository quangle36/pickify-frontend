import { apiRequest } from "@/api/apiClient";
import type { PhotoFilters, PhotoPage } from "../types/photo.types";

interface SelectionInput {
  selected: boolean;
  clientMutationId: string;
}

function photoParams(cursor: string | null, filters: PhotoFilters) {
  return {
    ...(cursor ? { cursor } : {}),
    ...(filters.selected ? { selected: true } : {}),
    ...(filters.search ? { search: filters.search } : {}),
  };
}

export const photoService = {
  getOwnerPhotos: (
    albumId: string,
    cursor: string | null,
    filters: PhotoFilters,
    signal?: AbortSignal,
  ) =>
    apiRequest<PhotoPage>({
      url: `/albums/${albumId}/photos`,
      params: photoParams(cursor, filters),
      signal,
    }),

  getGuestPhotos: (
    shareId: string,
    cursor: string | null,
    filters: PhotoFilters,
    signal?: AbortSignal,
  ) =>
    apiRequest<PhotoPage>({
      url: `/public/albums/${shareId}/photos`,
      params: photoParams(cursor, filters),
      signal,
    }),

  updateSelection: async (
    basePath: string,
    photoId: string,
    selected: boolean,
  ) => {
    const input: SelectionInput = {
      selected,
      clientMutationId: crypto.randomUUID(),
    };
    const result = await apiRequest<SelectionInput>({
      url: `${basePath}/photos/${photoId}/selection`,
      method: "PUT",
      data: input,
    });
    if (result.clientMutationId !== input.clientMutationId) {
      throw new Error("Phản hồi lưu ảnh không hợp lệ");
    }
    return result;
  },
};
