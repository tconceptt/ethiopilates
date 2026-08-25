import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { pricingSectionValidator, tiersValidator } from "./schema";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const groups = await ctx.db.query("pricingGroups").take(200);
    return groups.sort((a, b) => a.order - b.order);
  },
});

export const create = mutation({
  args: { section: pricingSectionValidator, title: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("pricingGroups").take(200);
    const order =
      all
        .filter((g) => g.section === args.section)
        .reduce((max, g) => Math.max(max, g.order), -1) + 1;
    return await ctx.db.insert("pricingGroups", {
      section: args.section,
      title: args.title.trim() || "Untitled package",
      order,
      tiers: [{ label: "1 Month", price: "0" }],
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("pricingGroups"),
    title: v.string(),
    subtitle: v.string(),
    featured: v.boolean(),
    tiers: tiersValidator,
  },
  handler: async (ctx, args) => {
    const subtitle = args.subtitle.trim();
    await ctx.db.patch(args.id, {
      title: args.title.trim(),
      subtitle: subtitle === "" ? undefined : subtitle,
      featured: args.featured ? true : undefined,
      tiers: args.tiers
        .map((t) => ({
          label: t.label.trim(),
          price: t.price.trim(),
          note: t.note?.trim() ? t.note.trim() : undefined,
        }))
        .filter((t) => t.label !== "" || t.price !== ""),
    });
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("pricingGroups") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

/** Swap a group with its neighbour inside the same section. */
export const reorder = mutation({
  args: {
    id: v.id("pricingGroups"),
    direction: v.union(v.literal(-1), v.literal(1)),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.id);
    if (!group) return null;
    const siblings = (await ctx.db.query("pricingGroups").take(200))
      .filter((g) => g.section === group.section)
      .sort((a, b) => a.order - b.order);
    const index = siblings.findIndex((g) => g._id === args.id);
    const swapWith = index + args.direction;
    if (swapWith < 0 || swapWith >= siblings.length) return null;
    await ctx.db.patch(siblings[index]._id, { order: siblings[swapWith].order });
    await ctx.db.patch(siblings[swapWith]._id, { order: siblings[index].order });
    return null;
  },
});
