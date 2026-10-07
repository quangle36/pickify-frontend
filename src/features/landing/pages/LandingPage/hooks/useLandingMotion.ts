import { useEffect, useState, type RefObject } from "react";

/** Native scrolling: only transforms move; the document keeps its normal flow. */
export function useLandingMotion(root: RefObject<HTMLDivElement>) {
  const [activeChapter, setActiveChapter] = useState(0);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousChapter = 0;
    const update = () => {
      frame = 0;
      const compact = window.innerWidth < 760;
      element.querySelectorAll<HTMLElement>("[data-parallax]").forEach((item) => {
        const rect = item.parentElement!.getBoundingClientRect();
        const distance = window.innerHeight / 2 - (rect.top + rect.height / 2);
        const limit = compact ? 18 : 60;
        const offset = reduced.matches ? 0 : Math.max(-limit, Math.min(limit, distance * Number(item.dataset.parallax)));
        item.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
      });
      let closest = 0;
      let minimum = Infinity;
      element.querySelectorAll<HTMLElement>("[data-feature-chapter]").forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
        if (distance < minimum) { minimum = distance; closest = index; }
      });
      if (closest !== previousChapter) { previousChapter = closest; setActiveChapter(closest); }
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      window.cancelAnimationFrame(frame);
    };
  }, [root]);
  return activeChapter;
}
