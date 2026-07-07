"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GlassWater, Flame, Snowflake, Sun } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const amenities = [
  {
    icon: GlassWater,
    title: "Free Water",
    description: "Stay hydrated, on us — before, during, and after class.",
  },
  {
    icon: Flame,
    title: "Sauna",
    description: "Relax, detox, and unwind in our cedar sauna.",
  },
  {
    icon: Snowflake,
    title: "Ice Bath",
    description: "Refresh your body and reset your mind after training.",
  },
  {
    icon: Sun,
    title: "Red Light Therapy",
    description: "Rejuvenate, recover, and restore between sessions.",
  },
];

export default function Amenities() {
  return (
    <section id="amenities" className="bg-oxblood-deep text-[#f3e6dc] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0.2, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <h2 className="font-serif text-4xl md:text-5xl mb-4 text-[#faf0e8]">
                More than a workout
              </h2>
              <p className="text-[#e7cbbd] text-lg leading-relaxed mb-12 max-w-prose">
                Every package includes full access to the studio&apos;s recovery
                suite — arrive early, stay late, and leave lighter than you came.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-9">
              {amenities.map((amenity, index) => (
                <motion.div
                  key={amenity.title}
                  initial={{ opacity: 0.15, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
                  className="flex gap-4 items-start"
                >
                  <amenity.icon
                    aria-hidden
                    className="w-6 h-6 mt-1 shrink-0 text-[#dcb08a]"
                    strokeWidth={1.5}
                  />
                  <div>
                    <h3 className="font-serif text-2xl mb-1.5 text-[#faf0e8]">
                      {amenity.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#e7cbbd]">
                      {amenity.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0.2, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="lg:col-span-6 grid grid-cols-5 gap-4 md:gap-5"
          >
            <div className="col-span-3 relative h-72 md:h-[420px] rounded-sm overflow-hidden">
              <Image
                src="/studio/sauna.jpg"
                alt="The cedar sauna glowing warmly against the studio's olive walls"
                fill
                sizes="(max-width: 1024px) 60vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="col-span-2 relative h-72 md:h-[420px] rounded-sm overflow-hidden md:mt-10">
              <Image
                src="/studio/locker-lounge.jpg"
                alt="The locker lounge — glossy oxblood lockers, soft seating, and quiet light"
                fill
                sizes="(max-width: 1024px) 40vw, 20vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
