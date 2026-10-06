import { useEffect, useState } from "react";
import { guideSteps } from "./guide";

export function useActiveGuideSection() {
  const [activeId, setActiveId] = useState(guideSteps[0].id);

  useEffect(() => {
    const sections = guideSteps.map(({ id }) => document.getElementById(id));
    let frame: number | undefined;

    const update = () => {
      frame = undefined;
      let currentId = guideSteps[0].id;
      for (const section of sections) {
        // Match scroll-mt-28, allowing for fractional anchor positions.
        if (section && section.getBoundingClientRect().top <= 113) {
          currentId = section.id;
        }
      }
      setActiveId(currentId);
    };

    const scheduleUpdate = () => {
      if (frame === undefined) frame = window.requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, []);

  return activeId;
}
