"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const services = [
  {
    title: "Mat Pilates",
    description: "A foundation-based class using your body weight to build core strength, improve posture, and enhance flexibility. Perfect for beginners and mindful movement.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Reformer Pilates",
    description: "A refined, equipment-based workout using the reformer machine to sculpt, tone, and strengthen your entire body with precision and control.",
    image: "https://images.unsplash.com/photo-1616803689943-5601631c7fec?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Hot Pilates",
    description: "A dynamic Pilates session performed in a heated room to increase intensity, improve flexibility, and boost circulation while strengthening the body.",
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Yoga",
    description: "Flow, stretch, and reconnect through calming and energizing yoga sessions designed to improve flexibility, reduce stress, and bring mental clarity.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Pregnancy Yoga",
    description: "Gentle, supportive classes designed for mothers-to-be. Focused on safe movement, breathing techniques, and relaxation.",
    image: "https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Refreshing Events",
    description: "Relaxing and uplifting experiences designed to help you reset, recharge, and reconnect with yourself and the community.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-primary-dark mb-6"
          >
            What We Offer
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "64px" }}
            viewport={{ once: true }}
            className="h-px bg-primary mx-auto mb-6"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-stone-600"
          >
            Discover our range of classes designed to help you build strength, find balance, and cultivate a deeper connection with your body.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={service.image} 
                  alt={service.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl text-primary-dark mb-3">{service.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}