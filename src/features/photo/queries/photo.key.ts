import type { PhotoFilters } from "../types/photo.types";

export const photoKeys = {
  list: (
    scope: "owner" | "guest",
    albumId: string,
    filters: PhotoFilters,
  ) => ["photos", scope, albumId, filters] as const,
  prefix: (scope: "owner" | "guest", albumId?: string) =>
    albumId
      ? (["photos", scope, albumId] as const)
      : (["photos", scope] as const),
};
