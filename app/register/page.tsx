"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Copy, Clock, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const PAYMENT_DETAILS = {
  bankName: "Tele Birr",
  accountName: "Ethio Pilates",
  accountNumber: "0996902970",
  whatsappNumber: "+251 99 690 2970",
  whatsappLink: "https://wa.me/251996902970",
};

const ADVANCE_PAYMENT = 1500;

type ClassKey =
  | "group-reformer"
  | "private-reformer"
  | "mat-pilates"
  | "hot-pilates"
  | "yoga"
  | "pregnancy-yoga";

type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
const JS_DAY_TO_KEY: Record<number, DayKey | null> = {
  0: null,
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatLongDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function relativeLabel(date: Date, today: Date): string | null {
  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, addDays(today, 1))) return "Tomorrow";
  return null;
}

type ClassInfo = {
  label: string;
  blurb: string;
  schedule: Partial<Record<DayKey, string[]>>;
};

const CLASSES: Record<ClassKey, ClassInfo> = {
  "group-reformer": {
    label: "Group Reformer",
    blurb: "Equipment-based reformer session in a small group setting.",
    schedule: {
      Mon: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Tue: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Wed: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Thu: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Fri: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Sat: ["8:00–9:00 AM", "10:00–11:00 AM", "2:00–3:00 PM"],
    },
  },
  "private-reformer": {
    label: "Private Reformer",
    blurb: "One-on-one reformer session. Flexible windows available.",
    schedule: {
      Mon: ["2:00–9:00 PM (open slots)", "8:00–9:00 PM"],
      Tue: ["2:00–9:00 PM (open slots)", "8:00–9:00 PM"],
      Wed: ["2:00–9:00 PM (open slots)", "8:00–9:00 PM"],
      Thu: ["2:00–9:00 PM (open slots)", "8:00–9:00 PM"],
      Fri: ["2:00–9:00 PM (open slots)", "8:00–9:00 PM"],
    },
  },
  "mat-pilates": {
    label: "Mat Pilates",
    blurb: "Mat-based Pilates focused on core strength and control.",
    schedule: {
      Mon: ["9:00–10:00 AM", "6:00–7:00 PM"],
      Thu: ["9:00–10:00 AM", "6:00–7:00 PM"],
    },
  },
  "hot-pilates": {
    label: "Hot Pilates",
    blurb: "Dynamic Pilates in a heated room for added intensity.",
    schedule: {
      Mon: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Tue: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Wed: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Thu: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Fri: ["8:00–9:00 AM", "9:00–10:00 AM", "4:00–5:00 PM", "5:00–6:00 PM", "6:00–7:00 PM"],
      Sat: ["8:00–9:00 AM", "9:00–10:00 AM", "12:00–1:00 PM"],
    },
  },
  yoga: {
    label: "Yoga",
    blurb: "Calming, restorative flows to stretch and reset.",
    schedule: {
      Mon: ["8:00–9:00 AM"],
      Thu: ["8:00–9:00 AM"],
    },
  },
  "pregnancy-yoga": {
    label: "Pregnancy Yoga",
    blurb: "Gentle, supportive sessions tailored for mothers-to-be.",
    schedule: {
      Mon: ["10:30 AM–12:00 PM (Private)", "5:00–6:00 PM (Group)"],
      Thu: ["10:30 AM–12:00 PM (Private)", "5:00–6:00 PM (Group)"],
    },
  },
};

function slotsForDate(classKey: ClassKey, date: Date): string[] {
  const k = JS_DAY_TO_KEY[date.getDay()];
  if (!k) return [];
  return CLASSES[classKey].schedule[k] || [];
}

const SEARCH_HORIZON_DAYS = 60;

function findNextAvailable(
  classKey: ClassKey,
  from: Date,
  direction: 1 | -1,
  earliest: Date,
): Date | null {
  for (let i = 1; i <= SEARCH_HORIZON_DAYS; i++) {
    const d = addDays(from, direction * i);
    if (direction === -1 && d < earliest) return null;
    if (slotsForDate(classKey, d).length) return d;
  }
  return null;
}

function findFirstAvailable(classKey: ClassKey, from: Date): Date | null {
  for (let i = 0; i <= SEARCH_HORIZON_DAYS; i++) {
    const d = addDays(from, i);
    if (slotsForDate(classKey, d).length) return d;
  }
  return null;
}

type Step = 1 | 2 | 3;

