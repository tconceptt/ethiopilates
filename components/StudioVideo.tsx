"use client";

import { motion } from "framer-motion";

export default function StudioVideo() {
  return (
    <section className="bg-secondary/20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto px-6 pt-20 pb-12 md:pt-24 md:pb-16"
      >
        <h2 className="font-serif text-4xl md:text-5xl text-primary-dark mb-6">
          Step inside <span className="italic text-primary">our studio</span>
        </h2>
        <div className="w-16 h-px bg-primary mx-auto mb-6"></div>
        <p className="text-stone-600 leading-relaxed text-lg">
          A serene space designed for movement, breath, and connection.
        </p>
      </motion.div>

      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <video
          src="/Videos/studio-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
