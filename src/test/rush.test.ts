import { afterEach, describe, expect, it } from "vitest";

import { clearSelectedRestaurant, rushHours, setActiveRestaurant } from "@/data/menu";
import { isRushNow } from "@/lib/rush";

describe("rush hours", () => {
  afterEach(() => {
    clearSelectedRestaurant();
  });

  it("supports butcher burgers daytime window", () => {
    setActiveRestaurant("butcher-burgers");

    expect(rushHours).toHaveLength(1);
    expect(rushHours[0]).toEqual({ start: "02:00", end: "04:00" });
    expect(isRushNow(new Date("2026-05-06T02:30:00"))).toBe(true);
    expect(isRushNow(new Date("2026-05-06T04:00:00"))).toBe(false);
  });

  it("supports tacos overnight window across midnight", () => {
    setActiveRestaurant("tacos");

    expect(rushHours).toHaveLength(1);
    expect(rushHours[0]).toEqual({ start: "04:00", end: "02:00" });
    expect(isRushNow(new Date("2026-05-06T04:30:00"))).toBe(true);
    expect(isRushNow(new Date("2026-05-06T01:30:00"))).toBe(true);
    expect(isRushNow(new Date("2026-05-06T03:30:00"))).toBe(false);
  });
});