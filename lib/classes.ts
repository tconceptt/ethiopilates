export type ClassKey =
  | "group-reformer"
  | "private-reformer"
  | "mat-pilates"
  | "hot-pilates"
  | "yoga"
  | "pregnancy-yoga";

export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export type ClassInfo = {
  label: string;
  blurb: string;
  schedule: Partial<Record<DayKey, string[]>>;
};

export const CLASSES: Record<ClassKey, ClassInfo> = {
  "group-reformer": {
    label: "Group Reformer",
    blurb: "Equipment-based reformer session in a small group setting.",
    schedule: {
      Mon: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Tue: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Wed: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Thu: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Fri: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Sat: ["8:00–9:00 AM", "10:00–11:00 AM", "2:00–3:00 PM"],
    },
  },
  "private-reformer": {
    label: "Private Reformer",
    blurb: "One-on-one reformer session. Flexible windows available.",
    schedule: {
      Mon: ["2:00–9:00 PM (open slots)", "8:00–9:00 PM"],
      Tue: ["2:00–9:00 PM (open slots)", "8:00–9:00 PM"],
      Wed: ["2:00–9:00 PM (open slots)", "8:00–9:00 PM"],
      Thu: ["2:00–9:00 PM (open slots)", "8:00–9:00 PM"],
      Fri: ["2:00–9:00 PM (open slots)", "8:00–9:00 PM"],
    },
  },
  "mat-pilates": {
    label: "Mat Pilates",
    blurb: "Mat-based Pilates focused on core strength and control.",
    schedule: {
      Mon: ["9:00–10:00 AM", "5:00–6:00 PM"],
      Thu: ["9:00–10:00 AM", "5:00–6:00 PM"],
    },
  },
  "hot-pilates": {
    label: "Hot Pilates",
    blurb: "Dynamic Pilates in a heated room for added intensity.",
    schedule: {
      Mon: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Tue: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Wed: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Thu: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Fri: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Sat: ["8:00–9:00 AM", "9:00–10:00 AM", "12:00–1:00 PM"],
    },
  },
  yoga: {
    label: "Heran's Yoga",
    blurb: "Calming, restorative flows to stretch and reset.",
    schedule: {
      Mon: ["10:00–11:30 AM"],
      Thu: ["10:00–11:30 AM"],
    },
  },
  "pregnancy-yoga": {
    label: "Pregnancy Yoga",
    blurb: "Gentle, supportive sessions tailored for mothers-to-be.",
    schedule: {
      Mon: ["6:00–7:00 PM"],
      Thu: ["6:00–7:00 PM"],
    },
  },
};

export const CLASS_KEYS = Object.keys(CLASSES) as ClassKey[];

/** Local-timezone YYYY-MM-DD, used as the stable per-day booking key. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
