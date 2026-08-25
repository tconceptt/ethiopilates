"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Copy, Clock, ExternalLink, Users } from "lucide-react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { slotsForDate, toDateKey, type ClassKey, type SiteClass } from "../../lib/classes";
import { useClasses, useSettings } from "../../lib/content";
import { whatsappLink, type SettingsContent } from "../../convex/defaults";

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

const SEARCH_HORIZON_DAYS = 60;

function findNextAvailable(
  cls: SiteClass,
  from: Date,
  direction: 1 | -1,
  earliest: Date,
): Date | null {
  for (let i = 1; i <= SEARCH_HORIZON_DAYS; i++) {
    const d = addDays(from, direction * i);
    if (direction === -1 && d < earliest) return null;
    if (slotsForDate(cls, d).length) return d;
  }
  return null;
}

function findFirstAvailable(cls: SiteClass, from: Date): Date | null {
  for (let i = 0; i <= SEARCH_HORIZON_DAYS; i++) {
    const d = addDays(from, i);
    if (slotsForDate(cls, d).length) return d;
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
  const [isMember, setIsMember] = useState(false);

  const today = useMemo(() => startOfToday(), []);

  const { classes, isLoading: classesLoading } = useClasses();
  const { settings } = useSettings();
  const createRegistration = useMutation(api.registrations.create);

  const selectedClassInfo = classes.find((c) => c.key === selectedClass) ?? null;

  const availability = useQuery(
    api.classes.availability,
    selectedClass && displayedDate
      ? { classKey: selectedClass, classDate: toDateKey(displayedDate) }
      : "skip",
  );

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

  const handlePickClass = (cls: SiteClass) => {
    setSelectedClass(cls.key);
    const first = findFirstAvailable(cls, today);
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
    if (!selectedClassInfo || !displayedDate) return;
    const next = findNextAvailable(selectedClassInfo, displayedDate, direction, today);
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
    if (!selectedClassInfo || !selectedDate || !selectedSlot) return;
    setIsSubmitting(true);

    const label = `${formatLongDate(selectedDate)} — ${selectedSlot}`;

    try {
      await createRegistration({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: !isMember && formData.email ? formData.email : undefined,
        phone: isMember ? undefined : formData.phone,
        package: selectedClassInfo.label,
        price: isMember ? 0 : settings.advancePayment,
        schedule: label,
        experienceLevel: "beginner",
        isMember,
        classKey: selectedClassInfo.key,
        classDate: toDateKey(selectedDate),
        classSlot: selectedSlot,
      });
      setIsComplete(true);
    } catch (error) {
      console.error("Failed to submit registration:", error);
      if (error instanceof Error && error.message.includes("CLASS_FULL")) {
        alert("Sorry, this class just filled up. Please pick another time slot.");
        setSelectedSlot(null);
        setStep(2);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const scheduleLabel =
    selectedDate && selectedSlot ? `${formatLongDate(selectedDate)} — ${selectedSlot}` : null;

  const displayedSlots =
    selectedClassInfo && displayedDate ? slotsForDate(selectedClassInfo, displayedDate) : [];
  const prevDate =
    selectedClassInfo && displayedDate
      ? findNextAvailable(selectedClassInfo, displayedDate, -1, today)
      : null;
  const nextDate =
    selectedClassInfo && displayedDate
      ? findNextAvailable(selectedClassInfo, displayedDate, 1, today)
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
              <div className="absolute inset-0 opacity-25">
                <Image
                  src="/studio/reformer-room.jpg"
                  alt="The Ethio Pilates reformer hall"
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
                    {isMember ? (
                      <div className="text-center mb-6">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                          <Check size={28} />
                        </div>
                        <div className="inline-block text-[10px] sm:text-xs uppercase tracking-widest bg-green-100 text-green-800 px-3 py-1 rounded-full mb-3">
                          Booking confirmed
                        </div>
                        <h2 className="font-serif text-2xl md:text-3xl text-primary-dark mb-2">
                          You&apos;re booked!
                        </h2>
                        <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto">
                          Your spot for{" "}
                          <span className="font-medium text-primary-dark">{selectedClassInfo?.label}</span> on{" "}
                          <span className="font-medium text-primary-dark">{scheduleLabel}</span> is confirmed
                          under your membership. See you in the studio!
                        </p>
                      </div>
                    ) : (
                      <>
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
                            <span className="font-medium text-primary-dark">
                              {settings.advancePayment.toLocaleString()} ETB
                            </span>{" "}
                            advance payment and the screenshot on WhatsApp to confirm.
                          </p>
                        </div>
                        <div className="max-w-md mx-auto">
                          <PaymentBox settings={settings} onCopy={handleCopy} copied={copied} />
                        </div>
                      </>
                    )}
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

                    {classesLoading ? (
                      <div className="flex flex-col items-center gap-3 py-12 text-stone-500">
                        <div className="w-7 h-7 border-4 border-stone-200 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-sm">Loading classes...</p>
                      </div>
                    ) : classes.length === 0 ? (
                      <p className="text-center text-sm text-stone-500 py-12">
                        No classes are open for booking right now.
                      </p>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {classes.map((cls) => {
                        const key = cls.key;
                        const isSelected = selectedClass === key;
                        return (
                          <button
                            type="button"
                            key={key}
                            onClick={() => handlePickClass(cls)}
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
                    )}
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
                                const booked =
                                  availability?.slots.find((s) => s.slot === slot)?.booked ?? 0;
                                const remaining = availability
                                  ? Math.max(0, availability.capacity - booked)
                                  : null;
                                const isFull = remaining !== null && remaining <= 0;
                                return (
                                  <button
                                    type="button"
                                    key={slot}
                                    onClick={() => handlePickSlot(displayedDate, slot)}
                                    disabled={isFull}
                                    className={`flex flex-col items-center justify-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-2.5 rounded-sm border transition-colors ${
                                      isFull
                                        ? "bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed"
                                        : isActive
                                          ? "bg-primary border-primary text-white"
                                          : "bg-white border-stone-200 text-stone-700 hover:border-primary hover:text-primary"
                                    }`}
                                  >
                                    <span className="inline-flex items-center gap-1.5">
                                      <Clock size={12} />
                                      <span className="truncate">{slot}</span>
                                    </span>
                                    {remaining !== null && (
                                      <span
                                        className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider ${
                                          isFull
                                            ? "text-red-400"
                                            : isActive
                                              ? "text-white/80"
                                              : remaining <= 2
                                                ? "text-amber-600"
                                                : "text-stone-400"
                                        }`}
                                      >
                                        <Users size={10} />
                                        {isFull
                                          ? "Full"
                                          : `${remaining} spot${remaining === 1 ? "" : "s"} left`}
                                      </span>
                                    )}
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
                          Booking as
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setIsMember(false)}
                            className={`text-left border rounded-sm p-4 transition-all ${
                              !isMember
                                ? "border-primary bg-primary/5"
                                : "border-stone-200 hover:border-primary/50"
                            }`}
                          >
                            <div className="font-medium text-primary-dark text-sm sm:text-base mb-0.5">
                              Guest
                            </div>
                            <p className="text-xs text-stone-500">
                              First time or drop-in — advance payment required to confirm.
                            </p>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsMember(true)}
                            className={`text-left border rounded-sm p-4 transition-all ${
                              isMember
                                ? "border-primary bg-primary/5"
                                : "border-stone-200 hover:border-primary/50"
                            }`}
                          >
                            <div className="font-medium text-primary-dark text-sm sm:text-base mb-0.5">
                              Member
                            </div>
                            <p className="text-xs text-stone-500">
                              I have an active membership — no payment needed, just my name.
                            </p>
                          </button>
                        </div>
                      </section>

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
                          {!isMember && (
                            <>
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
                            </>
                          )}
                        </div>
                      </section>

                      {isMember ? (
                        <div className="bg-green-50 border-l-4 border-green-500 rounded-sm px-4 py-3.5 flex items-start gap-3">
                          <div className="shrink-0 w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center">
                            <Check size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-green-900 text-sm sm:text-base">
                              No payment needed
                            </p>
                            <p className="text-xs sm:text-sm text-green-800/80 mt-0.5">
                              Your class is covered by your membership. Just submit your name and
                              your spot is booked.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-sm px-4 py-3.5 flex items-start gap-3">
                          <div className="shrink-0 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                            !
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-amber-900 text-sm sm:text-base">
                              Advance payment of {settings.advancePayment.toLocaleString()} ETB required
                            </p>
                            <p className="text-xs sm:text-sm text-amber-800/80 mt-0.5">
                              You&apos;ll receive payment instructions after submitting. Your booking is confirmed once
                              we receive your screenshot on WhatsApp.
                            </p>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-sm text-sm uppercase tracking-widest transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Submitting..." : isMember ? "Book My Spot" : "Reserve My Spot"}
                      </button>

                      {!isMember && (
                        <p className="text-center text-xs text-stone-500">
                          We&apos;ll show you the Telebirr account and WhatsApp number on the next screen.
                        </p>
                      )}
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
  settings,
  onCopy,
  copied,
  compact = false,
}: {
  settings: SettingsContent;
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
              {settings.telebirrAccountNumber}
            </span>
            <button
              type="button"
              onClick={() => onCopy(settings.telebirrAccountNumber)}
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
        href={whatsappLink(settings.whatsappNumber)}
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
              <span className="truncate">{settings.whatsappNumber}</span>
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
