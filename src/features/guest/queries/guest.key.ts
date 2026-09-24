export const guestKeys = {
  album: (shareId: string | null) => ["guest", shareId] as const,
};
