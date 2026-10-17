import { useEffect, useState } from "react";

export interface StepsState { step: number; stepT: number; paused: boolean }

const STEP_COUNT = 3;
const PLAY_TICKS = 50; // 100 ms ticks: 5 s of animation per step…
const HOLD_TICKS = 10; // …then 1 s on its finished frame.

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export function advance(state: StepsState): StepsState {
  const stepT = state.stepT + 1;
  return stepT > PLAY_TICKS + HOLD_TICKS
    ? { ...state, step: (state.step + 1) % STEP_COUNT, stepT: 0 }
    : { ...state, stepT };
}

/** Starts identical to the prerendered HTML; reduced motion pauses on each step's finished frame. */
export function useStepsAutoplay() {
  const [state, setState] = useState<StepsState>({ step: 0, stepT: 0, paused: false });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState((current) => ({ ...current, paused: true, stepT: PLAY_TICKS }));
    }
  }, []);
  useEffect(() => {
    if (state.paused) return;
    const timer = window.setInterval(() => setState(advance), 100);
    return () => window.clearInterval(timer);
  }, [state.paused]);
  return {
    step: state.step,
    progress: Math.min(state.stepT / PLAY_TICKS, 1),
    paused: state.paused,
    pick: (step: number) => setState((current) => ({ ...current, step, stepT: current.paused ? PLAY_TICKS : 0 })),
    togglePlay: () => setState((current) => ({ ...current, paused: !current.paused })),
  };
}
