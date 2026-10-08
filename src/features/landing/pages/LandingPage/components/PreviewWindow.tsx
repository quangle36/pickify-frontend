import type { ReactNode } from "react";

export function PreviewWindow({
  children,
  label = "Lumipic",
  parallax = 0.04,
}: {
  children: ReactNode;
  label?: string;
  parallax?: number;
}) {
  return (
    <div className="landing-preview-window" data-parallax={parallax}>
      <div className="landing-window-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}
