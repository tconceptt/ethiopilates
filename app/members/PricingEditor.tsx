"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import {
  PRICING_SECTIONS,
  PRICING_SECTION_LABELS,
  type PricingSection,
  type PricingTier,
} from "../../convex/defaults";
import { Field, IconButton, Panel, SaveBar, Spinner, Toggle, inputClass, useDraft } from "./ui";

const SECTION_HINTS: Record<PricingSection, string> = {
  programs: "Wide cards at the top of the pricing section. The subtitle is the frequency line (e.g. \"3 sessions a week\").",
  memberships: "Two-column cards for unlimited and multi-class access.",
  classPackages: "Compact cards, one per class type.",
  specialty: "Dark cards for focused and private sessions.",
};

type GroupDraft = {
  title: string;
  subtitle: string;
  featured: boolean;
  tiers: PricingTier[];
};

function toDraft(doc: Doc<"pricingGroups">): GroupDraft {
  return {
    title: doc.title,
    subtitle: doc.subtitle ?? "",
    featured: doc.featured ?? false,
    tiers: doc.tiers.map((t) => ({ ...t, note: t.note ?? "" })),
  };
}

export default function PricingEditor() {
  const groups = useQuery(api.pricing.list);

  return (
    <Panel
      title="Package prices"
      description="Everything in the pricing section of the home page. Prices are free text, so you can write “30,000” or “From 30,000”."
    >
      {groups === undefined ? (
        <Spinner label="Loading prices..." />
      ) : (
        <div className="divide-y divide-stone-100">
          {PRICING_SECTIONS.map((section) => (
            <SectionBlock
              key={section}
              section={section}
              groups={groups.filter((g) => g.section === section)}
            />
          ))}
        </div>
      )}
    </Panel>
  );
}

function SectionBlock({
  section,
  groups,
}: {
  section: PricingSection;
  groups: Doc<"pricingGroups">[];
}) {
  const createGroup = useMutation(api.pricing.create);

  return (
    <div className="px-6 md:px-8 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h3 className="font-serif text-xl text-primary-dark">
            {PRICING_SECTION_LABELS[section]}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">{SECTION_HINTS[section]}</p>
        </div>
        <button
          type="button"
          onClick={() => createGroup({ section, title: "New package" })}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2.5 rounded-sm transition-colors shrink-0"
        >
          <Plus size={14} />
          Add package
        </button>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-stone-400 py-4">
          Nothing here yet — this section is hidden on the home page.
        </p>
      ) : (
        <div className="space-y-4">
          {groups.map((group, index) => (
            <GroupCard
              key={group._id}
              group={group}
              isFirst={index === 0}
              isLast={index === groups.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupCard({
  group,
  isFirst,
  isLast,
}: {
  group: Doc<"pricingGroups">;
  isFirst: boolean;
  isLast: boolean;
}) {
  const updateGroup = useMutation(api.pricing.update);
  const removeGroup = useMutation(api.pricing.remove);
  const reorder = useMutation(api.pricing.reorder);
  const { draft, isDirty, update, reset, markSaved } = useDraft(toDraft(group));
  const [isSaving, setIsSaving] = useState(false);

  if (!draft) return null;

  const setTier = (index: number, patch: Partial<PricingTier>) =>
    update({
      tiers: draft.tiers.map((t, i) => (i === index ? { ...t, ...patch } : t)),
    });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateGroup({
        id: group._id as Id<"pricingGroups">,
        title: draft.title,
        subtitle: draft.subtitle,
        featured: draft.featured,
        tiers: draft.tiers,
      });
      markSaved();
    } catch (err) {
      console.error("Failed to save package:", err);
      alert("Failed to save this package.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${group.title}" from the pricing section?`)) return;
    await removeGroup({ id: group._id as Id<"pricingGroups"> });
  };

  return (
    <div className="border border-stone-200 rounded-sm p-4 md:p-5">
      <div className="flex flex-wrap items-start gap-3 mb-4">
        <div className="min-w-[240px] flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Title">
            <input
              value={draft.title}
              onChange={(e) => update({ title: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field
            label={group.section === "programs" ? "Frequency line" : "Subtitle"}
          >
            <input
              value={draft.subtitle}
              onChange={(e) => update({ subtitle: e.target.value })}
              placeholder="Optional"
              className={inputClass}
            />
          </Field>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 pt-6">
          <IconButton
            label="Move up"
            disabled={isFirst}
            onClick={() => reorder({ id: group._id as Id<"pricingGroups">, direction: -1 })}
          >
            <ChevronUp size={16} />
          </IconButton>
          <IconButton
            label="Move down"
            disabled={isLast}
            onClick={() => reorder({ id: group._id as Id<"pricingGroups">, direction: 1 })}
          >
            <ChevronDown size={16} />
          </IconButton>
          <IconButton label="Delete package" danger onClick={handleDelete}>
            <Trash2 size={16} />
          </IconButton>
        </div>
      </div>

      {group.section === "programs" && (
        <div className="mb-4">
          <Toggle
            label="Highlight this card"
            hint="Renders it in the dark, featured style."
            checked={draft.featured}
            onChange={(featured) => update({ featured })}
          />
        </div>
      )}

      <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
        Price rows
      </span>
      <div className="space-y-2">
        <div className="hidden sm:grid grid-cols-[1fr_1fr_1.5fr_auto] gap-2 text-[10px] uppercase tracking-wider text-stone-400">
          <span>Duration</span>
          <span>Price (ETB)</span>
          <span>Small print</span>
          <span className="w-8" />
        </div>
        {draft.tiers.map((tier, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.5fr_auto] gap-2">
            <input
              value={tier.label}
              onChange={(e) => setTier(i, { label: e.target.value })}
              placeholder="1 Month"
              className={inputClass}
            />
            <input
              value={tier.price}
              onChange={(e) => setTier(i, { price: e.target.value })}
              placeholder="30,000"
              className={inputClass}
            />
            <input
              value={tier.note ?? ""}
              onChange={(e) => setTier(i, { note: e.target.value })}
              placeholder="Optional, e.g. 8 sessions"
              className={inputClass}
            />
            <IconButton
              label="Remove row"
              danger
              onClick={() => update({ tiers: draft.tiers.filter((_, j) => j !== i) })}
            >
              <Trash2 size={14} />
            </IconButton>
          </div>
        ))}
        <button
          type="button"
          onClick={() => update({ tiers: [...draft.tiers, { label: "", price: "", note: "" }] })}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary hover:text-primary-dark"
        >
          <Plus size={14} />
          Add row
        </button>
      </div>

      <SaveBar isDirty={isDirty} isSaving={isSaving} onSave={handleSave} onReset={reset} />
    </div>
  );
}
