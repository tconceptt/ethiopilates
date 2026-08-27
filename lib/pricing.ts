import type { PricingGroupContent, PricingSection } from "../convex/defaults";
import type { SiteClass } from "./classes";

/** A pricing group as it comes back from Convex; `_id` is absent for defaults. */
export type PricingGroup = PricingGroupContent & { _id?: string };

/** One selectable line item: a package card plus one of its price rows. */
export type PackageOption = {
  /** Stable within a render, and unique enough to key radio inputs. */
  id: string;
  section: PricingSection;
  title: string;
  subtitle?: string;
  tierLabel: string;
  /** As written in the Prices tab, e.g. "30,000" or "From 30,000". */
  priceLabel: string;
  /** Parsed ETB amount, or null when the label isn't a plain number. */
  price: number | null;
  note?: string;
  /** Pay-per-class rows, shown apart from the multi-month packages. */
  isDropIn: boolean;
};

/**
 * ETB amount from a free-text price row. Admins type "30,000" or "From
 * 30,000", so we take the first run of digits and separators. Anything with no
 * digits at all (e.g. "On request") returns null, and the admin enters the
 * amount by hand when marking the booking paid.
 */
export function parsePrice(text: string): number | null {
  const match = text.match(/\d[\d,.\s]*/);
  if (!match) return null;
  const digits = match[0].replace(/[^\d]/g, "");
  if (digits === "") return null;
  const value = Number(digits);
  return Number.isFinite(value) ? value : null;
}

/** Booking-page order: single class first, all-access commitments last. */
const SECTION_ORDER: PricingSection[] = [
  "classPackages",
  "programs",
  "specialty",
  "memberships",
];

function isDropInLabel(label: string): boolean {
  return /drop.?in|single|per class|1 session/i.test(label);
}

export function packageOptionKey(
  title: string,
  subtitle: string | undefined,
  tierLabel: string,
): string {
  return `${title}|${subtitle ?? ""}|${tierLabel}`;
}

/**
 * The packages a class offers, flattened to one option per price row.
 *
 * A class can shortlist packages in the Classes tab. When it hasn't — or when
 * the site is still rendering the built-in defaults, which have no ids to
 * match on — every package is offered rather than none, so booking never dead
 * ends on unconfigured content.
 */
export function packageOptionsForClass(
  groups: PricingGroup[],
  cls: Pick<SiteClass, "pricingGroupIds"> | null,
): PackageOption[] {
  const shortlist = cls?.pricingGroupIds ?? [];
  const matched = shortlist.length
    ? groups.filter((g) => g._id !== undefined && shortlist.includes(g._id))
    : [];
  const selected = matched.length > 0 ? matched : groups;

  // `order` is assigned per section, so the query's global sort interleaves
  // sections. Re-sort here: the granular per-class options first, the
  // all-access memberships last, so the list reads cheapest commitment up.
  const sorted = [...selected].sort(
    (a, b) =>
      SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section) ||
      a.order - b.order,
  );

  return sorted.flatMap((group) =>
    group.tiers
      .filter((tier) => tier.label.trim() !== "" || tier.price.trim() !== "")
      .map((tier) => ({
        id: packageOptionKey(group.title, group.subtitle, tier.label),
        section: group.section,
        title: group.title,
        subtitle: group.subtitle,
        tierLabel: tier.label,
        priceLabel: tier.price,
        price: parsePrice(tier.price),
        note: tier.note,
        isDropIn: isDropInLabel(tier.label),
      })),
  );
}

/** "Group Reformer · 2 sessions a week — 3 Months" */
export function packageSummary(reg: {
  packageTitle?: string;
  packageSubtitle?: string;
  packageTier?: string;
}): string | null {
  if (!reg.packageTitle) return null;
  const head = reg.packageSubtitle
    ? `${reg.packageTitle} · ${reg.packageSubtitle}`
    : reg.packageTitle;
  return reg.packageTier ? `${head} — ${reg.packageTier}` : head;
}
