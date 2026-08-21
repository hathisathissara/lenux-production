import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";
import { Portfolio } from "@/models/Portfolio";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import PortfolioGallery from "@/components/PortfolioGallery"; // 🌟 Interactive Gallery Component

import { Sparkles, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

async function getPortfolioData() {
  await connectDB();

  const [settingsDoc, projectsDoc] = await Promise.all([
    ContactInformation.findOne().lean(),
    Portfolio.find({ isPublished: true })
      .populate("service", "title")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  const settings = settingsDoc ? JSON.parse(JSON.stringify(settingsDoc)) : null;
  const projects = projectsDoc ? JSON.parse(JSON.stringify(projectsDoc)) : [];

  return { settings, projects };
}

export default async function PortfolioPage() {
  const { settings, projects } = await getPortfolioData();

  const phone = settings?.phone || "+94 77 123 4567";
  const hours = settings?.businessHours || "Monday - Saturday: 8:30 AM - 5:30 PM";
  const companyName = settings?.companyName || "LENUX PRODUCTION (PVT) LTD";
  const whatsapp = settings?.whatsapp || "+94 77 123 4567";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* 🌟 1. Header */}
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* ==========================================
          PORTFOLIO HERO BANNER
          ========================================== */}
      <section className="relative w-full pt-40 pb-20 bg-gradient-to-b from-[#091712] via-black to-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image src="/images/hero-bg.jpg" alt="Portfolio Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lenux-emerald/30 bg-lenux-emerald/10 text-lenux-emerald text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> 100% Original Works
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight">
              Our Visual <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 bg-clip-text text-transparent">Portfolio</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Explore our completed advertising, vehicle branding, signage, printing, and event production projects.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          🌟 INTERACTIVE PORTFOLIO GRID & LIGHTBOX
          ========================================== */}
      <section className="py-24 bg-[#040404] relative">
        <div className="max-w-7xl mx-auto px-6">
          <PortfolioGallery projects={projects} />
        </div>
      </section>

      {/* ==========================================
          CTA BANNER
          ========================================== */}
      {/* ==========================================
          🌟 HIGH-IMPACT CLIENT CTA BANNER
          ========================================== */}
      <section className="py-24 bg-gradient-to-r from-[#06241a] via-[#081f17] to-[#040e0a] border-t border-lenux-emerald/30 relative text-center">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-lenux-emerald/20 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <ScrollReveal>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white">
              Have an Idea? <br /><span className="text-lenux-emerald">Let’s Bring It to Life.</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
              From graphic design and printing to complete business branding and on-site production.
            </p>
            
            {/* 🌟 ඩිසයින් එකට අනුව බටන්ස් දෙක නිවැරදිව සකසා ඇත */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {/* බටන් 1: Get a Free Quote */}
              <Link 
                href="/contact" 
                className="px-8 py-4 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark shadow-xl shadow-lenux-emerald/30 transition-all duration-300"
              >
                Get a Free Quote
              </Link>
              
              {/* බටන් 2: WhatsApp Us */}
              <a 
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 border border-emerald-400/40 text-emerald-400 bg-emerald-950/40 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-emerald hover:text-white transition-all duration-300 inline-flex items-center gap-2"
              >
                <MessageCircle size={16} /> WhatsApp Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

    </div>
  );
}