"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  DEFAULT_SETTINGS,
  whatsappLink,
  type SettingsContent,
} from "../../convex/defaults";
import {
  Field,
  Panel,
  SaveBar,
  Spinner,
  StringListEditor,
  inputClass,
  useDraft,
} from "./ui";

type SettingsDraft = Omit<SettingsContent, "advancePayment"> & {
  /** Text so the field can be cleared while typing. */
  advancePayment: string;
};

export default function SettingsEditor() {
  const settings = useQuery(api.settings.get);
  const updateSettings = useMutation(api.settings.update);
  const [isSaving, setIsSaving] = useState(false);

  const remote: SettingsDraft | undefined =
    settings === undefined
      ? undefined
      : (() => {
          const source: SettingsContent = settings ?? DEFAULT_SETTINGS;
          return { ...source, advancePayment: String(source.advancePayment) };
        })();

  const { draft, isDirty, update, reset, markSaved } = useDraft(remote);

  if (settings === undefined || !draft) {
    return (
      <Panel title="Booking & site settings">
        <Spinner label="Loading settings..." />
      </Panel>
    );
  }

  const handleSave = async () => {
    const advancePayment = Number(draft.advancePayment.trim());
    if (!Number.isFinite(advancePayment) || advancePayment < 0) {
      alert("Advance payment must be a number of 0 or more.");
      return;
    }
    setIsSaving(true);
    try {
      await updateSettings({
        advancePayment,
        telebirrAccountName: draft.telebirrAccountName,
        telebirrAccountNumber: draft.telebirrAccountNumber,
        whatsappNumber: draft.whatsappNumber,
        pricingIntro: draft.pricingIntro,
        scheduleIntro: draft.scheduleIntro,
        included: draft.included,
        policies: draft.policies,
        contactPhones: draft.contactPhones,
        contactEmail: draft.contactEmail,
        contactAddress: draft.contactAddress,
      });
      markSaved();
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Panel
      title="Booking & site settings"
      description="Payment details shown to guests, the copy above the schedule and pricing sections, and the contact details in the footer."
    >
      <div className="px-6 md:px-8 py-6 space-y-8">
        <section>
          <SubHeading title="Booking & payment" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Advance payment (ETB)"
              hint="What a guest sends to hold a spot. Shown on the booking page and recorded on each registration."
            >
              <input
                type="number"
                min={0}
                value={draft.advancePayment}
                onChange={(e) => update({ advancePayment: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Telebirr account name">
              <input
                value={draft.telebirrAccountName}
                onChange={(e) => update({ telebirrAccountName: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Telebirr account number">
              <input
                value={draft.telebirrAccountNumber}
                onChange={(e) => update({ telebirrAccountNumber: e.target.value })}
                className={`${inputClass} font-mono`}
              />
            </Field>
            <Field
              label="WhatsApp number"
              hint={`Chat link: ${whatsappLink(draft.whatsappNumber)}`}
            >
              <input
                value={draft.whatsappNumber}
                onChange={(e) => update({ whatsappNumber: e.target.value })}
                placeholder="+251 98 331 4853"
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section>
          <SubHeading title="Home page copy" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Schedule intro" hint="Paragraph under the “Weekly schedule” heading.">
              <textarea
                value={draft.scheduleIntro}
                onChange={(e) => update({ scheduleIntro: e.target.value })}
                rows={3}
                className={inputClass}
              />
            </Field>
            <Field label="Pricing intro" hint="Paragraph under the “Pilates packages” heading.">
              <textarea
                value={draft.pricingIntro}
                onChange={(e) => update({ pricingIntro: e.target.value })}
                rows={3}
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section>
          <SubHeading title="What's included & policies" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="What's included">
              <StringListEditor
                items={draft.included}
                onChange={(included) => update({ included })}
                placeholder="e.g. Expert instruction"
                addLabel="Add item"
              />
            </Field>
            <Field label="Studio policies">
              <StringListEditor
                items={draft.policies}
                onChange={(policies) => update({ policies })}
                placeholder="e.g. 24-hour cancellation notice required."
                addLabel="Add policy"
              />
            </Field>
          </div>
        </section>

        <section>
          <SubHeading title="Contact details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Phone numbers">
              <StringListEditor
                items={draft.contactPhones}
                onChange={(contactPhones) => update({ contactPhones })}
                placeholder="+251 9X XXX XXXX"
                addLabel="Add number"
              />
            </Field>
            <div className="space-y-5">
              <Field label="Email">
                <input
                  value={draft.contactEmail}
                  onChange={(e) => update({ contactEmail: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Address">
                <input
                  value={draft.contactAddress}
                  onChange={(e) => update({ contactAddress: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </section>

        <SaveBar isDirty={isDirty} isSaving={isSaving} onSave={handleSave} onReset={reset} />
      </div>
    </Panel>
  );
}

function SubHeading({ title }: { title: string }) {
  return (
    <h3 className="font-serif text-lg text-primary-dark mb-4 pb-2 border-b border-stone-100">
      {title}
    </h3>
  );
}
