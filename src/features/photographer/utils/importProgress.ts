export function importPercent(imported: number, total: number) {
  return total > 0 ? Math.min(100, Math.floor((imported * 100) / total)) : 0;
}

// The number to show while counting from `from` up to `to` over `durationMs`.
// It never passes `to`, the count the server reported.
export function countUp(from: number, to: number, elapsedMs: number, durationMs: number) {
  if (to <= from || elapsedMs >= durationMs) return to;
  return from + Math.floor(((to - from) * Math.max(0, elapsedMs)) / durationMs);
}
