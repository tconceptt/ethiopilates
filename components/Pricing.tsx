"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Plan = {
  duration: string;
  sessions: number;
  price: string;
};

type Program = {
  title: string;
  frequency: string;
  plans: Plan[];
  featured?: boolean;
};

const programs: Program[] = [
  {
    title: "Group Reformer",
    frequency: "2 sessions a week",
    plans: [
      { duration: "1 Month", sessions: 8, price: "30,000" },
      { duration: "3 Months", sessions: 24, price: "50,000" },
      { duration: "6 Months", sessions: 48, price: "80,000" },
      { duration: "1 Year", sessions: 96, price: "150,000" },
    ],
  },
  {
    title: "Group Reformer",
    frequency: "3 sessions a week",
    featured: true,
    plans: [
      { duration: "1 Month", sessions: 12, price: "40,000" },
      { duration: "3 Months", sessions: 36, price: "100,000" },
      { duration: "6 Months", sessions: 72, price: "180,000" },
      { duration: "1 Year", sessions: 144, price: "300,000" },
    ],
  },
  {
    title: "Group Hot Pilates",
    frequency: "3 sessions a week",
    plans: [
      { duration: "1 Month", sessions: 12, price: "20,000" },
      { duration: "3 Months", sessions: 36, price: "50,000" },
      { duration: "6 Months", sessions: 72, price: "80,000" },
      { duration: "1 Year", sessions: 144, price: "120,000" },
    ],
  },
];

type Tier = {
  duration: string;
  price: string;
  note?: string;
};

type Package = {
  title: string;
  subtitle?: string;
  tiers: Tier[];
};

const memberships: Package[] = [
  {
    title: "Standard Access",
    subtitle: "Yoga + Hot Pilates — unlimited classes",
    tiers: [
      { duration: "Drop-in", price: "2,500" },
      { duration: "1 Month", price: "8,000" },
      { duration: "3 Months", price: "20,000" },
      { duration: "6 Months", price: "35,000" },
      { duration: "1 Year", price: "55,000" },
    ],
  },
  {
    title: "Premium Access",
    subtitle: "Yoga + Mat Pilates + Hot Pilates + Reformer",
    tiers: [
      { duration: "1 Month", price: "35,000", note: "one class per week for each service" },
      { duration: "3 Months", price: "80,000", note: "4 classes for each service" },
      { duration: "6 Months", price: "130,000", note: "8 classes for each service" },
    ],
  },
];

const classPackages: Package[] = [
  {
    title: "Hot Pilates",
    tiers: [
      { duration: "Drop-in", price: "2,000" },
      { duration: "1 Month", price: "6,000", note: "4 classes" },
      { duration: "3 Months", price: "10,000", note: "8 classes" },
      { duration: "6 Months", price: "15,000", note: "16 classes" },
      { duration: "1 Year", price: "20,000", note: "32 classes" },
    ],
  },
  {
    title: "Reformer Pilates",
    tiers: [
      { duration: "Drop-in", price: "4,500" },
      { duration: "1 Month", price: "15,000", note: "4 classes" },
      { duration: "3 Months", price: "35,000", note: "12 classes" },
      { duration: "6 Months", price: "50,000", note: "24 classes" },
      { duration: "1 Year", price: "80,000" },
    ],
  },
  {
    title: "Mat Pilates",
    tiers: [
      { duration: "Drop-in", price: "2,000" },
      { duration: "1 Month", price: "10,000", note: "8 classes" },
      { duration: "3 Months", price: "25,000", note: "24 classes" },
      { duration: "6 Months", price: "40,000", note: "48 classes" },
      { duration: "1 Year", price: "60,000", note: "96 classes" },
    ],
  },
  {
    title: "Yoga",
    tiers: [
      { duration: "Drop-in", price: "2,000" },
      { duration: "1 Month", price: "6,000", note: "4 classes" },
      { duration: "3 Months", price: "10,000", note: "8 classes" },
      { duration: "6 Months", price: "15,000", note: "16 classes" },
      { duration: "1 Year", price: "20,000", note: "32 classes" },
    ],
  },
];

