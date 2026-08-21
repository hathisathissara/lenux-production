import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next"; 
import { connectDB } from "@/lib/db";

import "@/models/ContactInformation";
import "@/models/ServiceCategory";
import "@/models/Service";
import "@/models/Portfolio";
import "@/models/Staff";
import "@/models/Feedback";

import { ContactInformation } from "@/models/ContactInformation";
import { ServiceCategory } from "@/models/ServiceCategory";
import { Portfolio } from "@/models/Portfolio";
import { Staff } from "@/models/Staff";
import { Feedback } from "@/models/Feedback";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import StaffCard from "@/components/StaffCard";
import TestimonialsSection from "@/components/TestimonialsSection";

import { 
  Target, Eye, ArrowRight, ShieldCheck, Award, Zap, 
  DollarSign, Clock4, ThumbsUp, Phone, Mail, MapPin, 
  Clock, Sparkles, MessageCircle, Globe, Wrench 
} from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lenux-production.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings = await ContactInformation.findOne().lean() as any;

  const companyTitle = settings?.companyName || "Lenux Production";
  const rawLogo = settings?.logo?.url || "/images/logo.png";
  const logoUrl = rawLogo.startsWith("http") ? rawLogo : `${SITE_URL}${rawLogo.startsWith("/") ? "" : "/"}${rawLogo}`;
  
  const siteDescription = "Lenux Production is Sri Lanka's leading creative advertising and branding partner, providing high-quality digital printing, signboards, displays, and event solutions.";

  return {
    title: `${companyTitle} | Design, Print & Production`,
    description: siteDescription,
    openGraph: {
      title: `${companyTitle} | Design, Print & Production`,
      description: siteDescription,
      url: SITE_URL,
      siteName: companyTitle,
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: `${companyTitle} - Creative Advertising & Production`,
          type: "image/png",
        }
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${companyTitle} | Design, Print & Production`,
      description: siteDescription,
      images: [logoUrl],
    }
  };
}

async function getHomeData() {
  await connectDB();

  const [settingsDoc, categoriesDoc, projectsDoc, staffDoc, feedbackDoc] = await Promise.all([
    ContactInformation.findOne().lean(),
    ServiceCategory.find({ isActive: true }).sort({ sortOrder: 1 }).limit(8).lean(),
    Portfolio.find({ isFeatured: true, isPublished: true }).populate('service', 'title').limit(6).lean(),
    Staff.find({ isFeatured: true, isActive: true }).sort({ sortOrder: 1 }).limit(4).lean(),
    Feedback.find({ isApproved: true }).sort({ createdAt: -1 }).lean(),
  ]);

  return {
    settings: settingsDoc ? JSON.parse(JSON.stringify(settingsDoc)) : null,
    categories: categoriesDoc ? JSON.parse(JSON.stringify(categoriesDoc)) : [],
    featuredProjects: projectsDoc ? JSON.parse(JSON.stringify(projectsDoc)) : [],
    featuredStaff: staffDoc ? JSON.parse(JSON.stringify(staffDoc)) : [],
    feedbacks: feedbackDoc ? JSON.parse(JSON.stringify(feedbackDoc)) : [],
  };
}

export default async function HomePage() {
  const { settings, categories, featuredProjects, featuredStaff, feedbacks } = await getHomeData();

  const phone = settings?.phone || "+94 77 123 4567";
  const secondaryPhone = settings?.secondaryPhone || "+94 11 123 4567";
  const whatsapp = settings?.whatsapp || "+94 77 123 4567";
  const hours = settings?.businessHours || "Monday - Saturday: 8:30 AM - 5:30 PM";
  const email = settings?.email || "info@lenux.lk";
  const address = settings?.address || "Colombo, Sri Lanka";
  const companyName = settings?.companyName || "LENUX PRODUCTION (PVT) LTD";
  const mapUrl = settings?.googleMapUrl || "";

  const visionText = settings?.vision || "To become Sri Lanka's leading creative and advertising agency, delivering innovative, high-quality, and impactful solutions that help businesses stand out and grow.";
  const missionText = settings?.mission || "To provide fair, fast, and reliable advertising and production services that help our clients connect with their customers effectively under one roof.";
  const visionImg = settings?.visionImage?.url || "/images/values-man-bg.jpeg";
  const missionImg = settings?.missionImage?.url || "/images/hero-bg.jpg";
  const logoImg = settings?.logo?.url || "/images/logo.png";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* Header */}
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* ==========================================
          SECTION 01 — HERO SECTION (Optimized Background Visibility)
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
          {/* 🌟 Background Visibility එක වැඩි කර ඇති බව තහවුරු කරගන්න */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 md:bg-gradient-to-r md:from-black/60 md:via-black/30 md:to-transparent z-10" />
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
              
              <p className="text-base sm:text-xl md:text-2xl text-white font-medium tracking-wide drop-shadow-lg leading-relaxed">
                Lenux is the ideal platform to take your business to the public and reach a wider audience.
              </p>

              <p className="text-sm sm:text-base text-gray-200 font-light leading-relaxed drop-shadow-md max-w-xl">
                Lenux Production is a creative advertising and branding company in Sri Lanka. We design, print, and build visual solutions that help businesses grow and get noticed.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <Link href="/services" className="w-full sm:w-auto text-center px-7 py-3 border border-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-emerald hover:shadow-lg hover:shadow-lenux-emerald/30 transition-all duration-300">
                Explore Services
              </Link>
              <Link href="/contact" className="w-full sm:w-auto text-center px-7 py-3 border border-white/30 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:border-lenux-emerald hover:bg-lenux-emerald/10 transition-all duration-300">
                Get a Quote
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          🌟 NEW SECTION — COMPANY HIGHLIGHTS
          ========================================== */}
      <section className="py-16 bg-[#040404] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: "9+ Years", label: "Industry Experience", icon: Award, color: "text-amber-400" },
            { value: "Premium", label: "Quality Production", icon: Sparkles, color: "text-lenux-emerald" },
            { value: "Islandwide", label: "Service & Delivery", icon: Globe, color: "text-blue-400" },
            { value: "End-to-End", label: "Design to Installation", icon: Wrench, color: "text-purple-400" }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={i}>
                <div className="p-6 rounded-2xl bg-[#080808] border border-white/5 hover:border-lenux-emerald/30 transition-all duration-500 flex flex-col justify-center items-center text-center space-y-2 h-full shadow-lg group">
                  <div className={`p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform ${item.color}`}>
                    <Icon size={24} />
                  </div>
                  <h4 className="text-lg sm:text-2xl font-black text-white tracking-wide">{item.value}</h4>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">{item.label}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* ==========================================
          SECTION 02 — VISION & MISSION
          ========================================== */}
      <section className="relative w-full bg-[#050505] text-white py-16 md:py-28 overflow-hidden border-t border-white/5">
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
              <div className="rounded-[2.5rem] bg-gradient-to-b from-[#0d1c15] via-[#08120d] to-[#040806] border border-emerald-900/60 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[400px] lg:h-[580px] h-auto p-8 sm:p-10 relative group hover:border-emerald-500/50 transition-all duration-500">
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-full bg-[#0d221a] border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Eye size={24} />
                    </div>
                    <span className="px-5 py-1.5 rounded-full bg-[#091a13] border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">Vision</span>
                  </div>
                  <h4 className="text-3xl sm:text-4xl font-extrabold text-white pt-2">Our <span className="text-emerald-400">Vision</span></h4>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-500 text-2xl font-serif font-black leading-none shrink-0">“</span>
                    <p className="text-gray-200 text-sm sm:text-base font-normal leading-relaxed italic">{visionText}”</p>
                  </div>
                </div>
                <div className="relative w-[calc(100%+5rem)] sm:w-[calc(100%+5rem)] h-64 -mx-8 sm:-mx-10 -mb-8 sm:-mb-10 overflow-hidden mt-6">
                  <Image src={visionImg} alt="Vision" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#08120d] via-transparent to-transparent h-16" />
                </div>
              </div>
            </ScrollReveal>

            {/* Mission */}
            <ScrollReveal>
              <div className="rounded-[2.5rem] bg-gradient-to-b from-[#0d1c15] via-[#08120d] to-[#040806] border border-emerald-900/60 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[400px] lg:h-[580px] h-auto p-8 sm:p-10 relative group hover:border-emerald-500/50 transition-all duration-500">
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-full bg-[#0d221a] border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Target size={24} />
                    </div>
                    <span className="px-5 py-1.5 rounded-full bg-[#091a13] border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">Mission</span>
                  </div>
                  <h4 className="text-3xl sm:text-4xl font-extrabold text-white pt-2">Our <span className="text-emerald-400">Mission</span></h4>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-500 text-2xl font-serif font-black leading-none shrink-0">“</span>
                    <p className="text-gray-200 text-sm sm:text-base font-normal leading-relaxed italic">{missionText}”</p>
                  </div>
                </div>
                <div className="relative w-[calc(100%+5rem)] sm:w-[calc(100%+5rem)] h-64 -mx-8 sm:-mx-10 -mb-8 sm:-mb-10 overflow-hidden mt-6">
                  <Image src={missionImg} alt="Mission" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#08120d] via-transparent to-transparent h-16" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 03 — 5 CORE VALUES
          ========================================== */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-black flex items-center border-t border-white/5">
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
          SECTION 04 — WHO WE ARE
          ========================================== */}
      <section className="py-16 md:py-28 bg-[#070707] border-t border-white/5 relative overflow-hidden">
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
          SECTION 05 — OUR SERVICES
          ========================================== */}
      <section className="py-16 md:py-28 bg-black border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Our Expertise</span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide uppercase">
                What We <span className="text-lenux-emerald">Do</span>
              </h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {categories.map((cat: any) => (
              <ScrollReveal key={cat._id}>
                <div className="bg-[#0c0c0c] rounded-2xl border border-white/5 overflow-hidden hover:border-lenux-emerald/50 transition-all duration-500 group flex flex-col justify-between h-full shadow-lg">
                  <div>
                    <div className="relative w-full h-44 bg-gray-900 overflow-hidden">
                      {cat.image?.url && <Image src={cat.image.url} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />}
                    </div>
                    <div className="p-6 space-y-2">
                      <h4 className="text-lg font-bold text-white group-hover:text-lenux-emerald transition-colors">{cat.name}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{cat.description || "High quality visual production."}</p>
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
            <Link href="/services" className="px-8 py-3.5 border border-lenux-emerald transition-all duration-300 inline-flex items-center gap-2">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 06 — WHY CHOOSE LENUX
          ========================================== */}
      <section className="py-16 md:py-28 bg-[#060606] border-t border-white/5 relative">
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
              { title: "Complete Solutions", desc: "Design to final installation managed in one place.", icon: ShieldCheck },
              { title: "Experienced Team", desc: "Backed by skilled professionals and modern tech.", icon: Award },
              { title: "High Quality Work", desc: "Uncompromising standards in materials and finishing.", icon: ThumbsUp },
              { title: "Fair Pricing", desc: "Top-tier services at competitive, fair prices.", icon: DollarSign },
              { title: "Fast Delivery", desc: "Prompt and efficient turnaround times.", icon: Zap },
              { title: "Trusted Service", desc: "Honest and reliable business partnership.", icon: Clock4 }
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
          🌟 SECTION 07 — FEATURED PORTFOLIO
          ========================================== */}
      <section className="py-16 md:py-28 bg-black border-t border-white/5 relative">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {featuredProjects.map((proj: any) => (
              <ScrollReveal key={proj._id}>
                <Link 
                  href={`/portfolio/${proj.slug}`} // 🌟 
                  className="group rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/5 hover:border-lenux-emerald/40 transition-all duration-500 shadow-xl flex flex-col justify-between block"
                >
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
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          🌟 SECTION 08 — MEET OUR TEAM
          ========================================== */}
      <section className="py-16 md:py-28 bg-[#050505] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Creative Minds</span>
              <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-wide">
                Meet Our <span className="text-lenux-emerald">Team</span>
              </h3>
              <p className="text-gray-400 text-sm font-light">
                The dedicated professionals behind every successful production at Lenux.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {featuredStaff.map((member: any) => (
              <ScrollReveal key={member._id}>
                <StaffCard member={member} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          🌟 TESTIMONIALS SLIDESHOW (පාරිභෝගික අදහස් ස්ලයිඩ්ෂෝව)
          ========================================== */}
      <TestimonialsSection feedbacks={feedbacks} />

      {/* ==========================================
          SECTION 09 — CLIENT CTA BANNER
          ========================================== */}
      {/* ==========================================
          🌟 HIGH-IMPACT CLIENT CTA BANNER
          ========================================== */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#06241a] via-[#081f17] to-[#040e0a] border-t border-lenux-emerald/30 relative text-center">
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
                className="w-full sm:w-auto px-8 py-4 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark shadow-xl shadow-lenux-emerald/30 transition-all duration-300"
              >
                Get a Free Quote
              </Link>
              
              {/* බටන් 2: WhatsApp Us */}
              <a 
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 border border-emerald-400/40 text-emerald-400 bg-emerald-950/40 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-emerald hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} /> WhatsApp Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          🌟 SECTION 10 — CONTACT PREVIEW & FULL COLOR MAP
          ========================================== */}
      <section className="py-16 md:py-28 bg-black border-t border-white/5 relative">
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
                    <p className="text-gray-400 mt-0.5">{secondaryPhone}</p>
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

          <div className="lg:col-span-7 h-[420px] rounded-3xl overflow-hidden border border-white/10 bg-[#0c0c0c] relative shadow-2xl">
            {mapUrl ? (
              <iframe 
                src={mapUrl} 
                className="w-full h-full border-0" 
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

      <Footer />

    </div>
  );
}


