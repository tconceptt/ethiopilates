import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const dayValidator = v.union(
  v.literal("Mon"),
  v.literal("Tue"),
  v.literal("Wed"),
  v.literal("Thu"),
  v.literal("Fri"),
  v.literal("Sat"),
  v.literal("Sun"),
);

export const scheduleValidator = v.array(
  v.object({ day: dayValidator, slots: v.array(v.string()) }),
);

export const pricingSectionValidator = v.union(
  v.literal("programs"),
  v.literal("memberships"),
  v.literal("classPackages"),
  v.literal("specialty"),
);

export const tiersValidator = v.array(
  v.object({
    label: v.string(),
    price: v.string(),
    note: v.optional(v.string()),
  }),
);

export default defineSchema({
  registrations: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    package: v.string(),
    /** Advance payment taken at booking, in ETB. */
    price: v.optional(v.number()),
    // The package the guest signed up for, captured at booking time. Copied
    // rather than referenced so later edits in the Prices tab never rewrite
    // what someone already agreed to pay. Absent on member bookings (covered
    // by their membership) and on rows created before packages existed.
    packageTitle: v.optional(v.string()),
    packageSubtitle: v.optional(v.string()),
    packageTier: v.optional(v.string()),
    /** Full package price in ETB, or absent when the price row isn't a number. */
    packagePrice: v.optional(v.number()),
    /** Price exactly as written in the Prices tab, e.g. "From 30,000". */
    packagePriceLabel: v.optional(v.string()),
    schedule: v.optional(v.string()),
    experienceLevel: v.optional(v.string()),
    goals: v.optional(v.string()),
    status: v.string(), // e.g., "pending", "confirmed", "contacted", "paid", "cancelled"
    /** What the admin actually recorded when marking the booking paid. */
    paidAmount: v.optional(v.number()),
    paidInFull: v.optional(v.boolean()),
    isMember: v.optional(v.boolean()),
    classKey: v.optional(v.string()),
    classDate: v.optional(v.string()), // local YYYY-MM-DD
    classSlot: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_classKey_and_classDate_and_classSlot", [
    "classKey",
    "classDate",
    "classSlot",
  ]),

  // Bookable classes: name, description, weekly schedule and per-slot capacity.
  // `key` is the stable identifier stored on registrations, so it never changes
  // once a class exists — renaming edits `label` only.
  classes: defineTable({
    key: v.string(),
    label: v.string(),
    blurb: v.string(),
    order: v.number(),
    active: v.boolean(),
    showOnWeeklySchedule: v.boolean(),
    capacity: v.optional(v.number()),
    // Which pricing packages the booking page offers for this class. Empty or
    // absent means "no shortlist configured", and every package is offered.
    pricingGroupIds: v.optional(v.array(v.id("pricingGroups"))),
    schedule: scheduleValidator,
  }).index("by_key", ["key"]),

  pricingGroups: defineTable({
    section: pricingSectionValidator,
    title: v.string(),
    subtitle: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    order: v.number(),
    tiers: tiersValidator,
  }).index("by_section", ["section"]),

  // Single-document table; `key` is always "singleton".
  siteSettings: defineTable({
    key: v.string(),
    advancePayment: v.number(),
    telebirrAccountName: v.string(),
    telebirrAccountNumber: v.string(),
    whatsappNumber: v.string(),
    pricingIntro: v.string(),
    scheduleIntro: v.string(),
    included: v.array(v.string()),
    policies: v.array(v.string()),
    contactPhones: v.array(v.string()),
    contactEmail: v.string(),
    contactAddress: v.string(),
  }).index("by_key", ["key"]),

  // Superseded by `classes.capacity`. Kept so existing rows still validate;
  // `content.seedIfEmpty` copies any capacities across on first admin load.
  classSettings: defineTable({
    classKey: v.string(),
    capacity: v.optional(v.number()),
  }).index("by_classKey", ["classKey"]),
});
