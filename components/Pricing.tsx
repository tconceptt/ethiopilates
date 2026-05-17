"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Pricing() {
  const coreMemberships = [
    {
      title: "Standard Access",
      subtitle: "Yoga + Hot Pilates",
      prices: [
        { duration: "Drop IN", price: "2,500", note: undefined },
        { duration: "1 Month", price: "8,000", note: undefined },
        { duration: "3 Months", price: "20,000", note: undefined },
        { duration: "6 Months", price: "35,000", note: undefined },
        { duration: "1 Year", price: "55,000", note: undefined },
      ],
      unlimited: true
    },
    {
      title: "Premium Access",
      subtitle: "Yoga + Mat Pilates + Hot Pilates + Reformer",
      prices: [
        { duration: "1 Month", price: "35,000", note: "one class per week for each service" },
        { duration: "3 Months", price: "80,000", note: "4 class for each service" },
        { duration: "6 Months", price: "130,000", note: "8 class for each service" },
      ],
      unlimited: false
    }
  ];

  const classPackages = [
    {
      title: "Hot Pilates",
      prices: [
        { duration: "Drop-in", price: "2,000", note: undefined },
        { duration: "1 Month", price: "6,000", note: "4 class" },
        { duration: "3 Months", price: "10,000", note: "8 class" },
        { duration: "6 Months", price: "15,000", note: "16 class" },
        { duration: "1 Year", price: "20,000", note: "32 class" },
      ]
    },
    {
      title: "Reformer Pilates",
      prices: [
        { duration: "Drop-in", price: "4,500", note: undefined },
        { duration: "1 Month", price: "15,000", note: "4 class" },
        { duration: "3 Months", price: "35,000", note: "12 class" },
        { duration: "6 Months", price: "50,000", note: "24 class" },
        { duration: "1 Year", price: "80,000", note: undefined },
      ]
    },
    {
      title: "Mat Pilates",
      prices: [
        { duration: "Drop-in", price: "2,000", note: undefined },
        { duration: "1 Month", price: "10,000", note: "8 class" },
        { duration: "3 Months", price: "25,000", note: "24 class" },
        { duration: "6 Months", price: "40,000", note: "48 class" },
        { duration: "1 Year", price: "60,000", note: "96 class" },
      ]
    },
    {
      title: "Yoga",
      prices: [
        { duration: "Drop-in", price: "2,000", note: undefined },
        { duration: "1 Month", price: "6,000", note: "4 class" },
        { duration: "3 Months", price: "10,000", note: "8 class" },
        { duration: "6 Months", price: "15,000", note: "16 class" },
        { duration: "1 Year", price: "20,000", note: "32 class" },
      ]
    }
  ];

  const specialtyPrograms = [
    {
      title: "Pregnancy Yoga",
      prices: [
        { duration: "Drop-in", price: "2,500", note: undefined },
        { duration: "1 Month", price: "8,000", note: undefined },
        { duration: "3 Months", price: "20,000", note: undefined },
        { duration: "6 Months", price: "30,000", note: undefined },
      ]
    },
    {
      title: "Kids / Beginner Ballet",
      prices: [
        { duration: "Drop-in", price: "1,500", note: undefined },
        { duration: "1 Month", price: "3,500", note: undefined },
        { duration: "3 Months", price: "9,500", note: undefined },
        { duration: "6 Months", price: "17,000", note: undefined },
        { duration: "1 Year", price: "32,000", note: undefined },
      ]
    },
    {
      title: "VIP / Private Training",
      subtitle: "Free infused water, matcha",
      prices: [
        { duration: "1 Session", price: "10,000", note: undefined },
        { duration: "4 Sessions", price: "30,000", note: undefined },
      ]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-primary-dark mb-6"
          >
            Premium Studio Packages
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
            Choose the package that best fits your wellness journey. Pre-payment and full payment options available.
          </motion.p>
        </div>

        {/* Core Memberships */}
        <div className="mb-16">
          <h3 className="font-serif text-3xl text-center text-primary-dark mb-10">Core Memberships <span className="text-lg italic text-stone-500">(Unlimited Classes)</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {coreMemberships.map((membership, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`bg-white p-8 rounded-sm shadow-sm border-t-4 flex flex-col h-full ${idx === 1 ? 'border-primary' : 'border-secondary'}`}
              >
                <h4 className="font-serif text-2xl text-primary-dark mb-2">{membership.title}</h4>
                <p className="text-sm text-stone-500 mb-6 pb-6 border-b border-stone-100">{membership.subtitle}</p>
                <ul className="space-y-4 mb-8 flex-grow">
                  {membership.prices.map((price, pIdx) => (
                    <li key={pIdx} className="flex justify-between items-center">
                      <span className="text-stone-600 font-medium">{price.duration}</span>
                      <div className="text-right">
                        <span className="text-primary-dark font-serif text-lg">{price.price}</span>
                        {price.note && <p className="text-xs text-stone-400">{price.note}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`block text-center py-3 rounded-sm text-sm uppercase tracking-widest transition-colors mt-auto ${idx === 1 ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-secondary/30 text-primary-dark hover:bg-secondary/50'}`}>
                  Select Package
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Class Packages */}
        <div className="mb-16">
          <h3 className="font-serif text-3xl text-center text-primary-dark mb-10">Class Packages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {classPackages.map((pkg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-sm shadow-sm"
              >
                <h4 className="font-serif text-xl text-primary-dark mb-4 pb-4 border-b border-stone-100">{pkg.title}</h4>
                <ul className="space-y-3">
                  {pkg.prices.map((price, pIdx) => (
                    <li key={pIdx} className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-600 text-sm">{price.duration}</span>
                        <span className="text-primary-dark font-serif">{price.price}</span>
                      </div>
                      {price.note && <span className="text-xs text-stone-400">{price.note}</span>}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Specialty Programs */}
        <div>
          <h3 className="font-serif text-3xl text-center text-primary-dark mb-10">Specialty Programs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {specialtyPrograms.map((program, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-primary-dark text-white p-6 rounded-sm shadow-sm"
              >
                <h4 className="font-serif text-xl mb-2">{program.title}</h4>
                {program.subtitle && <p className="text-sm text-primary-light mb-4 pb-4 border-b border-primary/30">{program.subtitle}</p>}
                {!program.subtitle && <div className="mb-4 pb-4 border-b border-primary/30"></div>}
                
                <ul className="space-y-3">
                  {program.prices.map((price, pIdx) => (
                    <li key={pIdx} className="flex justify-between items-center">
                      <span className="text-primary-light text-sm">{price.duration}</span>
                      <span className="font-serif">{price.price}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}