import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { toast, useToast } from "../src/components/ui/use-toast";

let state: ReturnType<typeof useToast>;
function ToastStateReader() {
  state = useToast();
  return null;
}
function read() {
  renderToStaticMarkup(createElement(ToastStateReader));
  return state;
}

describe("toast timeout", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    read().dismiss();
    vi.runAllTimers();
    vi.useRealTimers();
  });
  it("closes a delete confirmation at five seconds without relying on Radix", () => {
    const item = toast({ title: "Đã xóa album." });
    vi.advanceTimersByTime(4999);
    expect(read().toasts.find(t => t.id === item.id)?.open).toBe(true);
    vi.advanceTimersByTime(1);
    expect(read().toasts.find(t => t.id === item.id)?.open).toBe(false);
    vi.advanceTimersByTime(4000);
    expect(read().toasts.find(t => t.id === item.id)).toBeUndefined();
  });
  it("keeps custom durations independent", () => {
    const short = toast({ title: "Short", duration: 1000 });
    const normal = toast({ title: "Normal" });
    vi.advanceTimersByTime(1000);
    expect(read().toasts.find(t => t.id === short.id)?.open).toBe(false);
    expect(read().toasts.find(t => t.id === normal.id)?.open).toBe(true);
  });
  it("does not extend the timeout when only the content changes", () => {
    const item = toast({ title: "Deleting" });
    vi.advanceTimersByTime(4000);
    item.update({ id: item.id, title: "Deleted" });
    vi.advanceTimersByTime(1000);
    expect(read().toasts.find(t => t.id === item.id)?.open).toBe(false);
  });
  it("preserves intentionally persistent notifications and manual dismissal", () => {
    const item = toast({ title: "Persistent", duration: Infinity });
    vi.advanceTimersByTime(60_000);
    expect(read().toasts.find(t => t.id === item.id)?.open).toBe(true);
    item.dismiss();
    expect(read().toasts.find(t => t.id === item.id)?.open).toBe(false);
  });
});
