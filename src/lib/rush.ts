import { rushHours, RushHour } from "@/data/menu";

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};

/**
 * Returns true if the current local time falls within any configured rushHours interval.
 * Inclusive on `start`, exclusive on `end`.
 */
export const isRushNow = (now: Date = new Date(), windows: RushHour[] = rushHours): boolean => {
  const cur = now.getHours() * 60 + now.getMinutes();
  return windows.some((w) => {
    const s = toMinutes(w.start);
    const e = toMinutes(w.end);
    return cur >= s && cur < e;
  });
};
