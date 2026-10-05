export const albumKeys = {
  sourceTime: (albumId: string, sourceId: string) =>
    ["albums", "source-time", albumId, sourceId] as const,
  timePrefix: (albumId: string) => ["albums", "source-time", albumId] as const,
  all: ["albums", "owner"] as const,
};
