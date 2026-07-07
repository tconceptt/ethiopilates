"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Classes", href: "/#classes" },
    { name: "Schedule", href: "/#schedule" },
    { name: "Pricing", href: "/#pricing" },
  ];

  // Over the dark hero photo the bar is transparent with light text;
  // once scrolled it settles onto warm cream.
  const solid = isScrolled || mobileMenuOpen;

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        solid ? "bg-background/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image src="/logo.jpeg" alt="Ethio Pilates Logo" fill sizes="48px" className="object-contain" />
          </div>
          <span
            className={`font-serif text-lg lg:text-xl tracking-widest uppercase whitespace-nowrap ${
              solid ? "text-primary-dark" : "text-[#faf6ee]"
            }`}
          >
            Ethio Pilates
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-xs lg:text-sm uppercase tracking-wider lg:tracking-widest transition-colors ${
                solid
                  ? "text-stone-700 hover:text-brass"
                  : "text-[#f0e8da] hover:text-[#dcc188]"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/register"
            className={`px-4 lg:px-6 py-2.5 rounded-sm text-xs lg:text-sm uppercase tracking-wider lg:tracking-widest whitespace-nowrap transition-colors ${
              solid
                ? "bg-primary-dark hover:bg-foreground text-[#faf6ee]"
                : "bg-[#dcc188] hover:bg-[#e8d5ae] text-[#2a1a12]"
            }`}
          >
            Book a Class
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden ${solid ? "text-stone-800" : "text-[#faf6ee]"}`}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background shadow-lg py-6 px-6 flex flex-col gap-4 border-t border-secondary">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm uppercase tracking-widest text-stone-700 hover:text-brass py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/register"
            className="bg-primary-dark text-[#faf6ee] text-center px-6 py-3 rounded-sm text-sm uppercase tracking-widest mt-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Book a Class
          </Link>
        </div>
      )}
    </header>
  );
}
