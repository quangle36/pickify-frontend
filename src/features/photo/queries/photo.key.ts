import type { PhotoFilters } from "../types/photo.types";

export const photoKeys = {
  list: (
    scope: "owner" | "guest",
    albumId: string,
    filters: PhotoFilters,
    accessMode: "interactive" | "view" = "interactive",
  ) => ["photos", scope, albumId, accessMode, filters] as const,
  prefix: (scope: "owner" | "guest", albumId?: string) =>
    albumId
      ? (["photos", scope, albumId] as const)
      : (["photos", scope] as const),
  access: (
    scope: "owner" | "guest",
    albumId: string,
    accessMode: "interactive" | "view",
  ) => ["photos", scope, albumId, accessMode] as const,
};
