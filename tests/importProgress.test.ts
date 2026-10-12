import { describe, expect, it } from "vitest";
import { countUp, importPercent } from "../src/features/photographer/utils/importProgress";

describe("import progress", () => {
  it("counts through the numbers between two polls without passing the server count", () => {
    expect(countUp(20, 35, 0, 2_000)).toBe(20);
    expect(countUp(20, 35, 1_000, 2_000)).toBe(27);
    expect(countUp(20, 35, 1_999, 2_000)).toBe(34);
    expect(countUp(20, 35, 2_500, 2_000)).toBe(35);
    // A count that drops (a restarted import) or arrives at once shows as is.
    expect(countUp(35, 10, 500, 2_000)).toBe(10);
    expect(countUp(20, 35, 0, 0)).toBe(35);
  });

  it("rounds the percent down and caps it", () => {
    expect(importPercent(312, 568)).toBe(54);
    expect(importPercent(568, 568)).toBe(100);
    expect(importPercent(0, 0)).toBe(0);
  });
});
