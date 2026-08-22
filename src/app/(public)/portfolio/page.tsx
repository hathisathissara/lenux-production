import Link from "next/link";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";
import { Portfolio } from "@/models/Portfolio";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import PortfolioGallery from "@/components/PortfolioGallery"; // 🌟 Interactive Gallery Component

import { MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
  title: "Our Recent Work | Signboard & Visual Production Gallery",
  description: "Discover the latest visual production projects by Lenux Production in Sri Lanka. View our completed shop branding, vehicle graphics, and premium signboards.",
  keywords: "vehicle branding sri lanka, completed signboard projects colombo, creative portfolio sri lanka",
  openGraph: {
    title: "Portfolio | Lenux Production - Our Recent Work",
    description: "Discover the latest visual production projects by Lenux Production in Sri Lanka. View our completed shop branding, vehicle graphics, and premium signboards.",
    url: `${SITE_URL}/portfolio`,
    siteName: "Lenux Production",
    images: [
      {
        url: `${SITE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: "Lenux Production - Portfolio",
      }
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Lenux Production - Our Recent Work",
    description: "Discover the latest visual production projects by Lenux Production in Sri Lanka.",
    images: [`${SITE_URL}/images/logo.png`],
  },
};
async function getPortfolioData() {
  await connectDB();

  const [settingsDoc, projectsDoc] = await Promise.all([
    ContactInformation.findOne().lean(),
    Portfolio.find({ isPublished: true })
      .populate("service", "title image")
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

      {/* 🌟 2. PORTFOLIO HERO & GRID (Interactive) */}
      <PortfolioGallery projects={projects} />

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