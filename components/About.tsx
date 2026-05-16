"use client";

import { motion } from "framer-motion";
import { Leaf, Heart, Wind, Sparkles } from "lucide-react";

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
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-primary-dark mb-6">
              This is not just fitness.<br />
              <span className="italic text-primary">It&apos;s a lifestyle.</span>
            </h2>
            <div className="w-16 h-px bg-primary mx-auto mb-10"></div>
            
            <p className="text-stone-600 mb-6 leading-relaxed text-lg">
              Step into a sanctuary designed to celebrate and elevate the female body and spirit. 
              We&apos;ve cultivated a safe, supportive environment where women can build strength, find balance, 
              and embrace their wellness journey with confidence.
            </p>
            
            <p className="text-stone-600 mb-16 leading-relaxed text-lg">
              Whether you are a beginner, an expecting mother, or simply seeking a peaceful retreat from daily life, 
              our studio is a space for you to thrive alongside a community of like-minded women. We offer 
              self-awareness sessions, guided reflections, and mindfulness practices to deepen your connection with yourself.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 text-left">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="mt-1 bg-secondary/30 p-3 rounded-full h-fit">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-primary-dark mb-2">{feature.title}</h3>
                    <p className="text-sm text-stone-500 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}