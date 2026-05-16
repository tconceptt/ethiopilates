import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <Image src="/logo.jpeg" alt="Ethio Pilates Logo" fill sizes="40px" className="object-contain" />
              </div>
              <span className="font-serif text-xl tracking-widest uppercase text-white">
                Ethio Pilates
              </span>
            </div>
            <p className="text-sm leading-relaxed text-stone-400">
              A space for movement, healing, and self-connection. We combine Pilates, yoga, and curated wellness experiences to help you feel strong, balanced, and refreshed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-white mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#about" className="text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/#services" className="text-sm hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/#pricing" className="text-sm hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/register" className="text-sm hover:text-white transition-colors">Book a Class</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg text-white mb-6 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-primary mt-0.5" />
                <div className="flex flex-col text-sm">
                  <span>+251 92 917 7443</span>
                  <span>+251 99 144 1966</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-0.5" />
                <span className="text-sm">Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-primary mt-0.5" />
                <a href="mailto:info@ethiopilates.com" className="text-sm hover:text-white transition-colors">
                  info@ethiopilates.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-stone-800 text-center text-xs text-stone-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Ethio Pilates. All rights reserved.</p>
          <p>Designed for wellness and mindful movement.</p>
        </div>
      </div>
    </footer>
  );
}