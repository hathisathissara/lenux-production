import Image from "next/image";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";
import { Service } from "@/models/Service";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import ContactQuoteForm from "@/components/ContactQuoteForm"; // Quotation Form
import FeedbackForm from "@/components/FeedbackForm"; // 🌟 Feedback Review Form

import { 
  Phone, Mail, MapPin, Clock, MessageCircle, Sparkles 
} from "lucide-react";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lenux-production.vercel.app";

export const metadata = {
  title: "Get a Free Quote | Contact Lenux Production Colombo",
  description: "Contact Sri Lanka's leading branding and printing experts today. Request a free quote for signboards, embossed letters, logo boards, and digital print jobs.",
  keywords: "get a quote printing colombo, lenux contact number, banner printing price sri lanka",
  openGraph: {
    title: "Contact Us | Lenux Production - Get a Free Quote",
    description: "Contact Sri Lanka's leading branding and printing experts today. Request a free quote for signboards, embossed letters, logo boards, and digital print jobs.",
    url: `${SITE_URL}/contact`,
    siteName: "Lenux Production",
    images: [
      {
        url: `${SITE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: "Lenux Production - Contact Us",
      }
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Lenux Production - Get a Free Quote",
    description: "Contact Sri Lanka's leading branding and printing experts. Request a free quote for signboards, embossed letters, and digital print jobs.",
    images: [`${SITE_URL}/images/logo.png`],
  },
};
async function getContactData() {
  await connectDB();

  const [settingsDoc, servicesDoc] = await Promise.all([
    ContactInformation.findOne().lean(),
    Service.find({ isActive: true }).select("title").sort({ sortOrder: 1 }).lean(),
  ]);

  const settings = settingsDoc ? JSON.parse(JSON.stringify(settingsDoc)) : null;
  const services = servicesDoc ? JSON.parse(JSON.stringify(servicesDoc)) : [];

  return { settings, services };
}

export default async function ContactPage() {
  const { settings, services } = await getContactData();

  const phone = settings?.phone || "+94 77 123 4567";
  const secondaryPhone = settings?.secondaryPhone || "+94 11 123 4567";
  const hours = settings?.businessHours || "Monday - Saturday: 8:30 AM - 5:30 PM";
  const companyName = settings?.companyName || "LENUX PRODUCTION (PVT) LTD";
  const email = settings?.email || "info@lenux.lk";
  const address = settings?.address || "Colombo, Sri Lanka";
  const whatsapp = settings?.whatsapp || "+94 77 123 4567";
  const mapUrl = settings?.googleMapUrl || "";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* 🌟 1. Header */}
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* ==========================================
          CONTACT HERO BANNER
          ========================================== */}
      <section className="relative w-full pt-32 md:pt-40 pb-16 md:pb-20 bg-gradient-to-b from-[#091712] via-black to-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image src="/images/hero-bg.jpg" alt="Contact Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lenux-emerald/30 bg-lenux-emerald/10 text-lenux-emerald text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> Get In Touch
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight">
              Contact & <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 bg-clip-text text-transparent">Quotation</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              We are ready to bring your branding and production ideas to life. Connect with our team or share your feedback below.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          🌟 CONTACT INFO & QUOTE FORM CONTAINER
          ========================================== */}
      <section className="py-16 md:py-24 bg-[#040404] relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <ScrollReveal>
              
              <div className="space-y-3">
                <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Reach Our Studio</span>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  Let’s Talk About Your <span className="text-lenux-emerald">Next Project</span>
                </h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  Whether you need custom vehicle branding, illuminated light boards, corporate gifts or quick digital prints, our specialists are here to help.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4 pt-2">
                
                <div className="p-5 rounded-2xl bg-[#090909] border border-white/5 flex items-start gap-4 hover:border-lenux-emerald/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-lenux-emerald/10 border border-lenux-emerald/30 flex items-center justify-center text-lenux-emerald shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Direct Phone Numbers</h5>
                    <p className="text-xs text-gray-400 mt-1">{phone}</p>
                    {secondaryPhone && <p className="text-xs text-gray-400">{secondaryPhone}</p>}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#090909] border border-white/5 flex items-start gap-4 hover:border-lenux-emerald/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-lenux-emerald/10 border border-lenux-emerald/30 flex items-center justify-center text-lenux-emerald shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Official Email</h5>
                    <p className="text-xs text-gray-400 mt-1">{email}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#090909] border border-white/5 flex items-start gap-4 hover:border-lenux-emerald/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-lenux-emerald/10 border border-lenux-emerald/30 flex items-center justify-center text-lenux-emerald shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Production Facility & Address</h5>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{address}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#090909] border border-white/5 flex items-start gap-4 hover:border-lenux-emerald/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-lenux-emerald/10 border border-lenux-emerald/30 flex items-center justify-center text-lenux-emerald shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Studio Business Hours</h5>
                    <p className="text-xs text-gray-400 mt-1">{hours}</p>
                  </div>
                </div>

              </div>

              {/* Direct WhatsApp Quick Chat */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '94')}?text=Hi%20Lenux%20Production%2C%20I%20need%20a%20quotation%20for...`}
                  target="_blank"
                  className="w-full py-4 border border-emerald-500/40 text-emerald-400 bg-emerald-950/30 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-lenux-emerald hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle size={18} /> Chat Directly on WhatsApp
                </a>
              </div>

            </ScrollReveal>
          </div>

          {/* Right Column: Quotation Request Form (7 Cols) */}
          <div className="lg:col-span-7">
            <ScrollReveal>
              <ContactQuoteForm services={services} />
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* ==========================================
          🌟 FEEDBACK SUBMISSION SECTION (Contact Page එක යටින් එකතු කර ඇත)
          ========================================== */}
      <section className="py-16 md:py-24 bg-[#070707] border-t border-white/5 relative">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <FeedbackForm />
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          🌟 FULL-WIDTH FULL-COLOR GOOGLE MAP (ග්‍රේස්කෙල් ඉවත් කර සම්පූර්ණ වර්ණවත් කර ඇත)
          ========================================== */}
      <section className="relative w-full h-[450px] bg-[#0c0c0c] border-t border-white/5 overflow-hidden">
        {mapUrl ? (
          <iframe
            src={mapUrl}
            className="w-full h-full border-0" // 🌟 පරණ grayscale / invert ඉවත් කර සම්පූර්ණ වර්ණවත් Map එක ලබා දී ඇත
            allowFullScreen={false}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
            <MapPin size={36} className="text-lenux-emerald animate-bounce" />
            <span className="text-xs uppercase tracking-widest font-semibold">Location Map Available</span>
          </div>
        )}
      </section>

      <Footer />

    </div>
  );
}