import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.string(),
    package: v.string(),
    experienceLevel: v.string(),
    goals: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const registrationId = await ctx.db.insert("registrations", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
    return registrationId;
  },
});