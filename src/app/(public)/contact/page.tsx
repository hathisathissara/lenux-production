import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";
import { Service } from "@/models/Service";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollToTop from "@/components/ScrollToTop";
import ContactQuoteForm from "@/components/ContactQuoteForm"; // 🌟 Quotation Form

import { 
  Phone, Mail, MapPin, Clock, MessageCircle, Sparkles 
} from "lucide-react";

// Inline Build-Safe SVGs
const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
);
const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);
const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);

export const dynamic = "force-dynamic";

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
      <section className="relative w-full pt-40 pb-20 bg-gradient-to-b from-[#091712] via-black to-black border-b border-white/5 overflow-hidden">
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
              We are ready to bring your branding and production ideas to life. Connect with our team today.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          🌟 CONTACT INFO & QUOTE FORM CONTAINER
          ========================================== */}
      <section className="py-24 bg-[#040404] relative">
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
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
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
          🌟 FULL-WIDTH GOOGLE MAP PREVIEW
          ========================================== */}
      <section className="relative w-full h-[450px] bg-[#0c0c0c] border-t border-white/5 overflow-hidden">
        {mapUrl ? (
          <iframe
            src={mapUrl}
            className="w-full h-full border-0 grayscale invert contrast-125 opacity-80"
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