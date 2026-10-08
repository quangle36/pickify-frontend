export async function readLogo(file: File): Promise<string> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type))
    throw new Error("Chọn logo PNG, JPEG hoặc WebP.");
  if (file.size > 2 * 1024 * 1024)
    throw new Error("Logo không được vượt quá 2 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, 512 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Không thể đọc logo trên trình duyệt này.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Không thể đọc logo trên trình duyệt này."
    )
      throw error;
    throw new Error("Không đọc được ảnh. Vui lòng chọn logo khác.");
  } finally {
    URL.revokeObjectURL(url);
  }
}
