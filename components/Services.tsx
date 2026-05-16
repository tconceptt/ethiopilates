"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Mat Pilates",
    description: "A foundation-based class using your body weight to build core strength, improve posture, and enhance flexibility. Perfect for beginners and mindful movement."
  },
  {
    title: "Reformer Pilates",
    description: "A refined, equipment-based workout using the reformer machine to sculpt, tone, and strengthen your entire body with precision and control."
  },
  {
    title: "Hot Pilates",
    description: "A dynamic Pilates session performed in a heated room to increase intensity, improve flexibility, and boost circulation while strengthening the body."
  },
  {
    title: "Yoga",
    description: "Flow, stretch, and reconnect through calming and energizing yoga sessions designed to improve flexibility, reduce stress, and bring mental clarity."
  },
  {
    title: "Pregnancy Yoga",
    description: "Gentle, supportive classes designed for mothers-to-be. Focused on safe movement, breathing techniques, and relaxation."
  },
  {
    title: "Refreshing Events",
    description: "Relaxing and uplifting experiences designed to help you reset, recharge, and reconnect with yourself and the community."
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
              className="group cursor-pointer bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow border border-stone-100 h-full"
            >
              <div className="p-10 h-full flex flex-col justify-center">
                <h3 className="font-serif text-2xl text-primary-dark mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
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