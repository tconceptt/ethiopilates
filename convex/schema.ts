import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  registrations: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    package: v.string(),
    price: v.optional(v.number()),
    schedule: v.optional(v.string()),
    experienceLevel: v.optional(v.string()),
    goals: v.optional(v.string()),
    status: v.string(), // e.g., "pending", "confirmed", "contacted", "paid", "cancelled"
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
  classSettings: defineTable({
    classKey: v.string(),
    capacity: v.optional(v.number()),
  }).index("by_classKey", ["classKey"]),
});
