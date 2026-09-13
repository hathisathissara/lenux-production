"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Clock, Menu, X } from "lucide-react";

interface HeaderProps {
  phone: string;
  hours: string;
  companyName: string;
}

import GlobalFloatingActions from "@/components/GlobalFloatingActions";

export default function Header({ phone, hours, companyName }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Team", href: "/team" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };



  return (
    <>
      {/* ==========================================
          🌟 FIXED HEADER CONTAINER (උඩම Fixed වී ඇත)
          ========================================== */}
      <div className={`fixed top-0 left-0 w-full z-50 font-sans transition-all duration-300 ${
        isMenuOpen ? "bg-[#060606] border-b border-white/10" : ""
      }`}>
        
        {/* Top Bar */}
        <div className={`bg-[#0c0c0c]/90 border-b border-white/5 py-2 text-xs text-gray-300 transition-all duration-300 ${
          isScrolled || isMenuOpen ? "hidden sm:block opacity-90" : "block"
        }`}>
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

        {/* 🌟 MAIN NAVBAR */}
        <nav className={`w-full transition-all duration-500 border-b ${
          isScrolled || isMenuOpen
          ? "bg-black/90 backdrop-blur-md border-white/10 shadow-2xl py-3.5"
          : "bg-transparent border-transparent py-4"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-2">
            
            {/* Company Logo */}
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="z-50 shrink-0 flex items-center gap-1.5 sm:gap-2">
              <Image
                src="/images/logo.png"
                alt={companyName}
                width={140}
                height={48}
                className="h-9 sm:h-11 w-auto object-contain"
                style={{ mixBlendMode: "screen" }}
                priority
              />
              <div className="flex flex-col leading-none gap-0.5">
                <span className="text-[16px] sm:text-[18px] md:text-[20px] font-black tracking-[0.15em] text-lenux-emerald uppercase whitespace-nowrap drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]">
                  {companyName.split(" ")[0]}
                </span>
                <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold tracking-[0.25em] text-gray-300 uppercase whitespace-nowrap">
                  {companyName.split(" ").slice(1).join(" ")}
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8 text-sm font-normal">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`transition-all duration-300 drop-shadow ${
                      active
                        ? "text-lenux-emerald font-semibold drop-shadow-[0_0_12px_rgba(16,185,129,0.7)]"
                        : "text-gray-200 hover:text-lenux-emerald"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA Button */}
            <Link 
              href="/contact" 
              className="hidden lg:inline-block px-6 py-2.5 border border-lenux-emerald bg-lenux-emerald/10 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-lenux-emerald hover:shadow-lg hover:shadow-lenux-emerald/30 transition-all duration-300"
            >
              Get a Quote
            </Link>

            {/* Mobile Hamburger / Close Button (Transforms Burger -> X) */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden z-50 text-white hover:text-lenux-emerald p-2 transition-all"
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMenuOpen ? (
                <X size={26} className="text-lenux-emerald transition-transform duration-300 rotate-90" />
              ) : (
                <Menu size={26} className="text-white transition-transform duration-300" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* ==========================================
          MOBILE DRAWER MENU (Navbar යටින් slide වේ)
          ========================================== */}
      <div className={`fixed inset-y-0 right-0 z-40 w-[85vw] sm:w-80 bg-[#080808] border-l border-white/10 pt-24 sm:pt-28 pb-8 px-6 flex flex-col justify-between shadow-2xl transition-transform duration-500 ease-in-out lg:hidden ${
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="space-y-6">
          <nav className="flex flex-col gap-5 text-base font-normal">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  onClick={() => setIsMenuOpen(false)}
                  href={link.href}
                  className={`transition-all py-1 ${
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
        <div className="pt-6">
          <Link 
            onClick={() => setIsMenuOpen(false)} 
            href="/contact" 
            className="block text-center px-5 py-3.5 bg-lenux-emerald text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-lenux-emerald/20 hover:bg-emerald-400 transition-all"
          >
            Get a Quote
          </Link>
        </div>
      </div>

      {/* Dark Backdrop Overlay */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* 🌟 GLOBAL FLOATING WHATSAPP BUTTON & BACK TO TOP BUTTON */}
      <GlobalFloatingActions />
    </>
  );
}