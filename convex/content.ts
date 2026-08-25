import { mutation } from "./_generated/server";
import {
  DEFAULT_CLASSES,
  DEFAULT_PRICING,
  DEFAULT_SETTINGS,
} from "./defaults";

/**
 * Copies the built-in defaults into the editable tables the first time an
 * admin opens the dashboard. Each table is seeded independently and only when
 * empty, so this never overwrites edits and is safe to call on every load.
 */
export const seedIfEmpty = mutation({
  args: {},
  handler: async (ctx) => {
    const seeded: string[] = [];

    const classes = await ctx.db.query("classes").take(1);
    if (classes.length === 0) {
      // Carry over capacities set through the old class-capacity settings.
      const legacy = await ctx.db.query("classSettings").take(100);
      for (const cls of DEFAULT_CLASSES) {
        const capacity = legacy.find((s) => s.classKey === cls.key)?.capacity;
        await ctx.db.insert("classes", { ...cls, capacity });
      }
      seeded.push("classes");
    }

    const pricing = await ctx.db.query("pricingGroups").take(1);
    if (pricing.length === 0) {
      for (const group of DEFAULT_PRICING) {
        await ctx.db.insert("pricingGroups", group);
      }
      seeded.push("pricing");
    }

    const settings = await ctx.db.query("siteSettings").take(1);
    if (settings.length === 0) {
      await ctx.db.insert("siteSettings", {
        key: "singleton",
        ...DEFAULT_SETTINGS,
      });
      seeded.push("settings");
    }

    return seeded;
  },
});