const specialtyPrograms: Package[] = [
  {
    title: "Pregnancy Yoga",
    tiers: [
      { duration: "Drop-in", price: "2,500" },
      { duration: "1 Month", price: "8,000" },
      { duration: "3 Months", price: "20,000" },
      { duration: "6 Months", price: "30,000" },
    ],
  },
  {
    title: "Kids / Beginner Ballet",
    tiers: [
      { duration: "Drop-in", price: "1,500" },
      { duration: "1 Month", price: "3,500" },
      { duration: "3 Months", price: "9,500" },
      { duration: "6 Months", price: "17,000" },
      { duration: "1 Year", price: "32,000" },
    ],
  },
  {
    title: "VIP / Private Training",
    subtitle: "Free infused water, matcha",
    tiers: [
      { duration: "1 Session", price: "10,000" },
      { duration: "4 Sessions", price: "30,000" },
    ],
  },
];

const included = [
  "All equipment & studio access",
  "Expert instruction",
  "Safe & supportive environment",
  "Progress tracking",
  "Free water, sauna, ice bath & red light therapy",
];

const policies = [
  "Sessions are non-refundable and non-transferable.",
  "24-hour cancellation notice required.",
  "Missed sessions cannot be rescheduled.",
];

export default function Pricing() {
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
          <p className="text-stone-700 leading-relaxed">
            Invest in your body. Embrace the journey. Thrive every day.
            <br />
            All prices in ETB.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-8 md:space-y-10">
          {programs.map((program, index) => (
            <motion.div
              key={`${program.title}-${program.frequency}`}
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
                  {program.frequency}
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
                {program.plans.map((plan) => (
                  <div key={plan.duration}>
                    <p
                      className={`text-sm mb-2 ${
                        program.featured ? "text-[#d8c8b2]" : "text-stone-600"
                      }`}
                    >
                      {plan.duration}
                    </p>
                    <p
                      className={`font-serif text-3xl md:text-4xl leading-none mb-1.5 ${
                        program.featured ? "text-[#faf6ee]" : "text-foreground"
                      }`}
                    >
                      {plan.price}
                    </p>
                    <p
                      className={`text-xs uppercase tracking-wider ${
                        program.featured ? "text-[#d8c8b2]" : "text-stone-500"
                      }`}
                    >
                      {plan.sessions} sessions
                    </p>
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
        <div className="max-w-5xl mx-auto mt-20 md:mt-28">
          <SectionHeading
            title="Memberships"
            kicker="Unlimited & multi-class access"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {memberships.map((pkg, index) => (
              <motion.div
                key={pkg.title}
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
                  {pkg.tiers.map((tier) => (
                    <li
                      key={tier.duration}
                      className="flex justify-between items-baseline gap-4"
                    >
                      <span className="text-sm text-stone-600">
                        {tier.duration}
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
        <div className="max-w-5xl mx-auto mt-20 md:mt-28">
          <SectionHeading
            title="Class packages"
            kicker="Pay per class type"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {classPackages.map((pkg, index) => (
              <motion.div
                key={pkg.title}
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
                  {pkg.tiers.map((tier) => (
                    <li key={tier.duration}>
                      <div className="flex justify-between items-baseline gap-3">
                        <span className="text-sm text-stone-600">
                          {tier.duration}
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
        <div className="max-w-5xl mx-auto mt-20 md:mt-28">
          <SectionHeading
            title="Specialty programs"
            kicker="Focused & private sessions"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialtyPrograms.map((pkg, index) => (
              <motion.div
                key={pkg.title}
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
                  {pkg.tiers.map((tier) => (
                    <li
                      key={tier.duration}
                      className="flex justify-between items-baseline gap-3"
                    >
                      <span className="text-sm text-[#d8c8b2]">
                        {tier.duration}
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
              {included.map((item) => (
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
              {policies.map((item) => (
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
