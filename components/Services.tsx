"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const EASE = [0.16, 1, 0.3, 1] as const;

type StudioClass = {
  title: string;
  description: string;
  image: string;
  alt: string;
  large?: boolean;
};

const classes: StudioClass[] = [
  {
    title: "Reformer Pilates",
    description:
      "Equipment-based sessions on our black reformers — sculpt, tone, and strengthen the whole body with precision and control.",
    image: "/studio/class-reformer-2.jpg",
    alt: "Women mid-exercise on a row of reformer machines, legs raised toward the straps",
    large: true,
  },
  {
    title: "Mat Pilates",
    description:
      "Foundation work on our leather studio mats — core strength, posture, and mindful control. Perfect for beginners.",
    image: "/studio/mats-detail.jpg",
    alt: "Embossed leather Ethio Pilates mats laid out with soft pink blocks under warm light",
    large: true,
  },
  {
    title: "Hot Pilates",
    description:
      "A dynamic session in a heated room to raise intensity, boost circulation, and deepen flexibility.",
    image: "/studio/mat-studio.jpg",
    alt: "The bright mirrored mat studio with mats arranged in neat rows",
  },
  {
    title: "Heran's Yoga",
    description:
      "Flow, stretch, and reconnect through calming sessions that reduce stress and bring clarity.",
    image: "/studio/mats-detail-2.jpg",
    alt: "Studio mats and props waiting in soft light before a yoga class",
  },
  {
    title: "Pregnancy Yoga",
    description:
      "Gentle, supportive classes for mothers-to-be — safe movement, breathing, and deep rest.",
    image: "/studio/lounge-art.jpg",
    alt: "The quiet studio lounge with cream armchairs and African portrait art",
  },
  {
    title: "Private Training",
    description:
      "One-on-one reformer sessions tailored entirely to you, with the studio to yourself.",
    image: "/studio/reformer-room.jpg",
    alt: "The empty reformer hall at rest beneath the brass 'who run the world — girls' lettering",
  },
];

export default function Services() {
  return (
    <section id="classes" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0.2, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="max-w-xl"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-primary-dark mb-4">
              Classes for every body
            </h2>
            <p className="text-stone-700 leading-relaxed">
              From your first mat class to advanced reformer work — find the
              practice that meets you where you are.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            <Link
              href="/register"
              className="inline-block border border-brass text-brass hover:bg-brass hover:text-surface px-6 py-3 rounded-sm text-sm uppercase tracking-widest transition-colors duration-300"
            >
              Book a class
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {classes.map((cls, index) => (
            <motion.article
              key={cls.title}
              initial={{ opacity: 0.15, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: (index % 2) * 0.1, ease: EASE }}
              className={`group ${cls.large ? "sm:col-span-2" : ""}`}
            >
              <Link href="/register" className="block">
                <div
                  className={`relative overflow-hidden rounded-sm ${
                    cls.large ? "h-72 md:h-96" : "h-72 md:h-80"
                  }`}
                >
                  <Image
                    src={cls.image}
                    alt={cls.alt}
                    fill
                    sizes={
                      cls.large
                        ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    }
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241a13]/70 via-transparent to-transparent"></div>
                  <h3 className="absolute bottom-4 left-5 right-5 font-serif text-2xl md:text-3xl text-[#faf6ee]">
                    {cls.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm md:text-base text-stone-600 leading-relaxed max-w-prose">
                  {cls.description}
                </p>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
