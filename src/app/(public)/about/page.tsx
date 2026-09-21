import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer"; // 🌟 අපේ අලුත් Reusable Footer එක

import { 
  Target, Eye, Compass, Lightbulb, Layers, Send, 
  CheckCircle2, MessageCircle, Users, ArrowRight, Sparkles 
} from "lucide-react";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
  title: "About Our Company | Advertising & Branding Sri Lanka",
  description: "Learn more about Lenux Production, a premier creative advertising and branding company in Sri Lanka. Specialists in sign boards, light boards, and full-scale print production.",
  keywords: "advertising agency sri lanka, sign boards colombo, branding company sri lanka, lenux production",
  openGraph: {
    title: "About Lenux Production | Creative Advertising & Branding Sri Lanka",
    description: "Learn more about Lenux Production, a premier creative advertising and branding company in Sri Lanka. Specialists in sign boards, light boards, and full-scale print production.",
    url: `${SITE_URL}/about`,
    siteName: "Lenux Production",
    images: [
      {
        url: `${SITE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: "Lenux Production - About Us",
      }
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Lenux Production | Creative Advertising & Branding Sri Lanka",
    description: "Learn more about Lenux Production, a premier creative advertising and branding company in Sri Lanka.",
    images: [`${SITE_URL}/images/logo.png`],
  },
};
async function getAboutData() {
  await connectDB();
  const settings = await ContactInformation.findOne().lean();
  return settings ? JSON.parse(JSON.stringify(settings)) : null;
}

export default async function AboutPage() {
  const settings = await getAboutData();

  const phone = settings?.phone;
  const hours = settings?.businessHours;
  const companyName = settings?.companyName;
  const whatsapp = settings?.whatsapp;
  const logoUrl = settings?.logo?.url;

  const visionText = settings?.vision ;
  const missionText = settings?.mission ;
  const visionImg = settings?.visionImage?.url;
  const missionImg = settings?.missionImage?.url;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* Header */}
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* ==========================================
          ABOUT HERO BANNER
          ========================================== */}
      <section className="relative w-full pt-40 pb-24 bg-gradient-to-b from-[#091712] via-black to-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image src="/images/hero-bg.png" alt="About Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lenux-emerald/30 bg-lenux-emerald/10 text-lenux-emerald text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> Design • Print • Production
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight">
              About <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 bg-clip-text text-transparent">Lenux Production</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Creative ideas. Professional execution. Powerful visual results that elevate brands across Sri Lanka.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          WHO WE ARE & COMPANY PROFILE
          ========================================== */}
      <section className="py-16 md:py-28 bg-[#040404] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <ScrollReveal>
              <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Company Profile</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Your Complete <span className="text-lenux-emerald">Visual Advertising Partner</span>
              </h2>
              <div className="space-y-4 text-gray-300 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  <strong className="text-white font-semibold">Lenux Production (Pvt) Ltd</strong> is a professionally managed company specializing in Branding, Advertising, Signage, Printing, and Visual Communication Solutions across Sri Lanka. We are committed to delivering innovative, high-quality, and reliable branding solutions that help businesses strengthen their identity and create a lasting impression.
                </p>
                <p>
                  With over 9 years of industry experience, our journey began with a passion for creativity, quality craftsmanship, and customer satisfaction. Before officially registering our business, we spent several years providing branding and advertising solutions, gaining valuable hands-on experience and building strong client relationships.
                </p>
                <p>
                  On 1st February 2020, we officially registered as an Individual Business, marking the beginning of our professional business journey. As our business continued to grow, we proudly achieved another milestone by incorporating as <strong className="text-white font-semibold">Lenux Production (Pvt) Ltd</strong> on 13th June 2026—reflecting our commitment to long-term growth, corporate excellence, and delivering greater value to our customers.
                </p>
                <p>
                  Today, we provide complete branding and advertising solutions, including Indoor & Outdoor Signage, ACP Cladding, LED Signboards, Large Format Digital Printing, Vehicle Branding, Wall Graphics, Glass Branding, Office Branding, Exhibition Displays, Promotional Items, Corporate Branding, and Custom Fabrication. Our experienced team combines modern technology, premium materials, and skilled craftsmanship to deliver durable, creative, and high-quality solutions tailored to each client&apos;s needs.
                </p>
                <p className="text-gray-400 italic text-sm">
                  &ldquo;At Lenux Production (Pvt) Ltd, we believe every brand deserves to stand out. By combining innovation, professionalism, and attention to detail, we strive to build long-term partnerships while helping businesses strengthen their brand presence and achieve lasting success.&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-bold text-gray-200">
                <div className="flex items-center gap-2 bg-[#0c0c0c] p-3 rounded-xl border border-white/5">
                  <CheckCircle2 size={16} className="text-lenux-emerald" /> 100% Original Works
                </div>
                <div className="flex items-center gap-2 bg-[#0c0c0c] p-3 rounded-xl border border-white/5">
                  <CheckCircle2 size={16} className="text-lenux-emerald" /> Modern Technology
                </div>
                <div className="flex items-center gap-2 bg-[#0c0c0c] p-3 rounded-xl border border-white/5">
                  <CheckCircle2 size={16} className="text-lenux-emerald" /> Skilled Master Team
                </div>
                <div className="flex items-center gap-2 bg-[#0c0c0c] p-3 rounded-xl border border-white/5">
                  <CheckCircle2 size={16} className="text-lenux-emerald" /> Fair & Reliable Service
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-6 w-full">
            <ScrollReveal>
              <div className="relative w-full h-64 sm:h-[450px] rounded-3xl overflow-hidden border border-white/10 bg-[#080808] shadow-2xl flex items-center justify-center p-8 group">
                {logoUrl ? (
                  <div className="relative w-full h-full max-w-[340px] max-h-[340px]">
                    <Image 
                      src={logoUrl} 
                      alt={companyName} 
                      fill 
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-700" 
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image 
                      src="/images/hero-bg.png" 
                      alt="Production Facility" 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* ==========================================
          OUR 4-STEP PRODUCTION APPROACH
          ========================================== */}
      <section className="py-16 md:py-28 bg-black border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">How We Work</span>
              <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-wide uppercase">
                Our 4-Step <span className="text-lenux-emerald">Approach</span>
              </h3>
              <p className="text-gray-400 text-sm md:text-base font-light">
                A seamless process engineered for flawless production from start to finish.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Understand", desc: "We listen and carefully analyze your brand vision, target audience, and project specifications.", icon: Compass },
              { step: "02", title: "Create", desc: "Our creative designers craft innovative 2D/3D concepts and tailored artwork.", icon: Lightbulb },
              { step: "03", title: "Produce", desc: "Using cutting-edge machinery, premium materials, and UV finishes, we build the final visual.", icon: Layers },
              { step: "04", title: "Deliver & Setup", desc: "On-time delivery and professional on-site installation managed seamlessly.", icon: Send }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={i}>
                  <div className="p-8 rounded-3xl bg-[#090909] border border-white/5 hover:border-lenux-emerald/50 transition-all duration-500 group relative shadow-xl flex flex-col justify-between h-full">
                    <span className="text-5xl font-black text-white/5 group-hover:text-lenux-emerald/20 transition-colors select-none absolute top-4 right-6">
                      {item.step}
                    </span>
                    <div className="space-y-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-lenux-emerald/10 border border-lenux-emerald/30 flex items-center justify-center text-lenux-emerald group-hover:scale-110 transition-transform">
                        <Icon size={24} />
                      </div>
                      <h4 className="text-xl font-bold text-white tracking-wide">{item.title}</h4>
                      <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          VISION & MISSION SECTION
          ========================================== */}
      <section className="py-16 md:py-28 bg-[#050505] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          <ScrollReveal>
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Purpose & Direction</span>
              <h3 className="text-3xl sm:text-5xl font-extrabold text-white uppercase">
                Vision & <span className="text-lenux-emerald">Mission</span>
              </h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Vision */}
            <div className="rounded-[2.5rem] bg-gradient-to-b from-[#0d1c15] via-[#08120d] to-[#040806] border border-emerald-900/60 shadow-2xl p-8 sm:p-10 flex flex-col justify-between min-h-[400px] lg:h-[520px] h-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-[#0d221a] border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Eye size={22} />
                  </div>
                  <span className="px-4 py-1 rounded-full bg-[#091a13] border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">Vision</span>
                </div>
                <h4 className="text-2xl font-bold text-white">Our Vision</h4>
                <p className="text-gray-300 text-sm sm:text-base font-light italic leading-relaxed">&quot;{visionText}&quot;</p>
              </div>
              <div className="relative w-full h-44 rounded-2xl overflow-hidden mt-6">
                <Image src={visionImg} alt="Vision" fill className="object-cover" />
              </div>
            </div>

            {/* Mission */}
            <div className="rounded-[2.5rem] bg-gradient-to-b from-[#0d1c15] via-[#08120d] to-[#040806] border border-emerald-900/60 shadow-2xl p-8 sm:p-10 flex flex-col justify-between min-h-[400px] lg:h-[520px] h-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-[#0d221a] border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Target size={22} />
                  </div>
                  <span className="px-4 py-1 rounded-full bg-[#091a13] border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">Mission</span>
                </div>
                <h4 className="text-2xl font-bold text-white">Our Mission</h4>
                <p className="text-gray-300 text-sm sm:text-base font-light italic leading-relaxed">&quot;{missionText}&quot;</p>
              </div>
              <div className="relative w-full h-44 rounded-2xl overflow-hidden mt-6">
                <Image src={missionImg} alt="Mission" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5 CORE VALUES
          ========================================== */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-black border-t border-white/5">
        <div className="absolute inset-0 z-0">
          {/* Mobile background */}
          <Image
            src="/images/values-man-mobile-bg.png"
            alt="Core Values Background"
            fill
            className="object-cover object-center block md:hidden"
          />
          {/* Desktop background */}
          <Image
            src="/images/values-man-bg.jpeg"
            alt="Core Values Background"
            fill
            className="object-cover object-center hidden md:block"
          />
          <div className="absolute inset-0 bg-black/60 md:bg-gradient-to-r md:from-black/10 md:to-black/90 z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-20 w-full">
          <div className="hidden lg:block lg:col-span-5 h-[500px]" />

          <div className="lg:col-span-7 space-y-8 my-auto">
            <ScrollReveal>
              <div className="space-y-2">
                <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Our Foundation</span>
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-wide text-white">
                  Lenux Production —{" "}
                  <span className="text-lenux-emerald">5 Core Values</span>
                </h3>
              </div>

              <div className="relative pl-8 space-y-8 py-2 mt-6">
                <div className="absolute left-0 top-1 bottom-1 w-[4px] bg-gradient-to-b from-lenux-emerald via-lenux-emerald/80 to-lenux-emerald/10 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.7)]" />

                {[
                  {
                    id: "1",
                    title: "Trustworthiness",
                    desc: "We deliver every project with honesty and integrity.",
                  },
                  {
                    id: "2",
                    title: "Quality",
                    desc: "Excellence in design, printing, and production.",
                  },
                  {
                    id: "3",
                    title: "Creativity",
                    desc: "Innovative ideas that make your brand stand out.",
                  },
                  {
                    id: "4",
                    title: "Customer Focus",
                    desc: "Putting clients and their customers first.",
                  },
                  {
                    id: "5",
                    title: "Efficiency",
                    desc: "Timely delivery and smooth processes for every project.",
                  },
                ].map((val) => (
                  <div key={val.id} className="space-y-1 relative group">
                    <h4 className="text-lg font-bold text-gray-100 tracking-wide group-hover:text-lenux-emerald transition-colors duration-300">
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
          🌟 REDIRECT TO TEAM PAGE BANNER (အစား Team Grid)
          ========================================== */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#06241a] via-[#081f17] to-[#040e0a] border-t border-lenux-emerald/30 relative text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <ScrollReveal>
            <div className="w-16 h-16 rounded-2xl bg-lenux-emerald/20 border border-lenux-emerald/40 flex items-center justify-center text-lenux-emerald mx-auto mb-2">
              <Users size={32} />
            </div>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white">
              Meet the Experts Behind <span className="text-lenux-emerald">Lenux</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
              Explore our talented team of designers, technicians, and production specialists dedicated to your brand.
            </p>
            <div className="pt-4">
              <Link href="/team" className="inline-flex items-center gap-2 px-8 py-4 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark shadow-xl transition-all">
                View Full Team Directory <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          CTA BANNER
          ========================================== */}
      <section className="py-16 md:py-20 bg-black border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <ScrollReveal>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Start Your <span className="text-lenux-emerald">Next Project?</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link href="/contact" className="w-full sm:w-auto px-8 py-3.5 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark shadow-lg transition-all">
                Get a Quote
              </Link>
              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '94')}?text=Hi%20Lenux%20Production%2C%20I%20need%20a%20quotation%20for...`} target="_blank" className="w-full sm:w-auto px-8 py-3.5 border border-emerald-400/40 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-emerald hover:text-white transition-all inline-flex justify-center items-center gap-2">
                <MessageCircle size={16} /> WhatsApp Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 🌟 Reusable Footer Component */}
      <Footer />

    </div>
  );
}