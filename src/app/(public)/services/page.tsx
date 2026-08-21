import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";
import { ServiceCategory } from "@/models/ServiceCategory";
import { Service } from "@/models/Service";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesFilterSection from "@/components/ServicesFilterSection"; // 🌟 Interactive Client Filter Component

import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Our Services | Printing, Embossed Letters & Light Boards Sri Lanka",
  description: "Explore Lenux Production services: Digital and Offset printing, custom logo boards, shop branding, vehicle branding, and illuminated light boards in Colombo.",
  keywords: "digital printing colombo, offset printing sri lanka, shop branding sri lanka, embossed letters colombo, light boards sri lanka",
};
async function getServicesPageData() {
  await connectDB();

  const [settingsDoc, categoriesDoc, servicesDoc] = await Promise.all([
    ContactInformation.findOne().lean(),
    ServiceCategory.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
    Service.find({ isActive: true }).populate("category", "name slug").sort({ sortOrder: 1 }).lean(),
  ]);

  const settings = settingsDoc ? JSON.parse(JSON.stringify(settingsDoc)) : null;
  const categories = categoriesDoc ? JSON.parse(JSON.stringify(categoriesDoc)) : [];
  const services = servicesDoc ? JSON.parse(JSON.stringify(servicesDoc)) : [];

  return { settings, categories, services };
}

export default async function ServicesPage() {
  const { settings, categories, services } = await getServicesPageData();

  const phone = settings?.phone || "+94 77 123 4567";
  const hours = settings?.businessHours || "Monday - Saturday: 8:30 AM - 5:30 PM";
  const companyName = settings?.companyName || "LENUX PRODUCTION (PVT) LTD";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* Header */}
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* Services Hero Banner */}
      <section className="relative w-full pt-32 md:pt-40 pb-16 md:pb-20 bg-gradient-to-b from-[#091712] via-black to-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image src="/images/hero-bg.jpg" alt="Services Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lenux-emerald/30 bg-lenux-emerald/10 text-lenux-emerald text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} /> Full Visual Solutions
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight">
            Design, Print & <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 bg-clip-text text-transparent">Production</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Complete advertising, printing, branding, and manufacturing solutions categorized under one roof.
          </p>
        </div>
      </section>

      {/* 🌟 Interactive Filter & Categorized Sections Component */}
      <ServicesFilterSection categories={categories} services={services} />

      {/* UV Premium Finishing Note */}
      <section className="py-16 bg-[#080808] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="text-lenux-emerald" size={20} /> UV Premium Finishing Guarantee
            </h4>
            <p className="text-xs sm:text-sm text-gray-400 font-light max-w-2xl">
              All of our board works, light boards, and sticker applications can be enhanced with UV protective coats and premium glossy/matte finishes.
            </p>
          </div>
          <Link
            href="/contact"
            className="w-full sm:w-auto text-center px-8 py-3.5 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark transition-all shrink-0 shadow-lg"
          >
            Request Custom Spec
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}