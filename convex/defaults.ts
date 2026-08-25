/**
 * Seed content for the editable parts of the site.
 *
 * These values are the single source of truth in two situations:
 *   1. Before an admin has ever opened /members (the tables are still empty),
 *      the public site renders these so nothing ever shows blank.
 *   2. `content.seedIfEmpty` copies them into Convex so they become editable.
 *
 * Once seeded, Convex wins — editing this file no longer changes the live site.
 */

export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export const DAY_KEYS: DayKey[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export const DAY_LABELS: Record<DayKey, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

export type ScheduleDay = { day: DayKey; slots: string[] };

export type ClassContent = {
  key: string;
  label: string;
  blurb: string;
  order: number;
  active: boolean;
  /** Listed in the "Weekly schedule" section on the home page. */
  showOnWeeklySchedule: boolean;
  /** Spots per time slot. Undefined means no limit and no spot counts shown. */
  capacity?: number;
  schedule: ScheduleDay[];
};

const WEEKDAY_FULL = ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"];

const weekdays = (slots: string[]): ScheduleDay[] =>
  (["Mon", "Tue", "Wed", "Thu", "Fri"] as DayKey[]).map((day) => ({ day, slots }));

export const DEFAULT_CLASSES: ClassContent[] = [
  {
    key: "group-reformer",
    label: "Group Reformer",
    blurb: "Equipment-based reformer session in a small group setting.",
    order: 0,
    active: true,
    showOnWeeklySchedule: false,
    schedule: [
      ...weekdays(WEEKDAY_FULL),
      { day: "Sat", slots: ["8:00–9:00 AM", "10:00–11:00 AM", "2:00–3:00 PM"] },
    ],
  },
  {
    key: "private-reformer",
    label: "Private Reformer",
    blurb: "One-on-one reformer session. Flexible windows available.",
    order: 1,
    active: true,
    showOnWeeklySchedule: false,
    schedule: weekdays(["2:00–9:00 PM (open slots)", "8:00–9:00 PM"]),
  },
  {
    key: "mat-pilates",
    label: "Mat Pilates",
    blurb: "Mat-based Pilates focused on core strength and control.",
    order: 2,
    active: true,
    showOnWeeklySchedule: true,
    schedule: [
      { day: "Mon", slots: ["9:00–10:00 AM", "5:00–6:00 PM"] },
      { day: "Thu", slots: ["9:00–10:00 AM", "5:00–6:00 PM"] },
    ],
  },
  {
    key: "hot-pilates",
    label: "Hot Pilates",
    blurb: "Dynamic Pilates in a heated room for added intensity.",
    order: 3,
    active: true,
    showOnWeeklySchedule: false,
    schedule: [
      ...weekdays(WEEKDAY_FULL),
      { day: "Sat", slots: ["8:00–9:00 AM", "9:00–10:00 AM", "12:00–1:00 PM"] },
    ],
  },
  {
    key: "yoga",
    label: "Heran's Yoga",
    blurb: "Calming, restorative flows to stretch and reset.",
    order: 4,
    active: true,
    showOnWeeklySchedule: true,
    schedule: [
      { day: "Mon", slots: ["10:00–11:30 AM"] },
      { day: "Thu", slots: ["10:00–11:30 AM"] },
    ],
  },
  {
    key: "pregnancy-yoga",
    label: "Pregnancy Yoga",
    blurb: "Gentle, supportive sessions tailored for mothers-to-be.",
    order: 5,
    active: true,
    showOnWeeklySchedule: true,
    schedule: [
      { day: "Mon", slots: ["6:00–7:00 PM"] },
      { day: "Thu", slots: ["6:00–7:00 PM"] },
    ],
  },
];

export const PRICING_SECTIONS = [
  "programs",
  "memberships",
  "classPackages",
  "specialty",
] as const;

export type PricingSection = (typeof PRICING_SECTIONS)[number];

export const PRICING_SECTION_LABELS: Record<PricingSection, string> = {
  programs: "Pilates packages",
  memberships: "Memberships",
  classPackages: "Class packages",
  specialty: "Specialty programs",
};

export type PricingTier = {
  /** Left-hand label, e.g. "1 Month" or "Drop-in". */
  label: string;
  /** Free text so admins can write "30,000" or "From 30,000". */
  price: string;
  /** Small print under the price, e.g. "8 classes". */
  note?: string;
};

export type PricingGroupContent = {
  section: PricingSection;
  title: string;
  /** Kicker under the title. On `programs` this is the frequency line. */
  subtitle?: string;
  /** `programs` only — renders the card in the dark highlight style. */
  featured?: boolean;
  order: number;
  tiers: PricingTier[];
};

export const DEFAULT_PRICING: PricingGroupContent[] = [
  {
    section: "programs",
    title: "Group Reformer",
    subtitle: "2 sessions a week",
    order: 0,
    tiers: [
      { label: "1 Month", price: "30,000", note: "8 sessions" },
      { label: "3 Months", price: "50,000", note: "24 sessions" },
      { label: "6 Months", price: "80,000", note: "48 sessions" },
      { label: "1 Year", price: "150,000", note: "96 sessions" },
    ],
  },
  {
    section: "programs",
    title: "Group Reformer",
    subtitle: "3 sessions a week",
    featured: true,
    order: 1,
    tiers: [
      { label: "1 Month", price: "40,000", note: "12 sessions" },
      { label: "3 Months", price: "100,000", note: "36 sessions" },
      { label: "6 Months", price: "180,000", note: "72 sessions" },
      { label: "1 Year", price: "300,000", note: "144 sessions" },
    ],
  },
  {
    section: "programs",
    title: "Group Hot Pilates",
    subtitle: "3 sessions a week",
    order: 2,
    tiers: [
      { label: "1 Month", price: "20,000", note: "12 sessions" },
      { label: "3 Months", price: "50,000", note: "36 sessions" },
      { label: "6 Months", price: "80,000", note: "72 sessions" },
      { label: "1 Year", price: "120,000", note: "144 sessions" },
    ],
  },
  {
    section: "memberships",
    title: "Standard Access",
    subtitle: "Yoga + Hot Pilates — unlimited classes",
    order: 0,
    tiers: [
      { label: "Drop-in", price: "2,500" },
      { label: "1 Month", price: "8,000" },
      { label: "3 Months", price: "20,000" },
      { label: "6 Months", price: "35,000" },
      { label: "1 Year", price: "55,000" },
    ],
  },
  {
    section: "memberships",
    title: "Premium Access",
    subtitle: "Yoga + Mat Pilates + Hot Pilates + Reformer",
    order: 1,
    tiers: [
      { label: "1 Month", price: "35,000", note: "one class per week for each service" },
      { label: "3 Months", price: "80,000", note: "4 classes for each service" },
      { label: "6 Months", price: "130,000", note: "8 classes for each service" },
    ],
  },
  {
    section: "classPackages",
    title: "Hot Pilates",
    order: 0,
    tiers: [
      { label: "Drop-in", price: "2,000" },
      { label: "1 Month", price: "6,000", note: "4 classes" },
      { label: "3 Months", price: "10,000", note: "8 classes" },
      { label: "6 Months", price: "15,000", note: "16 classes" },
      { label: "1 Year", price: "20,000", note: "32 classes" },
    ],
  },
  {
    section: "classPackages",
    title: "Reformer Pilates",
    order: 1,
    tiers: [
      { label: "Drop-in", price: "4,500" },
      { label: "1 Month", price: "15,000", note: "4 classes" },
      { label: "3 Months", price: "35,000", note: "12 classes" },
      { label: "6 Months", price: "50,000", note: "24 classes" },
      { label: "1 Year", price: "80,000" },
    ],
  },
  {
    section: "classPackages",
    title: "Mat Pilates",
    order: 2,
    tiers: [
      { label: "Drop-in", price: "2,000" },
      { label: "1 Month", price: "10,000", note: "8 classes" },
      { label: "3 Months", price: "25,000", note: "24 classes" },
      { label: "6 Months", price: "40,000", note: "48 classes" },
      { label: "1 Year", price: "60,000", note: "96 classes" },
    ],
  },
  {
    section: "classPackages",
    title: "Yoga",
    order: 3,
    tiers: [
      { label: "Drop-in", price: "2,000" },
      { label: "1 Month", price: "6,000", note: "4 classes" },
      { label: "3 Months", price: "10,000", note: "8 classes" },
      { label: "6 Months", price: "15,000", note: "16 classes" },
      { label: "1 Year", price: "20,000", note: "32 classes" },
    ],
  },
  {
    section: "specialty",
    title: "Pregnancy Yoga",
    order: 0,
    tiers: [
      { label: "Drop-in", price: "2,500" },
      { label: "1 Month", price: "8,000" },
      { label: "3 Months", price: "20,000" },
      { label: "6 Months", price: "30,000" },
    ],
  },
  {
    section: "specialty",
    title: "Kids / Beginner Ballet",
    order: 1,
    tiers: [
      { label: "Drop-in", price: "1,500" },
      { label: "1 Month", price: "3,500" },
      { label: "3 Months", price: "9,500" },
      { label: "6 Months", price: "17,000" },
      { label: "1 Year", price: "32,000" },
    ],
  },
  {
    section: "specialty",
    title: "VIP / Private Training",
    subtitle: "Free infused water, matcha",
    order: 2,
    tiers: [
      { label: "1 Session", price: "10,000" },
      { label: "4 Sessions", price: "30,000" },
    ],
  },
];

export type SettingsContent = {
  /** Advance payment guests send to hold a booking, in ETB. */
  advancePayment: number;
  telebirrAccountName: string;
  telebirrAccountNumber: string;
  /** Display form, e.g. "+251 98 331 4853". The wa.me link is derived from it. */
  whatsappNumber: string;
  pricingIntro: string;
  scheduleIntro: string;
  included: string[];
  policies: string[];
  contactPhones: string[];
  contactEmail: string;
  contactAddress: string;
};

export const DEFAULT_SETTINGS: SettingsContent = {
  advancePayment: 1500,
  telebirrAccountName: "Ethio Pilates",
  telebirrAccountNumber: "0983314853",
  whatsappNumber: "+251 98 331 4853",
  pricingIntro:
    "Invest in your body. Embrace the journey. Thrive every day.\nAll prices in ETB.",
  scheduleIntro:
    "Open mat and yoga classes run on Mondays and Thursdays. Reformer and Hot Pilates sessions run throughout the week, scheduled with your package.",
  included: [
    "All equipment & studio access",
    "Expert instruction",
    "Safe & supportive environment",
    "Progress tracking",
    "Free water, sauna, ice bath & red light therapy",
  ],
  policies: [
    "Sessions are non-refundable and non-transferable.",
    "24-hour cancellation notice required.",
    "Missed sessions cannot be rescheduled.",
  ],
  contactPhones: ["+251 92 917 7443", "+251 97 790 0331"],
  contactEmail: "info@ethiopilates.com",
  contactAddress: "Addis Ababa, Ethiopia",
};

/** wa.me needs a bare international number — strip spaces, dashes and the "+". */
export function whatsappLink(displayNumber: string): string {
  return `https://wa.me/${displayNumber.replace(/[^0-9]/g, "")}`;
}
