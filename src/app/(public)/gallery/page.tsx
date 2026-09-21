import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";
import { Gallery } from "@/models/Gallery";
import "@/models/ServiceCategory";
import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import VisualGallery from "@/components/VisualGallery"; 

import { Sparkles, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
  alternates: {
    canonical: "/gallery",
  },
  title: "Photo Gallery | Lenux Production Sri Lanka",
  description: "Browse the official photo gallery of Lenux Production. See our completed signboards, vehicle branding, event setups, and creative branding projects in Sri Lanka.",
  keywords: "lenux production gallery, signboard gallery sri lanka, branding photos colombo",
  openGraph: {
    title: "Gallery | Lenux Production - Visual Portfolio",
    description: "Browse the official photo gallery of Lenux Production. See our completed signboards, vehicle branding, event setups, and creative branding projects in Sri Lanka.",
    url: `${SITE_URL}/gallery`,
    siteName: "Lenux Production",
    images: [
      {
        url: `${SITE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: "Lenux Production - Photo Gallery",
      }
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | Lenux Production - Visual Portfolio",
    description: "Browse the official photo gallery of Lenux Production Sri Lanka.",
    images: [`${SITE_URL}/images/logo.png`],
  },
};

async function getGalleryData() {
  await connectDB();

  const [settingsDoc, galleryDoc] = await Promise.all([
    ContactInformation.findOne().lean(),
    Gallery.find().populate('serviceCategory', 'name').sort({ sortOrder: 1, createdAt: -1 }).lean(),
  ]);

  const settings = settingsDoc ? JSON.parse(JSON.stringify(settingsDoc)) : null;

  const rawGallery = galleryDoc ? JSON.parse(JSON.stringify(galleryDoc)) : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const galleryImages = rawGallery.map((item: any) => {
    const serviceName =
      (typeof item.serviceCategory === "object" && item.serviceCategory?.name)
        ? item.serviceCategory.name
        : (item.category || "Production");

    return {
      _id: item._id,
      title: item.title,
      description: item.description,
      category: item.category,
      service: serviceName,
      url: item.image?.url,
      publicId: item.image?.publicId,
    };
  });

  return { settings, galleryImages };
}

export default async function GalleryPage() {
  const { settings, galleryImages } = await getGalleryData();

  const phone = settings?.phone || "+94 77 123 4567";
  const hours = settings?.businessHours || "Monday - Saturday: 8:30 AM - 5:30 PM";
  const companyName = settings?.companyName || "LENUX PRODUCTION (PVT) LTD";
  const whatsapp = settings?.whatsapp || "+94 77 123 4567";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* 🌟 1. Header */}
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* ==========================================
          GALLERY HERO BANNER
          ========================================== */}
      <section className="relative w-full pt-32 md:pt-40 pb-16 md:pb-20 bg-gradient-to-b from-[#091712] via-black to-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image src="/images/hero-bg.png" alt="Gallery Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lenux-emerald/30 bg-lenux-emerald/10 text-lenux-emerald text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> Visual Showcase
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight">
              Production <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 bg-clip-text text-transparent">Gallery</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Explore a visual journey of our top-tier printing, branding, signboards, and event setups.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          🌟 INTERACTIVE VISUAL GALLERY GRID & LIGHTBOX
          ========================================== */}
      <section className="py-16 md:py-24 bg-[#040404] relative">
        <div className="max-w-7xl mx-auto px-6">
          <VisualGallery galleryImages={galleryImages} />
        </div>
      </section>

      {/* ==========================================
          CTA BANNER
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
            
          
            <div className="flex flex-wrap justify-center gap-4 pt-4">
             
              <Link 
                href="/contact" 
                className="w-full sm:w-auto px-8 py-4 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark shadow-xl shadow-lenux-emerald/30 transition-all duration-300"
              >
                Get a Free Quote
              </Link>
              
              {/* බටන් 2: WhatsApp Us */}
              <a 
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '94')}?text=Hi%20Lenux%20Production%2C%20I%20need%20a%20quotation%20for...`} 
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

     <Footer />

    </div>
  );
}