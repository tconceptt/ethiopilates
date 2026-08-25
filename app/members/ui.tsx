"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export const inputClass =
  "w-full px-3 py-2 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm bg-white";

export function Panel({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-sm shadow-md overflow-hidden mb-8">
      <div className="p-6 md:p-8 border-b border-stone-100 bg-stone-50/50 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-serif text-2xl text-primary-dark mb-1">{title}</h2>
          {description && <p className="text-sm text-stone-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="block text-xs text-stone-400 mt-1">{hint}</span>}
    </label>
  );
}

export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-[var(--color-primary,#8a6a4f)] shrink-0"
      />
      <span className="min-w-0">
        <span className="block text-sm text-stone-700">{label}</span>
        {hint && <span className="block text-xs text-stone-400">{hint}</span>}
      </span>
    </label>
  );
}

export function SaveBar({
  isDirty,
  isSaving,
  onSave,
  onReset,
  children,
}: {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onReset?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-5 border-t border-stone-100">
      <div className="flex items-center gap-2 text-xs text-stone-400">{children}</div>
      <div className="flex items-center gap-2">
        {isDirty && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800 px-3 py-2"
          >
            Discard
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className="text-xs bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-widest"
        >
          {isSaving ? "Saving..." : isDirty ? "Save" : "Saved"}
        </button>
      </div>
    </div>
  );
}

export function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 inline-flex items-center justify-center rounded-sm border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        danger
          ? "border-red-200 text-red-500 hover:bg-red-50"
          : "border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

/** Editable list of plain strings — used for bullet lists and phone numbers. */
export function StringListEditor({
  items,
  onChange,
  placeholder,
  addLabel,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={item}
            placeholder={placeholder}
            onChange={(e) =>
              onChange(items.map((v, j) => (j === i ? e.target.value : v)))
            }
            className={inputClass}
          />
          <IconButton
            label="Remove"
            danger
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            <Trash2 size={14} />
          </IconButton>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary hover:text-primary-dark"
      >
        <Plus size={14} />
        {addLabel}
      </button>
    </div>
  );
}

/**
 * Local edit buffer for a Convex document. Live query updates are adopted only
 * while the form is clean, so a colleague saving elsewhere never wipes out
 * half-typed edits.
 */
export function useDraft<T>(remote: T | undefined) {
  const remoteJson = JSON.stringify(remote ?? null);
  const [state, setState] = useState(() => ({
    draft: remote,
    /** Serialized `remote` the draft was last taken from. */
    base: remoteJson,
    isDirty: false,
  }));

  // Adjusting state during render (rather than in an effect) is React's
  // recommended way to re-derive from changing inputs — no extra pass.
  if (state.base !== remoteJson && !state.isDirty) {
    setState({ draft: remote, base: remoteJson, isDirty: false });
  }

  const update = (patch: Partial<T>) =>
    setState((current) => ({
      ...current,
      draft: current.draft === undefined ? current.draft : { ...current.draft, ...patch },
      isDirty: true,
    }));

  const reset = () => setState({ draft: remote, base: remoteJson, isDirty: false });

  return {
    draft: state.draft,
    isDirty: state.isDirty,
    update,
    reset,
    markSaved: () => setState((current) => ({ ...current, isDirty: false })),
  };
}

export function Spinner({ label }: { label: string }) {
  return (
    <div className="text-center py-12 text-stone-500 flex flex-col items-center gap-3">
      <div className="w-6 h-6 border-4 border-stone-200 border-t-primary rounded-full animate-spin"></div>
      <p className="text-sm">{label}</p>
    </div>
  );
}
