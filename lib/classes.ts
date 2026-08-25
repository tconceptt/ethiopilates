import type { DayKey, ScheduleDay } from "../convex/defaults";

export type { DayKey, ScheduleDay };
export { DAY_KEYS, DAY_LABELS } from "../convex/defaults";

/** Stable class identifier stored on registrations (e.g. "group-reformer"). */
export type ClassKey = string;

export type SiteClass = {
  key: ClassKey;
  label: string;
  blurb: string;
  active: boolean;
  showOnWeeklySchedule: boolean;
  capacity?: number;
  schedule: ScheduleDay[];
};

export const JS_DAY_TO_KEY: Record<number, DayKey> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

export function slotsForDay(cls: SiteClass, day: DayKey): string[] {
  return cls.schedule.find((d) => d.day === day)?.slots ?? [];
}

export function slotsForDate(cls: SiteClass, date: Date): string[] {
  return slotsForDay(cls, JS_DAY_TO_KEY[date.getDay()]);
}

/** Local-timezone YYYY-MM-DD, used as the stable per-day booking key. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Minutes past midnight for the start of a slot label like "9:00–10:00 AM",
 * used to order the weekly schedule. Returns null for labels we can't read,
 * which the caller sorts last rather than guessing.
 */
export function slotStartMinutes(slot: string): number | null {
  const time = slot.match(/(\d{1,2}):(\d{2})/);
  if (!time) return null;
  let hours = Number(time[1]) % 12;
  const minutes = Number(time[2]);
  const meridiem = slot.match(/\b([AaPp])\.?[Mm]\b/);
  if (meridiem && meridiem[1].toLowerCase() === "p") hours += 12;
  return hours * 60 + minutes;
}
