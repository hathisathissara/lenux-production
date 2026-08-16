import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";
import { ServiceCategory } from "@/models/ServiceCategory";
import { Service } from "@/models/Service";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollToTop from "@/components/ScrollToTop";
import ServicesCatalog from "@/components/ServicesCatalog"; // 🌟 Interactive Filter Catalog

import { 
  Sparkles, ShieldCheck, Award, Zap, ThumbsUp, 
  ArrowRight, MessageCircle 
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getServicesData() {
  await connectDB();

  const [settingsDoc, categoriesDoc, servicesDoc] = await Promise.all([
    ContactInformation.findOne().lean(),
    ServiceCategory.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
    Service.find({ isActive: true }).populate("category", "name slug").sort({ sortOrder: 1 }).lean(),
  ]);

  // Serialization fix for Server-to-Client components
  const settings = settingsDoc ? JSON.parse(JSON.stringify(settingsDoc)) : null;
  const categories = categoriesDoc ? JSON.parse(JSON.stringify(categoriesDoc)) : [];
  const services = servicesDoc ? JSON.parse(JSON.stringify(servicesDoc)) : [];

  return { settings, categories, services };
}

export default async function ServicesPage() {
  const { settings, categories, services } = await getServicesData();

  const phone = settings?.phone || "+94 77 123 4567";
  const hours = settings?.businessHours || "Monday - Saturday: 8:30 AM - 5:30 PM";
  const companyName = settings?.companyName || "LENUX PRODUCTION (PVT) LTD";
  const email = settings?.email || "info@lenux.lk";
  const whatsapp = settings?.whatsapp || "+94 77 123 4567";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* 🌟 1. Header */}
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* ==========================================
          SERVICES HERO BANNER
          ========================================== */}
      <section className="relative w-full pt-40 pb-20 bg-gradient-to-b from-[#091712] via-black to-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image src="/images/hero-bg.jpg" alt="Services Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lenux-emerald/30 bg-lenux-emerald/10 text-lenux-emerald text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> Full Visual Solutions
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight">
              Design, Print & <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 bg-clip-text text-transparent">Production</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Complete advertising, printing, branding, and manufacturing solutions customized to elevate your brand.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          🌟 INTERACTIVE SERVICES CATALOG (Search & Filters)
          ========================================== */}
      <section className="py-24 bg-[#040404] relative">
        <div className="max-w-7xl mx-auto px-6">
          <ServicesCatalog categories={categories} services={services} />
        </div>
      </section>

      {/* ==========================================
          🌟 UV PREMIUM FINISHING NOTE
          ========================================== */}
      <section className="py-16 bg-[#080808] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="text-lenux-emerald" size={20} /> UV Premium Finishing Guarantee
            </h4>
            <p className="text-xs sm:text-sm text-gray-400 font-light max-w-2xl">
              All of our board works, light boards, and sticker applications can be enhanced with UV protective coats and premium glossy/matte finishes for long-lasting durability.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark transition-all shrink-0 shadow-lg shadow-lenux-emerald/20"
          >
            Request Custom Spec
          </Link>
        </div>
      </section>

      {/* ==========================================
          CTA BANNER
          ========================================== */}
      <section className="py-24 bg-gradient-to-r from-[#06241a] via-[#081f17] to-[#040e0a] border-t border-lenux-emerald/30 relative text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <ScrollReveal>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white">
              Need a Custom <span className="text-lenux-emerald">Quotation?</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
              Tell us your requirements, quantity, and deadlines. We'll provide a fair, prompt estimate.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/contact" className="px-8 py-4 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark shadow-xl transition-all">
                Get a Quote
              </Link>
              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="px-8 py-4 border border-emerald-400/40 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-emerald hover:text-white transition-all inline-flex items-center gap-2">
                <MessageCircle size={16} /> WhatsApp Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          FOOTER
          ========================================== */}
      <footer className="bg-[#040404] border-t border-white/10 pt-16 pb-12 text-sm text-gray-400">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xl font-bold text-white tracking-wider uppercase">{companyName}</h4>
            <p className="text-xs text-lenux-emerald font-semibold uppercase tracking-widest">Design, Print & Production</p>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Sri Lanka's leading visual advertising and branding partner, creating impactful printing, signboards, displays, and event solutions.
            </p>
          </div>
          <div className="space-y-3">
            <h5 className="text-white font-bold text-xs uppercase tracking-widest">Quick Links</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-lenux-emerald">Home</Link></li>
              <li><Link href="/about" className="hover:text-lenux-emerald">About Us</Link></li>
              <li><Link href="/services" className="hover:text-lenux-emerald">All Services</Link></li>
              <li><Link href="/portfolio" className="hover:text-lenux-emerald">Portfolio</Link></li>
              <li><Link href="/contact" className="hover:text-lenux-emerald">Contact</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-white font-bold text-xs uppercase tracking-widest">Top Services</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/services" className="hover:text-lenux-emerald">Digital Printing</Link></li>
              <li><Link href="/services" className="hover:text-lenux-emerald">Offset Printing</Link></li>
              <li><Link href="/services" className="hover:text-lenux-emerald">Vehicle Branding</Link></li>
              <li><Link href="/services" className="hover:text-lenux-emerald">Board & Signage</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-white font-bold text-xs uppercase tracking-widest">Get In Touch</h5>
            <p className="text-xs">{phone}</p>
            <p className="text-xs">{email}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 text-xs text-gray-500 text-center sm:text-left">
          © {new Date().getFullYear()} Lenux Production. All Rights Reserved.
        </div>
      </footer>

      {/* Floating Scroll To Top */}
      <ScrollToTop />

    </div>
  );
}