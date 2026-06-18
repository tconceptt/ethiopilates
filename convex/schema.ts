import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  registrations: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.string(),
    package: v.string(),
    price: v.optional(v.number()),
    schedule: v.optional(v.string()),
    experienceLevel: v.optional(v.string()),
    goals: v.optional(v.string()),
    status: v.string(), // e.g., "pending", "contacted", "paid", "cancelled"
    createdAt: v.number(),
  }),
});