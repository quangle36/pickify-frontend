/** These are UI deterrents; public image URLs and browser menus remain accessible. */
export function isImageProtectionShortcut(
  event: Pick<
    KeyboardEvent,
    "key" | "ctrlKey" | "metaKey" | "shiftKey" | "altKey"
  >,
): boolean {
  const key = event.key.toLowerCase();
  if (key === "f12") return true;
  if (
    !event.altKey &&
    !event.shiftKey &&
    (event.ctrlKey || event.metaKey) &&
    ["s", "u"].includes(key)
  )
    return true;
  return (
    ["i", "j", "c"].includes(key) &&
    ((event.ctrlKey && event.shiftKey && !event.altKey && !event.metaKey) ||
      (event.metaKey && event.altKey && !event.shiftKey && !event.ctrlKey))
  );
}

export function installImageProtection(target: EventTarget): () => void {
  const handleKeyDown = (event: Event) => {
    if (isImageProtectionShortcut(event as KeyboardEvent))
      event.preventDefault();
  };
  const handleImageAction = (event: Event) => {
    const element = event.target;
    if (!(element instanceof Element)) return;
    if (element.closest("input, textarea, [contenteditable]")) return;
    if (element.closest('[data-protected-image="true"]'))
      event.preventDefault();
  };
  target.addEventListener("keydown", handleKeyDown, { capture: true });
  const imageEvents = ["contextmenu", "dragstart", "selectstart"];
  for (const type of imageEvents)
    target.addEventListener(type, handleImageAction, { capture: true });
  return () => {
    target.removeEventListener("keydown", handleKeyDown, { capture: true });
    for (const type of imageEvents)
      target.removeEventListener(type, handleImageAction, { capture: true });
  };
}
