import { apiRequest } from "@/api/apiClient";

export const guestService = {
  getAlbum: (shareId: string, readOnly: boolean, signal?: AbortSignal) =>
    apiRequest<{
      title: string;
      shareId: string;
      selectionLimit?: number | null;
      selectionLocked: boolean;
      requiresPassword: boolean;
      readOnly: boolean;
    }>({
      url: `/public/albums/${shareId}`,
      params: readOnly ? { mode: "view" } : undefined,
      signal,
    }),

  verifyPasscode: (shareId: string, password: string) =>
    apiRequest<{ ok?: boolean }>({
      url: `/public/albums/${shareId}/session`,
      method: "POST",
      data: { password },
    }),
};
