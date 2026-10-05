export function localCaptureTimeInput(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "";
  return new Date(date.getTime() + 420 * 60_000).toISOString().slice(0, 19);
}
export function captureTimeIso(local: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(local)) return null;
  const date = new Date(`${local}+07:00`);
  return Number.isFinite(date.getTime()) &&
    localCaptureTimeInput(date.toISOString()).slice(0, local.length) === local
    ? date.toISOString()
    : null;
}
export function formatShotTime(iso: string | null | undefined) {
  return iso
    ? new Date(iso).toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false,
      })
    : "Thiếu giờ chụp";
}
export function formatClockOffset(seconds: number) {
  if (!seconds) return "Không lệch";
  const amount = Math.abs(seconds);
  const parts = [
    Math.floor(amount / 86400) ? `${Math.floor(amount / 86400)} ngày` : "",
    Math.floor((amount % 86400) / 3600)
      ? `${Math.floor((amount % 86400) / 3600)} giờ`
      : "",
    Math.floor((amount % 3600) / 60)
      ? `${Math.floor((amount % 3600) / 60)} phút`
      : "",
    amount % 60 ? `${amount % 60} giây` : "",
  ].filter(Boolean);
  return `${seconds > 0 ? "+" : "−"}${parts.join(" ")}`;
}
