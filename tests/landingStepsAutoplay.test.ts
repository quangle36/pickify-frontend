import { describe, expect, it } from "vitest";
import { advance, type StepsState } from "../src/features/landing/pages/LandingPage/hooks/useStepsAutoplay";

const run = (state: StepsState, ticks: number) => Array.from({ length: ticks }).reduce<StepsState>(advance, state);

describe("advance", () => {
  it("plays and holds a step for 6 s, then moves to the next", () => {
    expect(run({ step: 0, stepT: 0, paused: false }, 60)).toEqual({ step: 0, stepT: 60, paused: false });
    expect(run({ step: 0, stepT: 0, paused: false }, 61)).toEqual({ step: 1, stepT: 0, paused: false });
  });

  it("wraps from the last step back to the first", () => {
    expect(run({ step: 2, stepT: 60, paused: false }, 1)).toEqual({ step: 0, stepT: 0, paused: false });
  });
});
