import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConfirmationModal } from "../src/components/ui/confirmation-modal";

const captured = vi.hoisted(() => ({ buttons: [] as any[], content: {} as any, dialog: {} as any }));
vi.mock("@/components/ui/dialog", () => ({
  Dialog: (props: any) => { captured.dialog = props; return props.children; },
  DialogContent: (props: any) => { captured.content = props; return createElement("div", { role: props.role }, props.children); },
  DialogDescription: ({ children }: { children: ReactNode }) => createElement("p", {}, children),
  DialogTitle: ({ children }: { children: ReactNode }) => createElement("h2", {}, children),
  DialogFooter: ({ children }: { children: ReactNode }) => createElement("div", {}, children),
}));
vi.mock("@/components/ui/button", () => ({ Button: (props: any) => {
  captured.buttons.push(props);
  return createElement("button", {}, props.children);
} }));

function render(onConfirm: () => void | boolean | Promise<void | boolean>, onOpenChange = vi.fn()) {
  renderToStaticMarkup(<ConfirmationModal open title="Xóa album?" description="Album thử" onConfirm={onConfirm} onOpenChange={onOpenChange} />);
  return onOpenChange;
}

describe("confirmation modal safety", () => {
  beforeEach(() => { captured.buttons = []; });
  it("cancel dismisses without performing the action", () => {
    const action = vi.fn();
    const close = render(action);
    captured.buttons[0].onClick();
    expect(close).toHaveBeenCalledWith(false);
    expect(action).not.toHaveBeenCalled();
    expect(captured.content.role).toBe("alertdialog");
  });
  it("blocks duplicate submissions and dismissal while the action is pending", async () => {
    let resolve!: (value: boolean) => void;
    const action = vi.fn(() => new Promise<boolean>((done) => { resolve = done; }));
    const close = render(action);
    captured.buttons[1].onClick();
    captured.buttons[1].onClick();
    captured.dialog.onOpenChange(false);
    const event = { preventDefault: vi.fn() };
    captured.content.onEscapeKeyDown(event);
    expect(action).toHaveBeenCalledTimes(1);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
    resolve(true);
    await vi.waitFor(() => expect(close).toHaveBeenCalledWith(false));
  });
  it("keeps a handled failure open and allows retry", async () => {
    const action = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    const close = render(action);
    captured.buttons[1].onClick();
    await Promise.resolve();
    expect(close).not.toHaveBeenCalled();
    captured.buttons[1].onClick();
    await vi.waitFor(() => expect(close).toHaveBeenCalledWith(false));
    expect(action).toHaveBeenCalledTimes(2);
  });
  it("does not dismiss on an unexpected failure and allows retry", async () => {
    const action = vi.fn().mockRejectedValueOnce(new Error("network")).mockResolvedValueOnce(undefined);
    const close = render(action);
    captured.buttons[1].onClick();
    await Promise.resolve();
    expect(close).not.toHaveBeenCalled();
    captured.buttons[1].onClick();
    await vi.waitFor(() => expect(close).toHaveBeenCalledWith(false));
  });
});
