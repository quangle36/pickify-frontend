import { FC, useEffect, useRef, useState } from "react";
import { countUp } from "@/features/photographer/utils/importProgress";

// Polls bring the import count in steps (20, then 35). Count through the
// numbers in between over about as long as the last poll took, so it keeps
// counting until the next poll arrives. It changes several times a second,
// so keep it out of live regions.
export function useCountUp(target: number) {
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);
  const lastChange = useRef(performance.now());

  useEffect(() => {
    const start = shownRef.current;
    const startedAt = performance.now();
    const duration = Math.min(3000, startedAt - lastChange.current);
    lastChange.current = startedAt;
    let frame = 0;
    const step = (at: number) => {
      shownRef.current = countUp(start, target, at - startedAt, duration);
      setShown(shownRef.current);
      if (shownRef.current < target) frame = requestAnimationFrame(step);
    };
    step(startedAt);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return shown;
}

// Fills clockwise with the import's percent, drawn like the toast's countdown ring.
export const ImportProgressRing: FC<{ percent: number; className: string }> = ({ percent, className }) => (
  <svg
    role="progressbar"
    aria-label="Tiến độ nhập ảnh"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={percent}
    viewBox="0 0 16 16"
    className={`shrink-0 -rotate-90 ${className}`}
  >
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-20" />
    <circle
      cx="8"
      cy="8"
      r="6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      pathLength="100"
      strokeDasharray={`${percent} 100`}
    />
  </svg>
);
