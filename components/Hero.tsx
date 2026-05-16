"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-secondary/40 to-background">
      <div className="container mx-auto px-6 relative z-10 text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="font-serif text-5xl md:text-7xl text-primary-dark mb-6 leading-tight">
            Move with intention. <br className="hidden md:block" />
            <span className="italic text-primary">Feel the transformation.</span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-xl text-stone-600 mb-10 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Ethio Pilates is more than a studio&mdash;it&apos;s a space for movement, healing, and self-connection. 
            We combine Pilates, yoga, and curated wellness experiences to help you feel strong, balanced, and refreshed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/register"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-sm text-sm uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Book Your Class
            </Link>
            <Link
              href="#services"
              className="bg-transparent border border-primary text-primary hover:bg-primary/5 px-8 py-4 rounded-sm text-sm uppercase tracking-widest transition-all duration-300"
            >
              Explore Services
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}