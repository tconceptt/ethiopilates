import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { capacityForClass } from "./classes";

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
    phone: v.optional(v.string()),
    package: v.string(),
    price: v.number(),
    schedule: v.optional(v.string()),
    experienceLevel: v.optional(v.string()),
    goals: v.optional(v.string()),
    isMember: v.optional(v.boolean()),
    classKey: v.optional(v.string()),
    classDate: v.optional(v.string()),
    classSlot: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Enforce capacity when the class has a limit configured. Mutations are
    // transactions, so concurrent bookings can't oversell the slot.
    if (args.classKey && args.classDate && args.classSlot) {
      const capacity = await capacityForClass(ctx, args.classKey);
      if (capacity !== null) {
        const existing = await ctx.db
          .query("registrations")
          .withIndex("by_classKey_and_classDate_and_classSlot", (q) =>
            q
              .eq("classKey", args.classKey)
              .eq("classDate", args.classDate)
              .eq("classSlot", args.classSlot),
          )
          .take(500);
        const active = existing.filter((r) => r.status !== "cancelled").length;
        if (active >= capacity) {
          throw new Error("CLASS_FULL");
        }
      }
    }

    const registrationId = await ctx.db.insert("registrations", {
      ...args,
      status: args.isMember ? "confirmed" : "pending",
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