export default function Register() {
  const [step, setStep] = useState<Step>(1);
  const [selectedClass, setSelectedClass] = useState<ClassKey | null>(null);
  const [displayedDate, setDisplayedDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [copied, setCopied] = useState(false);

  const today = useMemo(() => startOfToday(), []);

  const createRegistration = useMutation(api.registrations.create);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePickClass = (key: ClassKey) => {
    setSelectedClass(key);
    const first = findFirstAvailable(key, today);
    setDisplayedDate(first);
    setSelectedDate(null);
    setSelectedSlot(null);
    setStep(2);
  };

  const handlePickSlot = (date: Date, slot: string) => {
    setSelectedDate(date);
    setSelectedSlot(slot);
  };

  const handleDayNav = (direction: 1 | -1) => {
    if (!selectedClass || !displayedDate) return;
    const next = findNextAvailable(selectedClass, displayedDate, direction, today);
    if (next) setDisplayedDate(next);
  };

  const handleContinueToDetails = () => {
    if (!selectedClass || !selectedDate || !selectedSlot) return;
    setStep(3);
  };

  const handleBack = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !selectedDate || !selectedSlot) return;
    setIsSubmitting(true);

    const cls = CLASSES[selectedClass];
    const label = `${formatLongDate(selectedDate)} — ${selectedSlot}`;

    try {
      await createRegistration({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || undefined,
        phone: formData.phone,
        package: cls.label,
        price: ADVANCE_PAYMENT,
        schedule: label,
        experienceLevel: "beginner",
      });
      setIsComplete(true);
    } catch (error) {
      console.error("Failed to submit registration:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedClassInfo = selectedClass ? CLASSES[selectedClass] : null;
  const scheduleLabel =
    selectedDate && selectedSlot ? `${formatLongDate(selectedDate)} — ${selectedSlot}` : null;

  const displayedSlots =
    selectedClass && displayedDate ? slotsForDate(selectedClass, displayedDate) : [];
  const prevDate =
    selectedClass && displayedDate
      ? findNextAvailable(selectedClass, displayedDate, -1, today)
      : null;
  const nextDate =
    selectedClass && displayedDate
      ? findNextAvailable(selectedClass, displayedDate, 1, today)
      : null;
  const displayedRelative = displayedDate ? relativeLabel(displayedDate, today) : null;

  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col">
      <header className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-stone-600 hover:text-primary transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm uppercase tracking-widest">Back to Home</span>
          </Link>
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image src="/logo.jpeg" alt="Ethio Pilates Logo" fill sizes="32px" className="object-contain" />
            </div>
            <span className="font-serif text-lg tracking-widest uppercase text-primary-dark hidden sm:block">
              Ethio Pilates
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-grow py-8 md:py-12 px-3 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-sm shadow-md overflow-hidden"
          >
            <div className="bg-primary-dark p-6 sm:p-8 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <Image
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop"
                  alt="Background"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
              <div className="relative z-10">
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-2">Book a Class</h1>
                <p className="text-primary-light text-[11px] sm:text-sm tracking-widest uppercase">
                  Pick a class. Pick a time. Reserve your spot.
                </p>
              </div>
            </div>

            {!isComplete && <Stepper step={step} />}

            <div className="p-4 sm:p-6 md:p-10">
              <AnimatePresence mode="wait">
                {isComplete ? (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="py-6 sm:py-8"
                  >
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Clock size={28} />
                      </div>
                      <div className="inline-block text-[10px] sm:text-xs uppercase tracking-widest bg-amber-100 text-amber-800 px-3 py-1 rounded-full mb-3">
                        Awaiting payment
                      </div>
                      <h2 className="font-serif text-2xl md:text-3xl text-primary-dark mb-2">
                        Spot reserved — one step left
                      </h2>
                      <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto">
                        We&apos;ve held your spot for{" "}
                        <span className="font-medium text-primary-dark">{selectedClassInfo?.label}</span> on{" "}
                        <span className="font-medium text-primary-dark">{scheduleLabel}</span>. Send the{" "}
                        <span className="font-medium text-primary-dark">{ADVANCE_PAYMENT.toLocaleString()} ETB</span>{" "}
                        advance payment and the screenshot on WhatsApp to confirm.
                      </p>
                    </div>
                    <div className="max-w-md mx-auto">
                      <PaymentBox onCopy={handleCopy} copied={copied} />
                    </div>
                    <div className="text-center mt-8">
                      <Link
                        href="/"
                        className="inline-block text-xs sm:text-sm uppercase tracking-widest text-stone-500 hover:text-primary"
                      >
                        Back to home
                      </Link>
                    </div>
                  </motion.div>
                ) : step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="font-serif text-xl sm:text-2xl text-primary-dark mb-2">Choose your class</h2>
                    <p className="text-sm text-stone-500 mb-6 sm:mb-8">Select the type of class you want to book.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {(Object.keys(CLASSES) as ClassKey[]).map((key) => {
                        const cls = CLASSES[key];
                        const isSelected = selectedClass === key;
                        return (
                          <button
                            type="button"
                            key={key}
                            onClick={() => handlePickClass(key)}
                            className={`group text-left border rounded-sm p-4 sm:p-5 flex items-center justify-between gap-3 transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-stone-200 hover:border-primary/50 hover:bg-stone-50"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <h3 className="font-serif text-base sm:text-lg text-primary-dark mb-1">{cls.label}</h3>
                              <p className="text-xs sm:text-sm text-stone-500">{cls.blurb}</p>
                            </div>
                            <span className="shrink-0 inline-flex items-center gap-1 bg-primary group-hover:bg-primary-dark text-white text-[10px] sm:text-xs uppercase tracking-widest px-3 sm:px-4 py-2 sm:py-2.5 rounded-sm transition-colors">
                              Book
                              <ArrowRight size={12} />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : step === 2 ? (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="font-serif text-xl sm:text-2xl text-primary-dark mb-1">Pick a time slot</h2>
                        <p className="text-xs sm:text-sm text-stone-500">
                          Showing schedules for{" "}
                          <span className="text-primary-dark font-medium">{selectedClassInfo?.label}</span>.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleBack}
                        className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-stone-500 hover:text-primary inline-flex items-center gap-1.5 shrink-0"
                      >
                        <ArrowLeft size={14} />
                        Change class
                      </button>
                    </div>

                    {displayedDate ? (
                      <div className="border border-stone-200 rounded-sm overflow-hidden">
                        <div className="flex items-stretch border-b border-stone-200 bg-stone-50">
                          <button
                            type="button"
                            onClick={() => handleDayNav(-1)}
                            disabled={!prevDate}
                            aria-label="Previous day"
                            className="px-3 sm:px-4 text-stone-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <div className="flex-1 text-center py-3 px-2">
                            {displayedRelative && (
                              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-primary font-medium">
                                {displayedRelative}
                              </div>
                            )}
                            <div className="text-sm sm:text-base font-medium text-primary-dark">
                              {formatLongDate(displayedDate)}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDayNav(1)}
                            disabled={!nextDate}
                            aria-label="Next day"
                            className="px-3 sm:px-4 text-stone-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                        <div className="p-3 sm:p-4">
                          {displayedSlots.length ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {displayedSlots.map((slot) => {
                                const isActive =
                                  selectedDate &&
                                  isSameDay(selectedDate, displayedDate) &&
                                  selectedSlot === slot;
                                return (
                                  <button
                                    type="button"
                                    key={slot}
                                    onClick={() => handlePickSlot(displayedDate, slot)}
                                    className={`inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm px-2 sm:px-3 py-2.5 rounded-sm border transition-colors ${
                                      isActive
                                        ? "bg-primary border-primary text-white"
                                        : "bg-white border-stone-200 text-stone-700 hover:border-primary hover:text-primary"
                                    }`}
                                  >
                                    <Clock size={12} />
                                    <span className="truncate">{slot}</span>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-center text-sm text-stone-500 py-6">
                              No classes available on this day.
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-sm text-stone-500 py-8">
                        No upcoming classes scheduled.
                      </p>
                    )}

                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div className="text-xs sm:text-sm text-stone-600">
                        {scheduleLabel ? (
                          <>
                            <span className="text-stone-500">Selected: </span>
                            <span className="font-medium text-primary-dark">{scheduleLabel}</span>
                          </>
                        ) : (
                          <span className="text-stone-400">No slot selected yet.</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleContinueToDetails}
                        disabled={!scheduleLabel}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 sm:px-6 py-3 rounded-sm text-xs sm:text-sm uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="font-serif text-xl sm:text-2xl text-primary-dark mb-1">Your details & payment</h2>
                        <p className="text-xs sm:text-sm text-stone-500">
                          Booking{" "}
                          <span className="text-primary-dark font-medium">{selectedClassInfo?.label}</span>
                          {" — "}
                          <span className="text-primary-dark font-medium">{scheduleLabel}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleBack}
                        className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-stone-500 hover:text-primary inline-flex items-center gap-1.5 shrink-0"
                      >
                        <ArrowLeft size={14} />
                        Change time
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <section>
                        <h3 className="font-serif text-lg text-primary-dark mb-4 border-b border-stone-100 pb-2">
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-stone-700 mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              required
                              value={formData.firstName}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                              placeholder="Enter your first name"
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-stone-700 mb-2">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              required
                              value={formData.lastName}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                              placeholder="Enter your last name"
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-2">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                              placeholder="+251 9X XXX XXXX"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                              Email (Optional)
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>
                      </section>

                      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-sm px-4 py-3.5 flex items-start gap-3">
                        <div className="shrink-0 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                          !
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-amber-900 text-sm sm:text-base">
                            Advance payment of {ADVANCE_PAYMENT.toLocaleString()} ETB required
                          </p>
                          <p className="text-xs sm:text-sm text-amber-800/80 mt-0.5">
                            You&apos;ll receive payment instructions after submitting. Your booking is confirmed once
                            we receive your screenshot on WhatsApp.
                          </p>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-sm text-sm uppercase tracking-widest transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Submitting..." : "Reserve My Spot"}
                      </button>

                      <p className="text-center text-xs text-stone-500">
                        We&apos;ll show you the Telebirr account and WhatsApp number on the next screen.
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps = [
    { n: 1, label: "Class" },
    { n: 2, label: "Schedule" },
    { n: 3, label: "Details" },
  ];
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 py-4 sm:py-5 px-3 border-b border-stone-100 bg-stone-50/40">
      {steps.map((s, i) => {
        const isDone = step > s.n;
        const isActive = step === s.n;
        return (
          <div key={s.n} className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-medium border transition-colors shrink-0 ${
                  isDone
                    ? "bg-primary border-primary text-white"
                    : isActive
                      ? "bg-white border-primary text-primary"
                      : "bg-white border-stone-300 text-stone-400"
                }`}
              >
                {isDone ? <Check size={12} /> : s.n}
              </div>
              <span
                className={`text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest whitespace-nowrap ${
                  isActive ? "text-primary-dark font-medium" : "text-stone-500"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && <div className="w-4 sm:w-8 md:w-12 h-px bg-stone-300 shrink-0" />}
          </div>
        );
      })}
    </div>
  );
}

function PaymentBox({
  onCopy,
  copied,
  compact = false,
}: {
  onCopy: (value: string) => void;
  copied: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`space-y-4 ${compact ? "max-w-md mx-auto text-left" : ""}`}>
      <p className="text-sm text-stone-600">
        Send your payment to the Telebirr account below, then send us the payment screenshot on WhatsApp.
      </p>

      {/* Telebirr block */}
      <div className="bg-white border border-stone-200 rounded-sm p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0">
            <Image
              src="/telebirr.svg"
              alt="Telebirr"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-stone-500">
              Pay with
            </div>
            <div className="font-medium text-primary-dark">Telebirr</div>
          </div>
        </div>

        <div>
          <div className="text-[10px] sm:text-xs uppercase tracking-widest text-stone-500 mb-1">
            Account number
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-base sm:text-lg text-stone-800 tracking-wider">
              {PAYMENT_DETAILS.accountNumber}
            </span>
            <button
              type="button"
              onClick={() => onCopy(PAYMENT_DETAILS.accountNumber)}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary hover:text-primary-dark border border-primary/30 hover:border-primary px-3 py-1.5 rounded-sm transition-colors shrink-0"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp block */}
      <a
        href={PAYMENT_DETAILS.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group block bg-[#25D366] hover:bg-[#1ebe5b] text-white rounded-sm p-4 sm:p-5 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full bg-white p-1.5">
            <Image
              src="/whatsapp.svg"
              alt="WhatsApp"
              fill
              sizes="44px"
              className="object-contain p-1"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-white/80">
              Send screenshot on WhatsApp
            </div>
            <div className="font-medium text-base sm:text-lg flex items-center gap-1.5">
              <span className="truncate">{PAYMENT_DETAILS.whatsappNumber}</span>
              <ExternalLink
                size={14}
                className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0"
              />
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs uppercase tracking-widest bg-white/15 group-hover:bg-white/25 px-3 py-2 rounded-sm transition-colors shrink-0">
            Open chat
            <ArrowRight size={12} />
          </span>
        </div>
        <div className="sm:hidden mt-3 text-[11px] uppercase tracking-widest text-white/80 flex items-center gap-1.5">
          Tap to open chat
          <ArrowRight size={12} />
        </div>
      </a>

      <p className="text-xs text-stone-500">
        Send the screenshot with your full name and selected class so we can confirm your booking.
      </p>
    </div>
  );
}
