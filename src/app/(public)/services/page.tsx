
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
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
  title: "Our Services | Printing, Embossed Letters & Light Boards Sri Lanka",
  description: "Explore Lenux Production services: Digital and Offset printing, custom logo boards, shop branding, vehicle branding, and illuminated light boards in Colombo.",
  keywords: "digital printing colombo, offset printing sri lanka, shop branding sri lanka, embossed letters colombo, light boards sri lanka",
  openGraph: {
    title: "Services | Lenux Production - Printing & Branding Sri Lanka",
    description: "Explore Lenux Production services: Digital and Offset printing, custom logo boards, shop branding, vehicle branding, and illuminated light boards in Colombo.",
    url: `${SITE_URL}/services`,
    siteName: "Lenux Production",
    images: [
      {
        url: `${SITE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: "Lenux Production - Our Services",
      }
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Lenux Production - Printing & Branding Sri Lanka",
    description: "Explore Lenux Production services: Digital and Offset printing, custom logo boards, shop branding, vehicle branding, and illuminated light boards.",
    images: [`${SITE_URL}/images/logo.png`],
  },
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

  const phone = settings?.phone;
  const hours = settings?.businessHours;
  const companyName = settings?.companyName;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">

      {/* Header */}
      <Header phone={phone} hours={hours} companyName={companyName} />



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