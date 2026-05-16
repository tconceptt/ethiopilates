import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("registrations").order("desc").take(100);
  },
});

export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.string(),
    package: v.string(),
    price: v.number(),
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

export const updateStatus = mutation({
  args: {
    id: v.id("registrations"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
    });
  },
});