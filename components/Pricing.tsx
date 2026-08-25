"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import { pricingSection, usePricing, useSettings } from "../lib/content";
import type { PricingGroupContent } from "../convex/defaults";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Pricing() {
  const { groups, isLoading } = usePricing();
  const { settings } = useSettings();

  const programs = pricingSection(groups, "programs");
  const memberships = pricingSection(groups, "memberships");
  const classPackages = pricingSection(groups, "classPackages");
  const specialtyPrograms = pricingSection(groups, "specialty");

  return (
    <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0.2, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center max-w-2xl mx-auto mb-14 md:mb-20"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-primary-dark mb-6">
            Pilates packages
          </h2>
          <div className="w-16 h-px bg-brass mx-auto mb-6"></div>
          <p className="text-stone-700 leading-relaxed whitespace-pre-line">
            {settings.pricingIntro}
          </p>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-secondary border-t-brass rounded-full animate-spin"></div>
          </div>
        )}

        <div className="max-w-5xl mx-auto space-y-8 md:space-y-10">
          {programs.map((program, index) => (
            <motion.div
              key={groupKey(program, index)}
              initial={{ opacity: 0.15, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: EASE }}
              className={`rounded-sm p-7 md:p-10 ${
                program.featured
                  ? "bg-primary-dark text-[#f5efe4]"
                  : "bg-surface border border-secondary"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-8">
                <h3
                  className={`font-serif text-3xl ${
                    program.featured ? "text-[#faf6ee]" : "text-primary-dark"
                  }`}
                >
                  {program.title}
                </h3>
                <p
                  className={`text-sm uppercase tracking-widest ${
                    program.featured ? "text-[#d3bd92]" : "text-brass"
                  }`}
                >
                  {program.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
                {program.tiers.map((tier, tierIndex) => (
                  <div key={`${tier.label}-${tierIndex}`}>
                    <p
                      className={`text-sm mb-2 ${
                        program.featured ? "text-[#d8c8b2]" : "text-stone-600"
                      }`}
                    >
                      {tier.label}
                    </p>
                    <p
                      className={`font-serif text-3xl md:text-4xl leading-none mb-1.5 ${
                        program.featured ? "text-[#faf6ee]" : "text-foreground"
                      }`}
                    >
                      {tier.price}
                    </p>
                    {tier.note && (
                      <p
                        className={`text-xs uppercase tracking-wider ${
                          program.featured ? "text-[#d8c8b2]" : "text-stone-500"
                        }`}
                      >
                        {tier.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div
                className={`mt-9 pt-6 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  program.featured ? "border-[#f5efe4]/20" : "border-secondary"
                }`}
              >
                <p
                  className={`text-sm ${
                    program.featured ? "text-[#d8c8b2]" : "text-stone-600"
                  }`}
                >
                  Includes water, sauna, ice bath &amp; red light therapy.
                </p>
                <Link
                  href="/register"
                  className={`inline-block text-center px-6 py-3 rounded-sm text-sm uppercase tracking-widest transition-colors duration-300 ${
                    program.featured
                      ? "bg-[#dcc188] hover:bg-[#e8d5ae] text-[#2a1a12]"
                      : "border border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-[#faf6ee]"
                  }`}
                >
                  Get started
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Memberships */}
        <div className={`max-w-5xl mx-auto mt-20 md:mt-28 ${memberships.length ? "" : "hidden"}`}>
          <SectionHeading
            title="Memberships"
            kicker="Unlimited & multi-class access"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {memberships.map((pkg, index) => (
              <motion.div
                key={groupKey(pkg, index)}
                initial={{ opacity: 0.15, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: EASE }}
                className="bg-surface border border-secondary rounded-sm p-7 md:p-9 flex flex-col"
              >
                <h4 className="font-serif text-2xl text-primary-dark mb-1.5">
                  {pkg.title}
                </h4>
                <p className="text-xs uppercase tracking-widest text-brass mb-7 pb-5 border-b border-secondary">
                  {pkg.subtitle}
                </p>
                <ul className="space-y-4 flex-grow">
                  {pkg.tiers.map((tier, tierIndex) => (
                    <li
                      key={`${tier.label}-${tierIndex}`}
                      className="flex justify-between items-baseline gap-4"
                    >
                      <span className="text-sm text-stone-600">
                        {tier.label}
                      </span>
                      <span className="text-right">
                        <span className="font-serif text-xl text-foreground">
                          {tier.price}
                        </span>
                        {tier.note && (
                          <span className="block text-xs text-stone-500">
                            {tier.note}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-8 inline-block text-center px-6 py-3 rounded-sm text-sm uppercase tracking-widest border border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-[#faf6ee] transition-colors duration-300"
                >
                  Get started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Class packages */}
        <div className={`max-w-5xl mx-auto mt-20 md:mt-28 ${classPackages.length ? "" : "hidden"}`}>
          <SectionHeading
            title="Class packages"
            kicker="Pay per class type"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {classPackages.map((pkg, index) => (
              <motion.div
                key={groupKey(pkg, index)}
                initial={{ opacity: 0.15, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: index * 0.06, ease: EASE }}
                className="bg-surface border border-secondary rounded-sm p-6"
              >
                <h4 className="font-serif text-xl text-primary-dark mb-5 pb-4 border-b border-secondary">
                  {pkg.title}
                </h4>
                <ul className="space-y-3.5">
                  {pkg.tiers.map((tier, tierIndex) => (
                    <li key={`${tier.label}-${tierIndex}`}>
                      <div className="flex justify-between items-baseline gap-3">
                        <span className="text-sm text-stone-600">
                          {tier.label}
                        </span>
                        <span className="font-serif text-lg text-foreground">
                          {tier.price}
                        </span>
                      </div>
                      {tier.note && (
                        <span className="block text-xs text-stone-500 text-right">
                          {tier.note}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Specialty programs */}
        <div
          className={`max-w-5xl mx-auto mt-20 md:mt-28 ${
            specialtyPrograms.length ? "" : "hidden"
          }`}
        >
          <SectionHeading
            title="Specialty programs"
            kicker="Focused & private sessions"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialtyPrograms.map((pkg, index) => (
              <motion.div
                key={groupKey(pkg, index)}
                initial={{ opacity: 0.15, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: index * 0.06, ease: EASE }}
                className="bg-primary-dark text-[#f5efe4] rounded-sm p-6 md:p-7"
              >
                <h4 className="font-serif text-xl text-[#faf6ee] mb-1.5">
                  {pkg.title}
                </h4>
                <p
                  className={`text-xs uppercase tracking-widest text-[#d3bd92] mb-5 pb-4 border-b border-[#f5efe4]/20 ${
                    pkg.subtitle ? "" : "invisible"
                  }`}
                >
                  {pkg.subtitle ?? "—"}
                </p>
                <ul className="space-y-3.5">
                  {pkg.tiers.map((tier, tierIndex) => (
                    <li
                      key={`${tier.label}-${tierIndex}`}
                      className="flex justify-between items-baseline gap-3"
                    >
                      <span className="text-sm text-[#d8c8b2]">
                        {tier.label}
                      </span>
                      <span className="font-serif text-lg text-[#faf6ee]">
                        {tier.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0.2, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-5xl mx-auto mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
        >
          <div>
            <h3 className="font-serif text-2xl text-primary-dark mb-6">
              What&apos;s included
            </h3>
            <ul className="space-y-3.5">
              {settings.included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    aria-hidden
                    size={18}
                    strokeWidth={2}
                    className="text-olive mt-0.5 shrink-0"
                  />
                  <span className="text-stone-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-2xl text-primary-dark mb-6">
              Studio policies
            </h3>
            <ul className="space-y-3.5">
              {settings.policies.map((item) => (
                <li
                  key={item}
                  className="text-stone-700 leading-relaxed border-b border-secondary pb-3.5"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-serif italic text-xl text-brass mt-8">
              Consistency today, strength forever.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Titles repeat across sections (two "Group Reformer" cards), so include the index. */
function groupKey(group: PricingGroupContent, index: number): string {
  return `${group.title}-${group.subtitle ?? ""}-${index}`;
}

function SectionHeading({ title, kicker }: { title: string; kicker: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="text-center mb-10 md:mb-14"
    >
      <p className="text-xs uppercase tracking-widest text-brass mb-3">
        {kicker}
      </p>
      <h3 className="font-serif text-3xl md:text-4xl text-primary-dark">
        {title}
      </h3>
      <div className="w-16 h-px bg-brass mx-auto mt-6"></div>
    </motion.div>
  );
}
