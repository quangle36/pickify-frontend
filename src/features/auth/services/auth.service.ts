import { apiRequest, setCsrfToken } from "@/api/apiClient";
import { ApiError } from "@/api/errors";
import type { PhotographerProfile } from "@/features/photographer/types/album.types";

export interface AuthConfig {
  googleLoginEnabled: boolean;
}

interface CurrentUserResponse {
  profile: PhotographerProfile;
  csrfToken: string;
}

export const authService = {
  getConfig: (signal?: AbortSignal) =>
    apiRequest<AuthConfig>({ url: "/auth/config", signal }),

  getCurrentUser: async (signal?: AbortSignal) => {
    try {
      const currentUser = await apiRequest<CurrentUserResponse>({
        url: "/me",
        signal,
      });
      setCsrfToken(currentUser.csrfToken);
      return currentUser.profile;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setCsrfToken("");
        return null;
      }
      throw error;
    }
  },

  logout: async () => {
    const result = await apiRequest<{ ok: boolean }>({
      url: "/auth/logout",
      method: "POST",
    });
    setCsrfToken("");
    return result;
  },
};
