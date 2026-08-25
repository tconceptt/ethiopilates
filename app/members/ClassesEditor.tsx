"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { ChevronDown, ChevronUp, Copy, Plus, Trash2 } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import { DAY_KEYS, DAY_LABELS, type DayKey, type ScheduleDay } from "../../lib/classes";
import {
  Field,
  IconButton,
  Panel,
  SaveBar,
  Spinner,
  Toggle,
  inputClass,
  useDraft,
} from "./ui";

type ClassDraft = {
  label: string;
  blurb: string;
  active: boolean;
  showOnWeeklySchedule: boolean;
  /** Kept as text so "no limit" can be expressed as an empty field. */
  capacity: string;
  /** Always all seven days, so days can be filled in without extra state. */
  schedule: ScheduleDay[];
};

/** Matches the `^[a-z0-9-]+$` rule the create mutation enforces. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDraft(doc: Doc<"classes">): ClassDraft {
  return {
    label: doc.label,
    blurb: doc.blurb,
    active: doc.active,
    showOnWeeklySchedule: doc.showOnWeeklySchedule,
    capacity: doc.capacity === undefined ? "" : String(doc.capacity),
    schedule: DAY_KEYS.map((day) => ({
      day,
      slots: doc.schedule.find((d) => d.day === day)?.slots ?? [],
    })),
  };
}

export default function ClassesEditor() {
  const classes = useQuery(api.classes.list);
  const createClass = useMutation(api.classes.create);
  const [isAdding, setIsAdding] = useState(false);
  const [newClass, setNewClass] = useState({ key: "", label: "", blurb: "" });
  const [keyEdited, setKeyEdited] = useState(false);
  const [addError, setAddError] = useState("");

  const handleAdd = async () => {
    setAddError("");
    try {
      await createClass(newClass);
      setNewClass({ key: "", label: "", blurb: "" });
      setKeyEdited(false);
      setIsAdding(false);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Could not add the class.");
    }
  };

  return (
    <Panel
      title="Classes & schedule"
      description="Names, descriptions, weekly time slots and capacity. These drive the booking page, the weekly schedule on the home page, and how many people can reserve each slot."
      action={
        <button
          type="button"
          onClick={() => setIsAdding((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2.5 rounded-sm transition-colors shrink-0"
        >
          <Plus size={14} />
          Add class
        </button>
      }
    >
      {isAdding && (
        <div className="px-6 md:px-8 py-6 border-b border-stone-100 bg-primary/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Class name">
              <input
                value={newClass.label}
                onChange={(e) => {
                  const label = e.target.value;
                  setNewClass((prev) => ({
                    ...prev,
                    label,
                    // Suggest an ID from the name until the admin types their own.
                    key: keyEdited ? prev.key : slugify(label),
                  }));
                }}
                placeholder="e.g. Barre"
                className={inputClass}
              />
            </Field>
            <Field label="Class ID" hint="Permanent. Lowercase letters, numbers and dashes.">
              <input
                value={newClass.key}
                onChange={(e) => {
                  setKeyEdited(true);
                  // Sanitize as they type, but keep trailing dashes so a
                  // multi-word ID can still be typed out.
                  const key = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]+/g, "-")
                    .replace(/^-+/, "");
                  setNewClass((prev) => ({ ...prev, key }));
                }}
                placeholder="e.g. barre"
                className={`${inputClass} font-mono`}
              />
            </Field>
            <Field label="Short description">
              <input
                value={newClass.blurb}
                onChange={(e) => setNewClass((prev) => ({ ...prev, blurb: e.target.value }))}
                placeholder="Shown on the booking page"
                className={inputClass}
              />
            </Field>
          </div>
          {addError && <p className="text-sm text-red-600 mt-3">{addError}</p>}
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newClass.key.trim() || !newClass.label.trim()}
              className="text-xs bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded transition-colors uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create class
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setAddError("");
              }}
              className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800 px-3 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {classes === undefined ? (
        <Spinner label="Loading classes..." />
      ) : classes.length === 0 ? (
        <div className="text-center py-12 text-stone-500 text-sm">
          No classes yet — add one to start taking bookings.
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          {classes.map((cls, index) => (
            <ClassCard
              key={cls._id}
              cls={cls}
              isFirst={index === 0}
              isLast={index === classes.length - 1}
            />
          ))}
        </div>
      )}
    </Panel>
  );
}

function ClassCard({
  cls,
  isFirst,
  isLast,
}: {
  cls: Doc<"classes">;
  isFirst: boolean;
  isLast: boolean;
}) {
  const updateClass = useMutation(api.classes.update);
  const removeClass = useMutation(api.classes.remove);
  const reorder = useMutation(api.classes.reorder);
  const { draft, isDirty, update, reset, markSaved } = useDraft(toDraft(cls));
  const [isSaving, setIsSaving] = useState(false);

  if (!draft) return null;

  const setSlots = (day: DayKey, slots: string[]) =>
    update({
      schedule: draft.schedule.map((d) => (d.day === day ? { day, slots } : d)),
    });

  const copyToWeekdays = (day: DayKey) => {
    const slots = draft.schedule.find((d) => d.day === day)?.slots ?? [];
    const weekdays: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    update({
      schedule: draft.schedule.map((d) =>
        weekdays.includes(d.day) ? { day: d.day, slots: [...slots] } : d,
      ),
    });
  };

  const handleSave = async () => {
    const capacity = draft.capacity.trim();
    const parsed = capacity === "" ? null : Number(capacity);
    if (parsed !== null && (!Number.isFinite(parsed) || parsed < 1)) {
      alert("Capacity must be a number of 1 or more, or empty for no limit.");
      return;
    }
    setIsSaving(true);
    try {
      await updateClass({
        id: cls._id as Id<"classes">,
        label: draft.label,
        blurb: draft.blurb,
        active: draft.active,
        showOnWeeklySchedule: draft.showOnWeeklySchedule,
        capacity: parsed,
        schedule: draft.schedule,
      });
      markSaved();
    } catch (err) {
      console.error("Failed to save class:", err);
      alert("Failed to save this class.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Delete "${cls.label}"? Existing bookings are kept, but the class disappears from the booking page. To hide it temporarily, untick "Open for booking" instead.`,
      )
    ) {
      return;
    }
    await removeClass({ id: cls._id as Id<"classes"> });
  };

  return (
    <div className="px-6 md:px-8 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div className="min-w-0 flex-1">
          <input
            value={draft.label}
            onChange={(e) => update({ label: e.target.value })}
            className="w-full font-serif text-xl text-primary-dark bg-transparent border-b border-transparent hover:border-stone-200 focus:border-primary outline-none py-1"
          />
          <span className="inline-block text-[11px] font-mono text-stone-400 mt-1">
            {cls.key}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <IconButton
            label="Move up"
            disabled={isFirst}
            onClick={() => reorder({ id: cls._id as Id<"classes">, direction: -1 })}
          >
            <ChevronUp size={16} />
          </IconButton>
          <IconButton
            label="Move down"
            disabled={isLast}
            onClick={() => reorder({ id: cls._id as Id<"classes">, direction: 1 })}
          >
            <ChevronDown size={16} />
          </IconButton>
          <IconButton label="Delete class" danger onClick={handleDelete}>
            <Trash2 size={16} />
          </IconButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2">
          <Field label="Description" hint="Shown under the class name on the booking page.">
            <textarea
              value={draft.blurb}
              onChange={(e) => update({ blurb: e.target.value })}
              rows={2}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="space-y-4">
          <Field label="Spots per slot" hint="Empty means no limit and no spot counts.">
            <input
              type="number"
              min={1}
              value={draft.capacity}
              onChange={(e) => update({ capacity: e.target.value })}
              placeholder="No limit"
              className={inputClass}
            />
          </Field>
          <Toggle
            label="Open for booking"
            hint="Off hides the class from the booking page."
            checked={draft.active}
            onChange={(active) => update({ active })}
          />
          <Toggle
            label="Show in weekly schedule"
            hint="Lists this class in the home page schedule."
            checked={draft.showOnWeeklySchedule}
            onChange={(showOnWeeklySchedule) => update({ showOnWeeklySchedule })}
          />
        </div>
      </div>

      <div>
        <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
          Weekly time slots
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {draft.schedule.map(({ day, slots }) => (
            <div
              key={day}
              className={`rounded-sm border p-3 ${
                slots.length ? "border-stone-200 bg-white" : "border-dashed border-stone-200 bg-stone-50/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-medium text-stone-700">{DAY_LABELS[day]}</span>
                {slots.length > 0 && (
                  <button
                    type="button"
                    onClick={() => copyToWeekdays(day)}
                    title="Copy these slots to Monday–Friday"
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-stone-400 hover:text-primary"
                  >
                    <Copy size={11} />
                    To weekdays
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {slots.map((slot, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      value={slot}
                      onChange={(e) =>
                        setSlots(
                          day,
                          slots.map((s, j) => (j === i ? e.target.value : s)),
                        )
                      }
                      placeholder="9:00–10:00 AM"
                      className={inputClass}
                    />
                    <IconButton
                      label="Remove slot"
                      danger
                      onClick={() => setSlots(day, slots.filter((_, j) => j !== i))}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setSlots(day, [...slots, ""])}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary hover:text-primary-dark"
                >
                  <Plus size={14} />
                  Add slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SaveBar isDirty={isDirty} isSaving={isSaving} onSave={handleSave} onReset={reset}>
        {!draft.active && <span className="text-amber-600">Hidden from the booking page</span>}
      </SaveBar>
    </div>
  );
}
