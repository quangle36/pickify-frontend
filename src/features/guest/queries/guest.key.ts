export const guestKeys = {
  album: (shareId: string | null, readOnly = false) =>
    ["guest", shareId, readOnly ? "view" : "interactive"] as const,
};
