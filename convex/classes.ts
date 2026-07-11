import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("classSettings").take(100);
  },
});

// capacity: null clears the limit for the class.
export const setCapacity = mutation({
  args: {
    classKey: v.string(),
    capacity: v.union(v.number(), v.null()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("classSettings")
      .withIndex("by_classKey", (q) => q.eq("classKey", args.classKey))
      .unique();
    if (args.capacity === null) {
      if (existing) await ctx.db.delete(existing._id);
      return null;
    }
    const capacity = Math.max(1, Math.floor(args.capacity));
    if (existing) {
      await ctx.db.patch(existing._id, { capacity });
    } else {
      await ctx.db.insert("classSettings", { classKey: args.classKey, capacity });
    }
    return null;
  },
});

// Booked counts per slot for a class on a given day. Returns null when the
// class has no capacity limit, so the UI can hide spot counts entirely.
export const availability = query({
  args: { classKey: v.string(), classDate: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("classSettings")
      .withIndex("by_classKey", (q) => q.eq("classKey", args.classKey))
      .unique();
    if (!setting || setting.capacity === undefined) return null;

    const bookings = await ctx.db
      .query("registrations")
      .withIndex("by_classKey_and_classDate_and_classSlot", (q) =>
        q.eq("classKey", args.classKey).eq("classDate", args.classDate),
      )
      .take(1000);

    // Array instead of a record: slot labels contain non-ASCII characters
    // (en dashes), which are invalid as Convex object field names.
    const counts = new Map<string, number>();
    for (const booking of bookings) {
      if (booking.status === "cancelled" || !booking.classSlot) continue;
      counts.set(booking.classSlot, (counts.get(booking.classSlot) ?? 0) + 1);
    }
    return {
      capacity: setting.capacity,
      slots: Array.from(counts, ([slot, booked]) => ({ slot, booked })),
    };
  },
});
