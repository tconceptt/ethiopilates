"use client";

import { motion } from "framer-motion";
import { Leaf, Heart, Wind, Sparkles } from "lucide-react";
import Image from "next/image";

export default function About() {
  const features = [
    {
      icon: <Wind className="w-6 h-6 text-primary" />,
      title: "Intentional Movement",
      description: "Every class is designed with purpose, focusing on precise, controlled movements."
    },
    {
      icon: <Heart className="w-6 h-6 text-primary" />,
      title: "Mind-Body Connection",
      description: "We guide you to connect deeply with your physical and mental state."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      title: "Precision & Control",
      description: "Mastering the fundamentals to build true strength and flexibility."
    },
    {
      icon: <Leaf className="w-6 h-6 text-primary" />,
      title: "Calm Environment",
      description: "An elegant, peaceful studio atmosphere that promotes healing and relaxation."
    }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-primary-dark mb-6">
              This is not just fitness.<br />
              <span className="italic text-primary">It&apos;s a lifestyle.</span>
            </h2>
            <div className="w-16 h-px bg-primary mb-8"></div>
            
            <p className="text-stone-600 mb-6 leading-relaxed">
              At Ethio Pilates, we go beyond workouts to create meaningful experiences. 
              Whether you are a beginner, an expecting mother, or someone seeking stress relief, 
              our studio is designed for you.
            </p>
            
            <p className="text-stone-600 mb-10 leading-relaxed">
              We offer self-awareness sessions, guided reflections, and mindfulness practices 
              to deepen your connection with yourself. Join our community to find a balance of 
              movement, wellness, and unique experiences beyond traditional fitness.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="mt-1 bg-secondary/30 p-2 rounded-full h-fit">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-primary-dark mb-2">{feature.title}</h3>
                    <p className="text-sm text-stone-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] rounded-t-full overflow-hidden shadow-xl"
          >
            <Image 
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2070&auto=format&fit=crop" 
              alt="Pilates Studio Environment" 
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}