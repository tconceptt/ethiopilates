"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EASE = [0.16, 1, 0.3, 1] as const;

const openClasses = [
  { time: "9:00 – 10:00 AM", name: "Mat Pilates" },
  { time: "10:00 – 11:30 AM", name: "Heran's Yoga" },
  { time: "5:00 – 6:00 PM", name: "Mat Pilates" },
  { time: "6:00 – 7:00 PM", name: "Pregnancy Yoga" },
];

const days = ["Monday", "Thursday"];

export default function Schedule() {
  return (
    <section id="schedule" className="py-20 md:py-32 bg-surface">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0.2, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center max-w-2xl mx-auto mb-14 md:mb-20"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-primary-dark mb-6">
            Weekly schedule
          </h2>
          <div className="w-16 h-px bg-brass mx-auto mb-6"></div>
          <p className="text-stone-700 leading-relaxed">
            Open mat and yoga classes run on Mondays and Thursdays. Reformer
            and Hot Pilates sessions run throughout the week, scheduled with
            your package.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-4xl mx-auto">
          {days.map((day, dayIndex) => (
            <motion.div
              key={day}
              initial={{ opacity: 0.15, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: dayIndex * 0.12, ease: EASE }}
            >
              <h3 className="font-serif text-3xl text-brass text-center mb-8">
                {day}
              </h3>
              <ul>
                {openClasses.map((cls) => (
                  <li
                    key={`${day}-${cls.time}`}
                    className="flex items-baseline justify-between gap-4 border-b border-secondary py-4 first:border-t"
                  >
                    <span className="text-sm tracking-wide text-stone-600 tabular-nums whitespace-nowrap">
                      {cls.time}
                    </span>
                    <span className="font-serif text-xl md:text-2xl text-primary-dark text-right">
                      {cls.name}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="text-center mt-14"
        >
          <Link
            href="/register"
            className="inline-block bg-primary-dark hover:bg-foreground text-[#faf6ee] px-8 py-4 rounded-sm text-sm uppercase tracking-widest transition-colors duration-300"
          >
            Reserve your spot
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
