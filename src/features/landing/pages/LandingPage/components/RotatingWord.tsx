import { useEffect, useState } from "react";

const words = ["cưới", "kỷ yếu", "sự kiện", "sinh nhật", "chân dung", "du lịch"];

/** Each word shows for 2.5 s and fades out over its last 0.3 s; reduced motion keeps the first. */
export function RotatingWord() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setTick((current) => current + 1), 100);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <span className="lp-word" data-fading={tick % 25 >= 22}>
      {words[Math.floor(tick / 25) % words.length]}
    </span>
  );
}
