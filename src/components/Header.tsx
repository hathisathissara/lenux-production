"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Clock, Menu, X } from "lucide-react";

interface HeaderProps {
  phone: string;
  hours: string;
  companyName: string;
}

export default function Header({ phone, hours, companyName }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // 🌟 අපේ ඇත්තම Pages වලට අදාළ Navigation Links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Contact", href: "/contact" },
  ];

  // Current Active Page හඳුනාගැනීම
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ==========================================
          1. TOP BAR (Phone & Business Hours)
          ========================================== */}
      <div className="bg-[#0c0c0c] border-b border-white/5 py-2.5 text-xs text-gray-300 z-30 relative font-sans">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between sm:justify-start gap-6">
          <div className="flex items-center gap-2">
            <Phone size={13} className="text-lenux-emerald" />
            <span className="font-light tracking-wider">{phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-lenux-emerald" />
            <span className="font-light tracking-wider">{hours}</span>
          </div>
        </div>
      </div>

      {/* ==========================================
          2. MAIN HEADER NAVBAR
          ========================================== */}
      <header className="absolute top-10 left-0 w-full z-40 bg-transparent font-sans">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Company Name / Logo */}
          <Link href="/" className="z-50">
            <h1 className="text-base md:text-2xl font-bold tracking-wider text-white uppercase transition-all">
              {companyName}
            </h1>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-normal">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-all duration-300 ${
                    active
                      ? "text-lenux-emerald font-semibold drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      : "text-gray-300 hover:text-lenux-emerald"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* 🌟 Desktop Primary CTA Button */}
          <Link 
            href="/contact" 
            className="hidden lg:inline-block px-6 py-2.5 border border-lenux-emerald bg-lenux-emerald/10 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-lenux-emerald hover:shadow-lg hover:shadow-lenux-emerald/30 transition-all duration-300"
          >
            Get a Quote
          </Link>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden z-50 text-white hover:text-lenux-emerald p-2 transition-all"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* ==========================================
          3. MOBILE DRAWER MENU
          ========================================== */}
      <div className={`fixed inset-y-0 right-0 z-40 w-72 bg-[#080808] border-l border-white/5 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-500 ease-in-out lg:hidden ${
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="space-y-8 pt-20">
          <span className="block text-[10px] font-bold text-lenux-emerald uppercase tracking-widest border-b border-white/5 pb-2">
            Navigation
          </span>
          
          <nav className="flex flex-col gap-6 text-base font-normal">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  onClick={() => setIsMenuOpen(false)}
                  href={link.href}
                  className={`transition-all ${
                    active ? "text-lenux-emerald font-semibold" : "text-gray-300 hover:text-lenux-emerald"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile CTA Button */}
        <div className="space-y-4">
          <Link 
            onClick={() => setIsMenuOpen(false)} 
            href="/contact" 
            className="block text-center px-5 py-3.5 bg-lenux-emerald text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-lenux-emerald/20 transition-all"
          >
            Get a Quote
          </Link>
        </div>
      </div>

      {/* Dark Backdrop Overlay */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
}