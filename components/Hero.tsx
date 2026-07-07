"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-foreground">
      <div className="absolute inset-0 z-0">
        <Image
          src="/studio/class-reformer.jpg"
          alt="A reformer class in session at Ethio Pilates Studio, legs lifted in unison beneath the brass 'Who run the world' wall"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Espresso scrim, bottom-weighted, for text legibility only */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#241a13]/95 via-[#241a13]/45 to-[#241a13]/10"></div>
        {/* Top scrim so the nav stays readable over the bright ceiling */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#241a13]/70 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 pb-16 md:pb-24 pt-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="max-w-4xl"
        >
          <p className="text-[#e8d5ae] text-sm md:text-base tracking-[0.35em] uppercase mb-6">
            Move &middot; Breathe &middot; Thrive
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-[#faf6ee] leading-[1.02] mb-8">
            Move with intention.
            <br />
            <span className="italic font-light text-[#dcc188]">
              Feel the transformation.
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
            className="text-base md:text-lg text-[#efe7d8] mb-10 font-light leading-relaxed max-w-xl"
          >
            A women-only sanctuary in Addis Ababa for Pilates, yoga, and
            recovery &mdash; a space to build strength, find balance, and
            breathe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/register"
              className="bg-[#dcc188] hover:bg-[#e8d5ae] text-[#2a1a12] px-8 py-4 rounded-sm text-sm uppercase tracking-widest text-center transition-colors duration-300"
            >
              Book Your Class
            </Link>
            <Link
              href="/#classes"
              className="border border-[#efe7d8]/50 hover:border-[#efe7d8] text-[#efe7d8] px-8 py-4 rounded-sm text-sm uppercase tracking-widest text-center transition-colors duration-300"
            >
              Explore Classes
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
