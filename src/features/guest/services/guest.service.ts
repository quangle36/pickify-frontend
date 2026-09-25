import { apiRequest } from "@/api/apiClient";

export const guestService = {
  getAlbum: (shareId: string, signal?: AbortSignal) =>
    apiRequest<{
      title: string;
      shareId: string;
      selectionLimit?: number | null;
    }>({
      url: `/public/albums/${shareId}`,
      signal,
    }),

  verifyPasscode: (shareId: string, password: string) =>
    apiRequest<{ ok?: boolean }>({
      url: `/public/albums/${shareId}/session`,
      method: "POST",
      data: { password },
    }),
};
