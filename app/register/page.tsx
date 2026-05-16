"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Register() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createRegistration = useMutation(api.registrations.create);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    package: "",
    experienceLevel: "beginner",
    goals: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createRegistration({
        ...formData,
        email: formData.email || undefined,
        goals: formData.goals || undefined,
      });
      
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Failed to submit registration:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col">
      {/* Simple Header */}
      <header className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-stone-600 hover:text-primary transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm uppercase tracking-widest">Back to Home</span>
          </Link>
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image src="/logo.jpeg" alt="Ethio Pilates Logo" fill sizes="32px" className="object-contain" />
            </div>
            <span className="font-serif text-lg tracking-widest uppercase text-primary-dark hidden sm:block">
              Ethio Pilates
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-grow py-12 px-6">
        <div className="container mx-auto max-w-3xl">
          
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-sm shadow-md p-12 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h1 className="font-serif text-4xl text-primary-dark mb-4">Registration Successful</h1>
              <p className="text-stone-600 mb-8 max-w-md mx-auto leading-relaxed">
                Thank you for choosing Ethio Pilates. We have received your registration details. 
                Our team will contact you shortly to confirm your booking and process your payment.
              </p>
              <Link 
                href="/"
                className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-sm text-sm uppercase tracking-widest transition-colors"
              >
                Return to Homepage
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-sm shadow-md overflow-hidden"
            >
              <div className="bg-primary-dark p-8 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <Image 
                    src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop" 
                    alt="Background" 
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover" 
                  />
                </div>
                <div className="relative z-10">
                  <h1 className="font-serif text-3xl md:text-4xl mb-2">Join the Experience</h1>
                  <p className="text-primary-light text-sm tracking-widest uppercase">Stronger body. Calmer mind. Better energy.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8 md:p-12">
                <div className="mb-10">
                  <h2 className="font-serif text-2xl text-primary-dark mb-6 border-b border-stone-100 pb-2">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-stone-700 mb-2">First Name *</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        name="firstName" 
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-stone-700 mb-2">Last Name *</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        name="lastName" 
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">Email Address (Optional)</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-2">Phone Number *</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="+251 9X XXX XXXX"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h2 className="font-serif text-2xl text-primary-dark mb-6 border-b border-stone-100 pb-2">Class Selection</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="package" className="block text-sm font-medium text-stone-700 mb-2">Select Package/Class *</label>
                      <select 
                        id="package" 
                        name="package" 
                        required
                        value={formData.package}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white"
                      >
                        <option value="" disabled>Select an option</option>
                        <optgroup label="Core Memberships">
                          <option value="standard-1m">Standard Access - 1 Month (20,000 ETB)</option>
                          <option value="standard-3m">Standard Access - 3 Months (42,000 ETB)</option>
                          <option value="standard-6m">Standard Access - 6 Months (84,000 ETB)</option>
                          <option value="standard-1y">Standard Access - 1 Year (150,000 ETB)</option>
                        </optgroup>
                        <optgroup label="Premium Memberships">
                          <option value="premium-1m">Premium Access - 1 Month (45,000 ETB)</option>
                          <option value="premium-3m">Premium Access - 3 Months (130,000 ETB)</option>
                          <option value="premium-6m">Premium Access - 6 Months (200,000 ETB)</option>
                        </optgroup>
                        <optgroup label="Class Packages">
                          <option value="hot-pilates">Hot Pilates</option>
                          <option value="reformer-pilates">Reformer Pilates</option>
                          <option value="mat-pilates">Mat Pilates</option>
                          <option value="yoga">Yoga</option>
                        </optgroup>
                        <optgroup label="Specialty Programs">
                          <option value="pregnancy-yoga">Pregnancy Yoga</option>
                          <option value="ballet">Kids / Beginner Ballet</option>
                          <option value="private">VIP / Private Training</option>
                        </optgroup>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="experienceLevel" className="block text-sm font-medium text-stone-700 mb-2">Experience Level</label>
                      <select 
                        id="experienceLevel" 
                        name="experienceLevel" 
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <label htmlFor="goals" className="block text-sm font-medium text-stone-700 mb-2">What are your goals? (Optional)</label>
                  <textarea 
                    id="goals" 
                    name="goals" 
                    rows={4}
                    value={formData.goals}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="Tell us what you hope to achieve..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-sm text-sm uppercase tracking-widest transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Complete Registration"}
                </button>
                
                <p className="text-center text-xs text-stone-500 mt-6">
                  By registering, you agree to our studio policies. A member of our team will contact you for payment details.
                </p>
              </form>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}