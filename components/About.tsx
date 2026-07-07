"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const EASE = [0.16, 1, 0.3, 1] as const;

const features = [
  {
    title: "Intentional Movement",
    description:
      "Every class is designed with purpose, focusing on precise, controlled movements.",
  },
  {
    title: "Mind-Body Connection",
    description:
      "We guide you to connect deeply with your physical and mental state.",
  },
  {
    title: "Strength & Control",
    description:
      "Mastering the fundamentals to build true strength and flexibility.",
  },
  {
    title: "A Calm Sanctuary",
    description:
      "An elegant, peaceful studio atmosphere that promotes healing and rest.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-surface overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          {/* Photo collage: arched portrait + offset lounge detail */}
          <motion.div
            initial={{ opacity: 0.2, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="lg:col-span-5 relative"
          >
            <div className="relative h-[480px] md:h-[560px] w-full max-w-[420px] mx-auto rounded-t-full overflow-hidden">
              <Image
                src="/studio/class-stretch.jpg"
                alt="Three women stretching together on reformers in the studio's warm daylight"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="hidden md:block absolute -bottom-10 -left-2 lg:-left-8 w-52 h-40 rounded-sm overflow-hidden shadow-lg border-4 border-surface"
            >
              <Image
                src="/studio/entrance-logo.jpg"
                alt="The Ethio Pilates Studio entrance, its round patterned logo glowing on the wall"
                fill
                sizes="208px"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          <div className="lg:col-span-6 lg:col-start-7">
            <motion.div
              initial={{ opacity: 0.2, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <h2 className="font-serif text-4xl md:text-5xl text-primary-dark mb-6">
                This is not just fitness.
                <br />
                <span className="italic text-brass">It&apos;s a lifestyle.</span>
              </h2>
              <div className="w-16 h-px bg-brass mb-10"></div>

              <p className="text-stone-700 mb-6 leading-relaxed text-lg max-w-prose">
                Step into a sanctuary designed to celebrate and elevate the
                female body and spirit. From the reformer hall crowned with the
                words <em className="font-serif">&ldquo;who run the world&rdquo;</em>{" "}
                to the quiet of the sauna, every corner was built for women to
                grow stronger &mdash; together.
              </p>

              <p className="text-stone-700 mb-12 leading-relaxed text-lg max-w-prose">
                Whether you are a beginner, an expecting mother, or simply
                seeking a peaceful retreat from daily life, our studio is a
                space for you to thrive alongside a community of like-minded
                women.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0.2, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
                  className="border-t border-secondary pt-5"
                >
                  <h3 className="font-serif text-xl text-primary-dark mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
