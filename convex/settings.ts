import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const SINGLETON = "singleton";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", SINGLETON))
      .unique();
  },
});

export const update = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const clean = {
      ...args,
      advancePayment: Math.max(0, Math.round(args.advancePayment)),
      included: args.included.map((s) => s.trim()).filter(Boolean),
      policies: args.policies.map((s) => s.trim()).filter(Boolean),
      contactPhones: args.contactPhones.map((s) => s.trim()).filter(Boolean),
    };
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", SINGLETON))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, clean);
    } else {
      await ctx.db.insert("siteSettings", { key: SINGLETON, ...clean });
    }
    return null;
  },
});
