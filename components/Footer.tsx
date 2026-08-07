import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#241a13] text-[#d8ccbd] pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image src="/logo.jpeg" alt="Ethio Pilates Logo" fill sizes="40px" className="object-contain" />
              </div>
              <span className="font-serif text-xl tracking-widest uppercase text-[#faf6ee]">
                Ethio Pilates
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#bfb0a0]">
              A space for movement, healing, and self-connection. We combine
              Pilates, yoga, and curated wellness experiences to help you feel
              strong, balanced, and refreshed.
            </p>
            <p className="font-serif italic text-lg text-[#c9a55e] mt-6">
              Move &middot; Breathe &middot; Thrive
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-[#faf6ee] mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm hover:text-[#faf6ee] transition-colors">Home</Link></li>
              <li><Link href="/#about" className="text-sm hover:text-[#faf6ee] transition-colors">About Us</Link></li>
              <li><Link href="/#classes" className="text-sm hover:text-[#faf6ee] transition-colors">Classes</Link></li>
              <li><Link href="/#schedule" className="text-sm hover:text-[#faf6ee] transition-colors">Schedule</Link></li>
              <li><Link href="/#pricing" className="text-sm hover:text-[#faf6ee] transition-colors">Pricing</Link></li>
              <li><Link href="/register" className="text-sm hover:text-[#faf6ee] transition-colors">Book a Class</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg text-[#faf6ee] mb-6 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-[#c9a55e] mt-0.5" />
                <div className="flex flex-col text-sm">
                  <span>+251 92 917 7443</span>
                  <span>+251 97 790 0331</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#c9a55e] mt-0.5" />
                <span className="text-sm">Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-[#c9a55e] mt-0.5" />
                <a href="mailto:info@ethiopilates.com" className="text-sm hover:text-[#faf6ee] transition-colors">
                  info@ethiopilates.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#3d2f24] text-center text-xs text-[#9a8c7c] flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Ethio Pilates. All rights reserved.</p>
          <p>Designed for wellness and mindful movement.</p>
        </div>
      </div>
    </footer>
  );
}
