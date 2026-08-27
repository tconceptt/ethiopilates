import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { scheduleValidator } from "./schema";

/**
 * Spots per slot for a class, or null when unlimited.
 *
 * Falls back to the legacy `classSettings` table so capacity limits configured
 * before the content tables were seeded keep being enforced.
 */
export async function capacityForClass(
  ctx: QueryCtx,
  classKey: string,
): Promise<number | null> {
  const cls = await ctx.db
    .query("classes")
    .withIndex("by_key", (q) => q.eq("key", classKey))
    .unique();
  if (cls) return cls.capacity ?? null;

  const legacy = await ctx.db
    .query("classSettings")
    .withIndex("by_classKey", (q) => q.eq("classKey", classKey))
    .unique();
  return legacy?.capacity ?? null;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const classes = await ctx.db.query("classes").take(200);
    return classes.sort((a, b) => a.order - b.order);
  },
});

async function classByKey(ctx: MutationCtx, classKey: string) {
  return await ctx.db
    .query("classes")
    .withIndex("by_key", (q) => q.eq("key", classKey))
    .unique();
}

export const create = mutation({
  args: {
    key: v.string(),
    label: v.string(),
    blurb: v.string(),
  },
  handler: async (ctx, args) => {
    const key = args.key.trim();
    if (!/^[a-z0-9-]+$/.test(key)) {
      throw new Error("Class ID must be lowercase letters, numbers and dashes.");
    }
    if (await classByKey(ctx, key)) {
      throw new Error("A class with that ID already exists.");
    }
    const existing = await ctx.db.query("classes").take(200);
    const order = existing.reduce((max, c) => Math.max(max, c.order), -1) + 1;
    return await ctx.db.insert("classes", {
      key,
      label: args.label.trim() || key,
      blurb: args.blurb.trim(),
      order,
      active: true,
      showOnWeeklySchedule: false,
      schedule: [],
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("classes"),
    label: v.string(),
    blurb: v.string(),
    active: v.boolean(),
    showOnWeeklySchedule: v.boolean(),
    capacity: v.union(v.number(), v.null()),
    pricingGroupIds: v.array(v.id("pricingGroups")),
    schedule: scheduleValidator,
  },
  handler: async (ctx, args) => {
    const { id, capacity, pricingGroupIds, schedule, ...rest } = args;
    await ctx.db.patch(id, {
      ...rest,
      capacity:
        capacity === null ? undefined : Math.max(1, Math.floor(capacity)),
      // Empty means "offer every package", which the booking page reads from
      // an absent field — so don't store an empty array.
      pricingGroupIds: pricingGroupIds.length ? pricingGroupIds : undefined,
      // Drop empty days so the weekly schedule and booking calendar don't have
      // to filter them out everywhere.
      schedule: schedule
        .map((d) => ({
          day: d.day,
          slots: d.slots.map((s) => s.trim()).filter(Boolean),
        }))
        .filter((d) => d.slots.length > 0),
    });
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("classes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

/** Swap a class with its neighbour to move it up or down the list. */
export const reorder = mutation({
  args: { id: v.id("classes"), direction: v.union(v.literal(-1), v.literal(1)) },
  handler: async (ctx, args) => {
    const all = (await ctx.db.query("classes").take(200)).sort(
      (a, b) => a.order - b.order,
    );
    const index = all.findIndex((c) => c._id === args.id);
    const swapWith = index + args.direction;
    if (index === -1 || swapWith < 0 || swapWith >= all.length) return null;
    await ctx.db.patch(all[index]._id, { order: all[swapWith].order });
    await ctx.db.patch(all[swapWith]._id, { order: all[index].order });
    return null;
  },
});

// Booked counts per slot for a class on a given day. Returns null when the
// class has no capacity limit, so the UI can hide spot counts entirely.
export const availability = query({
  args: { classKey: v.string(), classDate: v.string() },
  handler: async (ctx, args) => {
    const capacity = await capacityForClass(ctx, args.classKey);
    if (capacity === null) return null;

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
      capacity,
      slots: Array.from(counts, ([slot, booked]) => ({ slot, booked })),
    };
  },
});
