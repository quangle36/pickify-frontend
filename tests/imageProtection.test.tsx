import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  installImageProtection,
  isImageProtectionShortcut,
} from "../src/features/guest/utils/imageProtection";
import { LightboxModal } from "../src/features/photo/components/LightboxModal";
import type { Photo } from "../src/features/photo/types/photo.types";

const key = (value: string, modifiers: Partial<KeyboardEvent> = {}) => ({
  key: value,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  altKey: false,
  ...modifiers,
});

describe("guest image protection", () => {
  it("blocks only the requested shortcuts, preserving navigation and text editing", () => {
    expect(isImageProtectionShortcut(key("F12"))).toBe(true);
    for (const letter of ["i", "j", "c"]) {
      expect(
        isImageProtectionShortcut(
          key(letter, { ctrlKey: true, shiftKey: true }),
        ),
      ).toBe(true);
      expect(
        isImageProtectionShortcut(
          key(letter.toUpperCase(), { metaKey: true, altKey: true }),
        ),
      ).toBe(true);
    }
    for (const letter of ["s", "u"]) {
      expect(isImageProtectionShortcut(key(letter, { ctrlKey: true }))).toBe(
        true,
      );
      expect(isImageProtectionShortcut(key(letter, { metaKey: true }))).toBe(
        true,
      );
    }
    for (const value of [
      "Escape",
      "ArrowLeft",
      "ArrowRight",
      " ",
      "l",
      "h",
      "s",
      "u",
      "i",
    ]) {
      expect(isImageProtectionShortcut(key(value))).toBe(false);
    }
    for (const value of ["c", "v", "x", "a", "z"]) {
      expect(isImageProtectionShortcut(key(value, { ctrlKey: true }))).toBe(
        false,
      );
      expect(isImageProtectionShortcut(key(value, { metaKey: true }))).toBe(
        false,
      );
    }
  });

  it("cancels shortcuts only while installed, and removes listeners on cleanup", () => {
    const target = new EventTarget();
    const send = () => {
      const event = Object.assign(
        new Event("keydown", { cancelable: true }),
        key("F12"),
      );
      target.dispatchEvent(event);
      return event.defaultPrevented;
    };
    expect(send()).toBe(false);
    const cleanup = installImageProtection(target);
    expect(send()).toBe(true);
    cleanup();
    expect(send()).toBe(false);
    const secondCleanup = installImageProtection(target);
    expect(send()).toBe(true);
    secondCleanup();
    expect(send()).toBe(false);
  });

  it("opts guest lightbox photos in without protecting owner lightboxes by default", () => {
    const photo: Photo = {
      id: "photo",
      albumId: "album",
      position: 1,
      driveFileId: "drive",
      name: "photo.jpg",
      displayUrl: "/photo.jpg",
      originalUrl: "",
      isSelected: false,
      sizeBytes: 1,
      dimensions: { width: 100, height: 100 },
      status: "ready",
    };
    const render = (protectImages?: boolean) =>
      renderToStaticMarkup(
        <LightboxModal
          photos={[photo]}
          totalPhotos={1}
          currentIndex={0}
          isOpen
          protectImages={protectImages}
          onClose={() => {}}
          onNavigate={() => {}}
          onToggleSelection={() => {}}
        />,
      );
    expect(render(true)).toContain('data-protected-image="true"');
    expect(render(true)).toContain('draggable="false"');
    expect(render()).not.toContain('data-protected-image="true"');
    expect(render(false)).not.toContain('draggable="false"');
  });
});
