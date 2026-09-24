const imagePreloads = new Map<string, Promise<void>>();

export function preloadImage(
  src: string,
  priority: "high" | "low" | "auto" = "auto",
): Promise<void> {
  const cached = imagePreloads.get(src);
  if (cached) return cached;

  const preload = new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = priority;
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Unable to preload image: ${src}`));
    image.src = src;
  }).catch((error) => {
    imagePreloads.delete(src);
    throw error;
  });

  imagePreloads.set(src, preload);
  return preload;
}
