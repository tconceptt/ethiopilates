"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CtaBand() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/studio/reception.jpg"
          alt="The studio reception, where brass letters on the wall read 'You are exactly where you need to be'"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#241a13]/70"></div>
      </div>

      <div className="relative container mx-auto px-6 md:px-12 py-28 md:py-40 text-center">
        <motion.div
          initial={{ opacity: 0.2, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="font-serif italic text-2xl md:text-3xl text-[#dcc188] mb-4">
            The wall at our front desk says it best —
          </p>
          <h2 className="font-serif text-4xl md:text-6xl text-[#faf6ee] max-w-3xl mx-auto mb-10">
            You are exactly where you need to be.
          </h2>
          <Link
            href="/register"
            className="inline-block bg-[#dcc188] hover:bg-[#e8d5ae] text-[#2a1a12] px-10 py-4 rounded-sm text-sm uppercase tracking-widest transition-colors duration-300"
          >
            Begin your journey
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
