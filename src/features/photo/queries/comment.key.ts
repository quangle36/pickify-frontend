export const commentKeys = {
  list: (basePath: string, photoId: string) =>
    ["photo-comments", basePath, photoId] as const,
};
