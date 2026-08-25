"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import {
  DEFAULT_CLASSES,
  DEFAULT_PRICING,
  DEFAULT_SETTINGS,
  type PricingGroupContent,
  type PricingSection,
  type SettingsContent,
} from "../convex/defaults";
import type { SiteClass } from "./classes";

/**
 * Site content comes from Convex once an admin has opened the dashboard (which
 * seeds the tables). Until then the tables are empty and we render the built-in
 * defaults, so the public site looks identical either way.
 *
 * `isLoading` is kept separate from the empty-table case on purpose: rendering
 * defaults while the real values are still in flight would flash outdated
 * prices at visitors.
 */
export function useClasses(): { classes: SiteClass[]; isLoading: boolean } {
  const rows = useQuery(api.classes.list);
  if (rows === undefined) return { classes: [], isLoading: true };
  const classes: SiteClass[] = rows.length > 0 ? rows : DEFAULT_CLASSES;
  return { classes: classes.filter((c) => c.active), isLoading: false };
}

export function usePricing(): {
  groups: PricingGroupContent[];
  isLoading: boolean;
} {
  const rows = useQuery(api.pricing.list);
  if (rows === undefined) return { groups: [], isLoading: true };
  return { groups: rows.length > 0 ? rows : DEFAULT_PRICING, isLoading: false };
}

export function pricingSection(
  groups: PricingGroupContent[],
  section: PricingSection,
): PricingGroupContent[] {
  return groups.filter((g) => g.section === section);
}

export function useSettings(): {
  settings: SettingsContent;
  isLoading: boolean;
} {
  const row = useQuery(api.settings.get);
  if (row === undefined) return { settings: DEFAULT_SETTINGS, isLoading: true };
  return { settings: row ?? DEFAULT_SETTINGS, isLoading: false };
}
