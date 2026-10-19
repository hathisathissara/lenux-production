import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";

import "@/models/ContactInformation";
import "@/models/ServiceCategory";
import "@/models/Service";
import "@/models/Portfolio";
import "@/models/Feedback";
import "@/models/Gallery";
import "@/models/ClientLogo";

import { ContactInformation } from "@/models/ContactInformation";
import { ServiceCategory } from "@/models/ServiceCategory";
import { Portfolio } from "@/models/Portfolio";
import { Feedback } from "@/models/Feedback";
import { Gallery } from "@/models/Gallery";
import { ClientLogo } from "@/models/ClientLogo";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import TestimonialsSection from "@/components/TestimonialsSection";
import HomeFeaturedGallery from "@/components/HomeFeaturedGallery";
import TrustedBySection from "@/components/TrustedBySection";

import {
  ArrowRight, ShieldCheck, Award, Zap,
  DollarSign, Clock4, ThumbsUp,
  Sparkles, MessageCircle,
  Briefcase, Play
} from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings = await ContactInformation.findOne().lean() as any;

  const companyTitle = settings?.companyName || "Lenux Production";
  const rawLogo = settings?.logo?.url || "/images/logo.png";
  const logoUrl = rawLogo.startsWith("http") ? rawLogo : `${SITE_URL}${rawLogo.startsWith("/") ? "" : "/"}${rawLogo}`;

  const siteDescription = "Lenux Production is Sri Lanka's leading creative advertising and branding partner, providing high-quality digital printing, signboards, displays, and event solutions.";

  return {
    alternates: {
      canonical: '/',
    },
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

  const [settingsDoc, categoriesDoc, projectsDoc, feedbackDoc, featuredGalleryDoc, clientLogosDoc] = await Promise.all([
    ContactInformation.findOne().lean(),
    ServiceCategory.find({ isActive: true }).sort({ sortOrder: 1 }).limit(8).lean(),
    Portfolio.find({ isFeatured: true, isPublished: true }).populate('service', 'title').limit(6).lean(),
    Feedback.find({ isApproved: true }).sort({ createdAt: -1 }).lean(),
    Gallery.find({ isFeaturedOnHome: true }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
    ClientLogo.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean(),
  ]);

  return {
    settings: settingsDoc ? JSON.parse(JSON.stringify(settingsDoc)) : null,
    categories: categoriesDoc ? JSON.parse(JSON.stringify(categoriesDoc)) : [],
    featuredProjects: projectsDoc ? JSON.parse(JSON.stringify(projectsDoc)) : [],
    feedbacks: feedbackDoc ? JSON.parse(JSON.stringify(feedbackDoc)) : [],
    featuredGallery: featuredGalleryDoc ? JSON.parse(JSON.stringify(featuredGalleryDoc)) : [],
    clientLogos: clientLogosDoc ? JSON.parse(JSON.stringify(clientLogosDoc)) : [],
  };
}

export default async function HomePage() {
  const { settings, categories, featuredProjects, feedbacks, featuredGallery, clientLogos } = await getHomeData();

  const phone = settings?.phone;
  const whatsapp = settings?.whatsapp;
  const hours = settings?.businessHours;
  const companyName = settings?.companyName;
  const logoImg = settings?.logo?.url || "/images/logo.png";
  const yearsExperience = Math.max(1, new Date().getFullYear() - 2017);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">

      {/* Header */}
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* ==========================================
          SECTION 01 — HERO SECTION (Premium Conversion-Focused)
          ========================================== */}
        <section className="relative w-full min-h-screen flex items-end justify-start overflow-hidden pt-24 sm:pt-28 pb-12 sm:pb-16 md:pb-20">
        <div className="absolute inset-0 z-0">
          {/* Mobile Background Image (< md) */}
          <div className="block md:hidden absolute inset-0">
            <Image
              src="/images/hero-bg-mobile.png"
              alt="Lenux Production Hero Mobile"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Desktop Background Image (>= md) */}
          <div className="hidden md:block absolute inset-0">
            <Image
              src="/images/hero-bg.png"
              alt="Lenux Production Hero"
              fill
              className="object-cover object-center md:object-right"
              priority
            />
          </div>

          {/* 🌟 Background Visibility & Contrast Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/90 md:bg-gradient-to-r md:from-black/50 md:via-black/10 md:to-transparent z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-6 w-full">
          <ScrollReveal>
            <div className="max-w-4xl lg:max-w-5xl space-y-4 sm:space-y-5">
              {/* Category Tagline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] xl:text-[3.8rem] font-extrabold text-white tracking-tight leading-[1.1] uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                We Make Brands{" "}
                <span className="text-shimmer block mt-1">
                  Impossible To Ignore.
                </span>
              </h1>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-5 pt-2 sm:pt-4">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-lenux-emerald text-black font-extrabold rounded-full text-xs uppercase tracking-wider hover:bg-emerald-400 shadow-lg shadow-lenux-emerald/30 transition-all duration-300"
                >
                  Our Services <ArrowRight size={15} />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2.5 sm:gap-3 text-white hover:text-lenux-emerald transition-colors text-xs font-bold uppercase tracking-wider group py-1.5"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/40 flex items-center justify-center group-hover:border-lenux-emerald group-hover:scale-105 transition-all shrink-0">
                    <Play size={11} className="fill-white text-white translate-x-0.5 group-hover:fill-lenux-emerald group-hover:text-lenux-emerald transition-colors" />
                  </div>
                  <span>Explore Our Work</span>
                </Link>
              </div>

              {/* Quick Stats in Hero (Responsive 3-Column Grid) */}
              <div className="pt-6 sm:pt-12 grid grid-cols-3 gap-2 sm:gap-6 md:gap-8 max-w-3xl border-t border-white/10 sm:border-t-0 mt-3 sm:mt-0">
                {/* Stat 1 */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3.5 px-2 sm:px-6 border-r border-white/10">
                  <Award className="text-lenux-emerald shrink-0 size-6 sm:size-7 md:size-8" />
                  <div>
                    <h4 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">{yearsExperience}+</h4>
                    <p className="text-[10px] sm:text-xs text-white font-medium leading-tight mt-0.5">Years Of Experience</p>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3.5 pr-2 sm:pr-6 border-r border-white/10">
                  <Briefcase className="text-lenux-emerald shrink-0 size-6 sm:size-7 md:size-8" />
                  <div>
                    <h4 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">150+</h4>
                    <p className="text-[10px] sm:text-xs text-white font-medium leading-tight mt-0.5">Projects Completed</p>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3.5 pl-2 sm:pl-6">
                  <ThumbsUp className="text-lenux-emerald shrink-0 size-6 sm:size-7 md:size-8" />
                  <div>
                    <h4 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">100%</h4>
                    <p className="text-[10px] sm:text-xs text-white font-medium leading-tight mt-0.5">Customer Satisfaction</p>
                  </div>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          SECTION 02 — Trusted by / Client Logos
          ========================================== */}
      <div className="section-seamless">
        <TrustedBySection logos={clientLogos} />
      </div>

      {/* ==========================================
          SECTION 03 — WHO WE ARE
          ========================================== */}
      <section className="py-16 md:py-28 bg-[#070707] section-seamless relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lenux-emerald/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lenux-emerald/30 bg-lenux-emerald/10 text-lenux-emerald text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} /> Who We Are
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Turning Ideas Into <span className="text-lenux-emerald">Powerful Brand Visuals</span>
              </h2>
              <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
                With over {yearsExperience} years of industry experience, <strong className="text-white font-medium">Lenux Production (Pvt) Ltd</strong> is a premier branding, signage, and visual communication specialist in Sri Lanka. From innovative indoor &amp; outdoor signboards to large-format digital printing and corporate branding, we engineer durable, high-impact solutions that make every brand stand out and leave a lasting impression.
              </p>
              <div className="pt-2">
                <Link href="/about" className="inline-flex items-center gap-2 px-8 py-3.5 bg-lenux-emerald text-black font-extrabold rounded-full text-xs uppercase tracking-wider hover:bg-emerald-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-lenux-emerald/25">
                  Discover Lenux Production <ArrowRight size={16} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-6">
            <ScrollReveal>
              <div className="relative h-[400px] md:h-[480px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group bg-[#0a0a0a]">
                <Image
                  src={logoImg}
                  alt="Lenux Production - Company Logo"
                  fill
                  className="object-contain p-10 group-hover:scale-105 transition-transform duration-700"
                  style={{ mixBlendMode: "screen" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Overlay badge */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3">
                    <p className="text-lenux-emerald text-xs font-bold uppercase tracking-widest">Est. 2015</p>
                    <p className="text-white font-semibold text-sm mt-0.5">Moratuwa, Sri Lanka</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 04 — OUR SERVICES
          ========================================== */}
      <section className="py-16 md:py-28 bg-black section-seamless relative">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Our Expertise</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide uppercase">
                What We <span className="text-lenux-emerald">Do</span>
              </h2>
              <p className="text-gray-400 text-sm font-light leading-relaxed max-w-lg mx-auto">
                From concept to completion — we deliver end-to-end creative solutions that make your brand shine.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {categories.map((cat: any) => (
              <ScrollReveal key={cat._id}>
                <div className="bg-[#0c0c0c] rounded-2xl border border-white/5 overflow-hidden hover:border-lenux-emerald/50 hover:shadow-lg hover:shadow-lenux-emerald/10 transition-all duration-500 group flex flex-col justify-between h-full shadow-md">
                  <div>
                    <div className="relative w-full h-44 bg-gray-900 overflow-hidden">
                      {cat.image?.url && <Image src={cat.image.url} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="text-base font-bold text-white group-hover:text-lenux-emerald transition-colors">{cat.name}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{cat.description || "High quality visual production."}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <Link href={`/services`} className="text-xs font-bold text-lenux-emerald hover:text-white flex items-center gap-1.5 transition-colors group/link">
                      Explore Services <ArrowRight size={13} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/services"
              className="px-9 py-3.5 border border-lenux-emerald/60 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-lenux-emerald hover:border-lenux-emerald hover:text-black hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
            >
              View All Services <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 05 — WHY CHOOSE LENUX
          ========================================== */}
      <section className="py-16 md:py-28 bg-[#060606] section-seamless relative overflow-hidden">
        {/* Subtle diagonal grid texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Our Competitive Advantage</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide">
                Why Choose <span className="text-lenux-emerald">Lenux Production?</span>
              </h2>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                We combine creativity, quality, and speed to deliver results that exceed expectations.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Complete Solutions", desc: "Design to final installation managed in one place — stress-free from start to finish.", icon: ShieldCheck },
              { title: "Experienced Team", desc: `Over ${yearsExperience} years backed by skilled professionals and state-of-the-art equipment.`, icon: Award },
              { title: "High Quality Work", desc: "Uncompromising standards in materials, colours, and finishing on every job.", icon: ThumbsUp },
              { title: "Fair Pricing", desc: "Top-tier services at competitive, transparent prices with no hidden costs.", icon: DollarSign },
              { title: "Fast Turnaround", desc: "Prompt and efficient delivery so your business never misses a deadline.", icon: Zap },
              { title: "Trusted Partner", desc: "Honest, reliable, and long-term business relationships built on real results.", icon: Clock4 }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={i}>
                  <div className="p-7 rounded-2xl bg-[#0d0d0d] border border-white/5 hover:border-lenux-emerald/40 hover:bg-[#0f0f0f] hover:shadow-lg hover:shadow-lenux-emerald/8 transition-all duration-500 group">
                    <div className="w-11 h-11 rounded-xl bg-lenux-emerald/10 border border-lenux-emerald/30 flex items-center justify-center text-lenux-emerald mb-5 group-hover:scale-110 group-hover:bg-lenux-emerald/20 transition-all duration-300">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-lenux-emerald transition-colors duration-300">{item.title}</h3>
                    <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          🌟 SECTION 06 — FEATURED PORTFOLIO
          ========================================== */}
      <section className="py-16 md:py-28 bg-black section-seamless relative">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Our Original Works</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide">
                  Recent <span className="text-lenux-emerald">Projects</span>
                </h2>
                <p className="text-gray-400 text-sm max-w-md leading-relaxed">A curated selection of creative projects delivered by Lenux Production.</p>
              </div>
              <Link
                href="/portfolio"
                className="px-6 py-3 border border-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:border-lenux-emerald hover:bg-lenux-emerald/10 hover:text-lenux-emerald transition-all w-fit shrink-0"
              >
                View Full Portfolio <ArrowRight size={13} className="inline ml-1" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {featuredProjects.map((proj: any) => (
              <ScrollReveal key={proj._id}>
                <Link
                  href={`/portfolio/${proj.slug}`}
                  className="group rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 hover:border-lenux-emerald/40 hover:shadow-xl hover:shadow-lenux-emerald/10 transition-all duration-500 flex flex-col justify-between block"
                >
                  <div className="relative w-full h-60 overflow-hidden bg-gray-900">
                    <Image src={proj.coverImage.url} alt={proj.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-lenux-emerald/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-lenux-emerald bg-lenux-emerald/10 px-2.5 py-1 rounded-md inline-block">
                      {proj.service?.title || "Production Project"}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-lenux-emerald transition-colors duration-300">{proj.title}</h3>
                    {proj.clientName && <p className="text-xs text-gray-500">Client: {proj.clientName}</p>}
                    <div className="flex items-center gap-1 text-lenux-emerald text-xs font-semibold pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View Project <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          🌟 SECTION 06B — FEATURED GALLERY SLIDESHOW
          ========================================== */}
      <HomeFeaturedGallery images={featuredGallery} />



      {/* ==========================================
          🌟 TESTIMONIALS SLIDESHOW
          ========================================== */}
      <TestimonialsSection feedbacks={feedbacks} />

      {/* ==========================================
          SECTION 08 — CLIENT CTA BANNER
          ========================================== */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-[#06241a] via-[#081f17] to-[#040e0a] section-seamless relative text-center overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-lenux-emerald/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-12 right-0 w-72 h-72 bg-lenux-emerald/10 rounded-full blur-[120px] pointer-events-none" />
        {/* Top border glow */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-lenux-emerald/50 to-transparent" />

        <div className="max-w-4xl mx-auto px-6 space-y-7 relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lenux-emerald/30 bg-lenux-emerald/10 text-lenux-emerald text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles size={12} /> Ready to Get Started?
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Have an Idea? <br /><span className="text-lenux-emerald">Let&apos;s Bring It to Life.</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
              From graphic design and printing to complete business branding and on-site production — we handle it all.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-3">
              {/* Button 1: Get Your Free Quote */}
              <Link
                href="/contact"
                className="w-full sm:w-auto px-9 py-4 bg-lenux-emerald text-black font-extrabold rounded-full text-xs uppercase tracking-widest hover:bg-emerald-400 hover:scale-105 shadow-xl shadow-lenux-emerald/40 transition-all duration-300"
              >
                Get Your Free Quote
              </Link>

              {/* Button 2: WhatsApp Us */}
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '94')}?text=Hi%20Lenux%20Production%2C%20I%20need%20a%20quotation%20for...`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-9 py-4 border border-emerald-400/50 text-emerald-400 bg-emerald-950/40 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-emerald hover:text-black hover:border-lenux-emerald hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2"
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


