import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";
import { ServiceCategory } from "@/models/ServiceCategory";
import { Portfolio } from "@/models/Portfolio";
import { Staff } from "@/models/Staff";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollToTop from "@/components/ScrollToTop";

import { 
  Target, Eye, ArrowRight, ShieldCheck, Award, Zap, 
  DollarSign, Clock4, ThumbsUp, Phone, Mail, MapPin, 
  Clock, Sparkles, MessageCircle, ExternalLink 
} from "lucide-react";

// ==========================================
// 100% BUILD-SAFE INLINE SVG BRAND ICONS
// ==========================================
const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
);
const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);
const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);

// Database එකෙන් සියලුම Home Page දත්ත Server-Side ලබාගැනීම
async function getHomeData() {
  await connectDB();

  const [settings, categories, featuredProjects, featuredStaff] = await Promise.all([
    ContactInformation.findOne(),
    ServiceCategory.find({ isActive: true }).sort({ sortOrder: 1 }).limit(8),
    Portfolio.find({ isFeatured: true, isPublished: true }).populate('service', 'title').limit(6),
    Staff.find({ isFeatured: true, isActive: true }).sort({ sortOrder: 1 }).limit(4),
  ]);

  return { settings, categories, featuredProjects, featuredStaff };
}

export default async function HomePage() {
  const { settings, categories, featuredProjects, featuredStaff } = await getHomeData();

  const phone = settings?.phone || "+94 77 123 4567";
  const whatsapp = settings?.whatsapp || "+94 77 123 4567";
  const hours = settings?.businessHours || "Monday - Saturday: 8:30 AM - 5:30 PM";
  const email = settings?.email || "info@lenux.lk";
  const address = settings?.address || "Colombo, Sri Lanka";
  const companyName = settings?.companyName || "LENUX PRODUCTION (PVT) LTD";
  const mapUrl = settings?.googleMapUrl || "";

  const visionText = settings?.vision || "To become Sri Lanka's leading creative and advertising agency, delivering innovative, high-quality, and impactful solutions that help businesses stand out and grow.";
  const missionText = settings?.mission || "To provide fair, fast, and reliable advertising and production services that help our clients connect with their customers effectively. We combine creativity, quality, and professionalism under one roof to deliver results that matter.";
  const visionImg = settings?.visionImage?.url || "/images/values-man-bg.jpeg";
  const missionImg = settings?.missionImage?.url || "/images/hero-bg.jpg";
  const logoImg = settings?.logo?.url || "/images/logo.png";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* 🌟 1. HEADER (Top bar + Responsive Hamburger Menu) */}
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* ==========================================
          🌟 SECTION 01 — HERO SECTION
          ========================================== */}
      <section className="relative w-full min-h-screen flex items-center justify-start overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-bg.jpg" 
            alt="Lenux Production Hero"
            fill
            className="object-cover object-center md:object-right"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/75 to-black md:bg-gradient-to-r md:from-black md:via-black/75 md:to-transparent z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full mt-8 md:mt-12">
          <ScrollReveal>
            <div className="max-w-2xl space-y-5">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-light text-white tracking-wide uppercase leading-tight drop-shadow-md">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 bg-clip-text text-transparent font-bold inline-block">
                  LENUX PRODUCTION
                </span>
              </h2>
              
              <p className="text-sm sm:text-lg md:text-xl text-white font-medium tracking-wide drop-shadow leading-relaxed">
                Lenux is the ideal platform to take your business to the public and reach a wider audience.
              </p>

              <p className="text-xs sm:text-sm text-gray-200 font-light leading-relaxed drop-shadow-sm max-w-xl">
                Lenux Production is a creative advertising and branding company in Sri Lanka. We design, print, and build visual solutions that help businesses grow and get noticed.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <Link href="/services" className="px-7 py-3 border border-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-emerald hover:shadow-lg hover:shadow-lenux-emerald/30 transition-all duration-300">
                Explore Services
              </Link>
              <Link href="/contact" className="px-7 py-3 border border-white/30 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:border-lenux-emerald hover:bg-lenux-emerald/10 transition-all duration-300">
                Get a Quote
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          🌟 SECTION 02 — VISION & MISSION
          ========================================== */}
      <section className="relative w-full bg-[#050505] text-white py-28 overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 space-y-14 relative z-10">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center space-y-4">
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase text-white">
                Our <span className="text-emerald-500">Vision & Mission</span>
              </h3>
              <div className="flex items-center justify-center gap-3 w-48 mx-auto pt-1">
                <div className="h-[1.5px] bg-white/10 flex-1" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-950" />
                <div className="h-[1.5px] bg-white/10 flex-1" />
              </div>
              <p className="text-sm md:text-base text-gray-400 font-medium tracking-wide">
                Guided by Purpose. Driven by Impact.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Vision */}
            <ScrollReveal>
              <div className="rounded-[2.5rem] bg-gradient-to-b from-[#0d1c15] via-[#08120d] to-[#040806] border border-emerald-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-between h-[580px] p-8 sm:p-10 relative group hover:border-emerald-500/50 transition-all duration-500">
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-full bg-[#0d221a] border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform duration-500">
                      <Eye size={24} />
                    </div>
                    <span className="px-5 py-1.5 rounded-full bg-[#091a13] border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest shadow-inner">
                      Vision
                    </span>
                  </div>

                  <h4 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide pt-2">
                    Our <span className="text-emerald-400">Vision</span>
                  </h4>

                  <div className="flex items-start gap-3">
                    <span className="text-emerald-500 text-2xl font-serif font-black leading-none shrink-0">“</span>
                    <p className="text-gray-200 text-sm sm:text-base font-normal leading-relaxed italic">{visionText}”</p>
                  </div>
                </div>

                <div className="relative w-[calc(100%+5rem)] sm:w-[calc(100%+5rem)] h-64 -mx-8 sm:-mx-10 -mb-8 sm:-mb-10 overflow-hidden mt-6">
                  <Image src={visionImg} alt="Vision Visual" fill className="object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#08120d] via-transparent to-transparent h-16" />
                </div>
              </div>
            </ScrollReveal>

            {/* Mission */}
            <ScrollReveal>
              <div className="rounded-[2.5rem] bg-gradient-to-b from-[#0d1c15] via-[#08120d] to-[#040806] border border-emerald-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-between h-[580px] p-8 sm:p-10 relative group hover:border-emerald-500/50 transition-all duration-500">
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-full bg-[#0d221a] border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform duration-500">
                      <Target size={24} />
                    </div>
                    <span className="px-5 py-1.5 rounded-full bg-[#091a13] border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest shadow-inner">
                      Mission
                    </span>
                  </div>

                  <h4 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide pt-2">
                    Our <span className="text-emerald-400">Mission</span>
                  </h4>

                  <div className="flex items-start gap-3">
                    <span className="text-emerald-500 text-2xl font-serif font-black leading-none shrink-0">“</span>
                    <p className="text-gray-200 text-sm sm:text-base font-normal leading-relaxed italic">{missionText}”</p>
                  </div>
                </div>

                <div className="relative w-[calc(100%+5rem)] sm:w-[calc(100%+5rem)] h-64 -mx-8 sm:-mx-10 -mb-8 sm:-mb-10 overflow-hidden mt-6">
                  <Image src={missionImg} alt="Mission Visual" fill className="object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#08120d] via-transparent to-transparent h-16" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          🌟 SECTION 03 — 5 CORE VALUES
          ========================================== */}
      <section className="relative w-full py-32 overflow-hidden bg-black flex items-center border-t border-white/5">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/values-man-bg.jpeg" 
            alt="Core Values Background"
            fill
            className="object-cover object-left md:object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/65 md:bg-transparent md:bg-gradient-to-r md:from-black/10 md:to-black/90 z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-20 w-full">
          <div className="hidden lg:block lg:col-span-5 h-[500px]" />

          <div className="lg:col-span-7 space-y-8 my-auto">
            <ScrollReveal>
              <h3 className="text-3xl md:text-4xl font-bold tracking-wide text-lenux-emerald">
                Lenux Production - 5 Core Values
              </h3>

              <div className="relative pl-8 space-y-8 py-2">
                <div className="absolute left-0 top-1 bottom-1 w-[4px] bg-gradient-to-b from-lenux-emerald via-lenux-emerald/80 to-lenux-emerald/10 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.7)]" />

                {[
                  { id: "1", title: "Trustworthiness", desc: "We deliver every project with honesty and integrity." },
                  { id: "2", title: "Quality", desc: "Excellence in design, printing, and production." },
                  { id: "3", title: "Creativity", desc: "Innovative ideas that make your brand stand out." },
                  { id: "4", title: "Customer Focus", desc: "Putting clients and their customers first." },
                  { id: "5", title: "Efficiency", desc: "Timely delivery and smooth processes for every project." }
                ].map((val) => (
                  <div key={val.id} className="space-y-1 relative">
                    <h4 className="text-lg font-bold text-gray-100 tracking-wide">
                      {val.id}. {val.title}
                    </h4>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          🌟 SECTION 04 — WHO WE ARE (About Brief)
          ========================================== */}
      <section className="py-28 bg-[#070707] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lenux-emerald/30 bg-lenux-emerald/10 text-lenux-emerald text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} /> Who We Are
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Turning Ideas Into <span className="text-lenux-emerald">Powerful Brand Visuals</span>
              </h3>
              <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
                Lenux Production is a creative advertising and branding company in Sri Lanka. We design, print, and build visual solutions that help businesses grow and get noticed.
              </p>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                From creative design to precision printing, vehicle branding, signboards, and full event productions, we manage everything under one roof with utmost quality.
              </p>
              <div className="pt-4">
                <Link href="/about" className="inline-flex items-center gap-2 px-8 py-3.5 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-lenux-dark transition-all duration-300 shadow-lg shadow-lenux-emerald/20">
                  Discover Lenux Production <ArrowRight size={16} />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-6">
            <ScrollReveal>
              <div className="relative h-[450px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image 
                  src={logoImg} 
                  alt="Lenux Production Facility" 
                  fill 
                  className="object-contain p-8 hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          🌟 SECTION 05 — OUR SERVICES (Dynamic Grid)
          ========================================== */}
      <section className="py-28 bg-black border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Our Expertise</span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide uppercase">
                What We <span className="text-lenux-emerald">Do</span>
              </h3>
              <p className="text-gray-400 text-sm md:text-base font-light">
                Complete advertising, printing, branding, and production solutions under one roof.
              </p>
            </div>
          </ScrollReveal>

          {/* Dynamic Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat: any) => (
              <ScrollReveal key={cat._id}>
                <div className="bg-[#0c0c0c] rounded-2xl border border-white/5 overflow-hidden hover:border-lenux-emerald/50 transition-all duration-500 group flex flex-col justify-between h-full shadow-lg">
                  <div>
                    <div className="relative w-full h-44 bg-gray-900 overflow-hidden">
                      {cat.image?.url ? (
                        <Image src={cat.image.url} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700">No Image</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />
                    </div>
                    <div className="p-6 space-y-2">
                      <h4 className="text-lg font-bold text-white group-hover:text-lenux-emerald transition-colors">{cat.name}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{cat.description || "High quality visual production and branding service."}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link href={`/services`} className="text-xs font-bold text-lenux-emerald hover:text-white flex items-center gap-1.5 transition-colors">
                      Explore Services <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center pt-6">
            <Link href="/services" className="px-8 py-3.5 border border-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-emerald transition-all duration-300 inline-flex items-center gap-2">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          🌟 SECTION 06 — WHY CHOOSE LENUX?
          ========================================== */}
      <section className="py-28 bg-[#060606] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Our Competitive Advantage</span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide">
                Why Choose <span className="text-lenux-emerald">Lenux Production?</span>
              </h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Complete Solutions", desc: "From graphic design to printing, manufacturing, and on-site final installation managed in one place.", icon: ShieldCheck },
              { title: "Experienced Team", desc: "Backed by highly skilled designers, printing masters, and modern visual technology.", icon: Award },
              { title: "High Quality Work", desc: "Uncompromising standards in materials, color accuracy, and finishing.", icon: ThumbsUp },
              { title: "Fair & Transparent Pricing", desc: "Top-tier advertising and production services at competitive, fair prices.", icon: DollarSign },
              { title: "Fast & Prompt Delivery", desc: "We respect your business deadlines with efficient turnaround times.", icon: Zap },
              { title: "Trustworthy Partner", desc: "Honest, reliable service that builds lasting business relationships.", icon: Clock4 }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={i}>
                  <div className="p-8 rounded-3xl bg-[#0d0d0d] border border-white/5 hover:border-lenux-emerald/40 transition-all duration-500 group shadow-lg">
                    <div className="w-12 h-12 rounded-2xl bg-lenux-emerald/10 border border-lenux-emerald/30 flex items-center justify-center text-lenux-emerald mb-6 group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          🌟 SECTION 07 — FEATURED PORTFOLIO (Dynamic Works)
          ========================================== */}
      <section className="py-28 bg-black border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Our Original Works</span>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide">
                  Recent <span className="text-lenux-emerald">Projects</span>
                </h3>
                <p className="text-gray-400 text-sm">A selection of creative projects produced by Lenux Production.</p>
              </div>
              <Link href="/portfolio" className="px-6 py-3 border border-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:border-lenux-emerald hover:bg-lenux-emerald/10 transition-all w-fit">
                View Full Portfolio →
              </Link>
            </div>
          </ScrollReveal>

          {/* Grid of 6 Featured Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((proj: any) => (
              <ScrollReveal key={proj._id}>
                <div className="group rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/5 hover:border-lenux-emerald/40 transition-all duration-500 shadow-xl flex flex-col justify-between">
                  <div className="relative w-full h-64 overflow-hidden bg-gray-900">
                    <Image src={proj.coverImage.url} alt={proj.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  </div>
                  <div className="p-6 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-lenux-emerald bg-lenux-emerald/10 px-2.5 py-1 rounded-md">
                      {proj.service?.title || "Production Project"}
                    </span>
                    <h4 className="text-lg font-bold text-white group-hover:text-lenux-emerald transition-colors">{proj.title}</h4>
                    {proj.clientName && <p className="text-xs text-gray-400">Client: {proj.clientName}</p>}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          🌟 SECTION 08 — MEET OUR TEAM (Dynamic Staff)
          ========================================== */}
      <section className="py-28 bg-[#050505] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Creative Minds</span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide">
                Meet Our <span className="text-lenux-emerald">Team</span>
              </h3>
              <p className="text-gray-400 text-sm font-light">
                The dedicated professionals behind every successful production at Lenux.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredStaff.map((member: any) => (
              <ScrollReveal key={member._id}>
                <div className="rounded-3xl bg-[#0d0d0d] border border-white/5 overflow-hidden p-6 text-center space-y-4 group hover:border-lenux-emerald/40 transition-all duration-500 shadow-xl">
                  <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-lenux-emerald/30 group-hover:border-lenux-emerald transition-colors">
                    <Image src={member.photo.url} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{member.name}</h4>
                    <p className="text-xs text-lenux-emerald font-semibold uppercase tracking-wider mt-1">{member.position}</p>
                  </div>
                  
                  {/* Social Icons */}
                  <div className="flex justify-center gap-3 text-gray-400 pt-2">
                    {member.socialLinks?.facebook && <a href={member.socialLinks.facebook} target="_blank" className="hover:text-blue-500 transition-colors"><FacebookIcon /></a>}
                    {member.socialLinks?.instagram && <a href={member.socialLinks.instagram} target="_blank" className="hover:text-pink-500 transition-colors"><InstagramIcon /></a>}
                    {member.socialLinks?.linkedin && <a href={member.socialLinks.linkedin} target="_blank" className="hover:text-blue-600 transition-colors"><LinkedinIcon /></a>}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          🌟 SECTION 09 — CLIENT CTA BANNER
          ========================================== */}
      <section className="py-24 bg-gradient-to-r from-[#06241a] via-[#081f17] to-[#040e0a] border-t border-lenux-emerald/30 relative overflow-hidden text-center">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-lenux-emerald/20 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 space-y-8 relative z-10">
          <ScrollReveal>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Have an Idea? <br /><span className="text-lenux-emerald">Let’s Bring It to Life.</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
              From creative graphic design and printing to complete business branding and on-site production, we are ready to elevate your visual identity.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/contact" className="px-8 py-4 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark shadow-xl shadow-lenux-emerald/30 transition-all duration-300">
                Get a Free Quote
              </Link>
              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="px-8 py-4 border border-emerald-400/40 text-emerald-400 bg-emerald-950/40 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-emerald hover:text-white transition-all duration-300 inline-flex items-center gap-2">
                <MessageCircle size={16} /> WhatsApp Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          🌟 SECTION 10 — CONTACT PREVIEW & MAP
          ========================================== */}
      <section className="py-28 bg-black border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 space-y-8">
            <ScrollReveal>
              <div className="space-y-3">
                <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Connect With Us</span>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
                  Visit Our <span className="text-lenux-emerald">Studio</span>
                </h3>
              </div>

              <div className="space-y-6 text-sm text-gray-300 font-light">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-lenux-emerald/10 border border-lenux-emerald/30 flex items-center justify-center text-lenux-emerald shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Call Us Directly</h5>
                    <p className="text-gray-400 mt-0.5">{phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-lenux-emerald/10 border border-lenux-emerald/30 flex items-center justify-center text-lenux-emerald shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Email Address</h5>
                    <p className="text-gray-400 mt-0.5">{email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-lenux-emerald/10 border border-lenux-emerald/30 flex items-center justify-center text-lenux-emerald shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Production Facility</h5>
                    <p className="text-gray-400 mt-0.5">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-lenux-emerald/10 border border-lenux-emerald/30 flex items-center justify-center text-lenux-emerald shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Business Hours</h5>
                    <p className="text-gray-400 mt-0.5">{hours}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Google Maps Embed Preview */}
          <div className="lg:col-span-7 h-[420px] rounded-3xl overflow-hidden border border-white/10 bg-[#0c0c0c] relative shadow-2xl">
            {mapUrl ? (
              <iframe 
                src={mapUrl} 
                className="w-full h-full border-0 grayscale invert contrast-125 opacity-80" 
                allowFullScreen={false} 
                loading="lazy" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                <MapPin size={32} className="text-lenux-emerald animate-bounce" />
                <span className="text-xs uppercase tracking-wider font-semibold">Location Map Available</span>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ==========================================
          🌟 SECTION 11 — MAIN FOOTER
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
              <li><Link href="/" className="hover:text-lenux-emerald transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-lenux-emerald transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-lenux-emerald transition-colors">All Services</Link></li>
              <li><Link href="/portfolio" className="hover:text-lenux-emerald transition-colors">Portfolio</Link></li>
              <li><Link href="/contact" className="hover:text-lenux-emerald transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-white font-bold text-xs uppercase tracking-widest">Top Services</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/services" className="hover:text-lenux-emerald transition-colors">Digital Printing</Link></li>
              <li><Link href="/services" className="hover:text-lenux-emerald transition-colors">Offset Printing</Link></li>
              <li><Link href="/services" className="hover:text-lenux-emerald transition-colors">Vehicle Branding</Link></li>
              <li><Link href="/services" className="hover:text-lenux-emerald transition-colors">Board & Signage</Link></li>
              <li><Link href="/services" className="hover:text-lenux-emerald transition-colors">Event Services</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-white font-bold text-xs uppercase tracking-widest">Get In Touch</h5>
            <p className="text-xs leading-relaxed">{phone}</p>
            <p className="text-xs leading-relaxed">{email}</p>
            <div className="flex gap-3 pt-2">
              <a href={settings?.facebook || "#"} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-lenux-emerald hover:text-white transition-all"><FacebookIcon /></a>
              <a href={settings?.instagram || "#"} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-lenux-emerald hover:text-white transition-all"><InstagramIcon /></a>
              <a href={settings?.linkedin || "#"} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-lenux-emerald hover:text-white transition-all"><LinkedinIcon /></a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Lenux Production. All Rights Reserved.</p>
          <p className="text-[11px]">Crafted with Premium Brand Precision.</p>
        </div>
      </footer>

      {/* Floating Scroll to Top */}
      <ScrollToTop />

    </div>
  );
}