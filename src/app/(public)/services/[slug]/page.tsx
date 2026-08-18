import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";
import { ServiceCategory } from "@/models/ServiceCategory";
import { Service } from "@/models/Service";
import { Portfolio } from "@/models/Portfolio";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollToTop from "@/components/ScrollToTop";

import { 
  Sparkles, ArrowRight, CheckCircle2, Layers, MessageCircle, Eye 
} from "lucide-react";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

async function getServiceDetailData(slug: string) {
  await connectDB();

  // 1. Settings ලබාගැනීම
  const settingsDoc = await ContactInformation.findOne().lean();
  const settings = settingsDoc ? JSON.parse(JSON.stringify(settingsDoc)) : null;

  // 2. Slug එකට අදාළ Service Category එක හෝ Service එක සෙවීම
  // (පළමුව Category slug එකක් ලෙස පරීක්ෂා කරයි)
  let category = await ServiceCategory.findOne({ slug, isActive: true }).lean();
  let relatedServices: any[] = [];
  let pageTitle = "";
  let pageDescription = "";
  let pageImage = "";

  if (category) {
    const catObj = JSON.parse(JSON.stringify(category));
    pageTitle = catObj.name;
    pageDescription = catObj.description || "Complete professional visual production services.";
    pageImage = catObj.image?.url || "/images/hero-bg.jpg";

    // එම Category එකට අදාළ Services ටික ලබාගැනීම
    const servicesDoc = await Service.find({ category: catObj._id, isActive: true }).sort({ sortOrder: 1 }).lean();
    relatedServices = JSON.parse(JSON.stringify(servicesDoc));
  } else {
    // Category එකක් ලෙස නැත්නම්, Specific Service slug එකක් ලෙස පරීක්ෂා කරයි
    let service = await Service.findOne({ slug, isActive: true }).populate('category', 'name slug').lean();
    if (!service) {
      return null; // කිසිවක් හමු නොවුවහොත් 404 පෙන්වයි
    }
    const serObj = JSON.parse(JSON.stringify(service));
    pageTitle = serObj.title;
    pageDescription = serObj.description;
    pageImage = serObj.image?.url || "/images/hero-bg.jpg";
    relatedServices = [serObj];
  }

  // 3. මෙම සේවාවට අදාළව කර ඇති Portfolio Projects ලබාගැනීම
  const portfolioDoc = await Portfolio.find({ isPublished: true }).populate('service', 'title').lean();
  const allProjects = JSON.parse(JSON.stringify(portfolioDoc));
  
  // අදාළ Projects පමණක් Filter කිරීම
  const relatedProjects = allProjects.filter((p: any) => 
    p.service?.title?.toLowerCase() === pageTitle.toLowerCase() || 
    p.category?.toLowerCase() === pageTitle.toLowerCase()
  );

  return { settings, pageTitle, pageDescription, pageImage, relatedServices, relatedProjects };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getServiceDetailData(slug);

  if (!data) {
    notFound(); // 404 Page
  }

  const { settings, pageTitle, pageDescription, pageImage, relatedServices, relatedProjects } = data;

  const phone = settings?.phone || "+94 77 123 4567";
  const hours = settings?.businessHours || "Monday - Saturday: 8:30 AM - 5:30 PM";
  const companyName = settings?.companyName || "LENUX PRODUCTION (PVT) LTD";
  const whatsapp = settings?.whatsapp || "+94 77 123 4567";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* Header */}
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* ==========================================
          SERVICE DETAIL HERO BANNER
          ========================================== */}
      <section className="relative w-full pt-40 pb-24 bg-gradient-to-b from-[#091712] via-black to-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image src={pageImage} alt={pageTitle} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lenux-emerald/30 bg-lenux-emerald/10 text-lenux-emerald text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> Professional Solution
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight">
              {pageTitle}
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              {pageDescription}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          SUB-SERVICES / SPECIFIC ITEMS GRID
          ========================================== */}
      <section className="py-28 bg-[#040404] relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Available Options</span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide uppercase">
                Explore <span className="text-lenux-emerald">{pageTitle}</span> Solutions
              </h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedServices.map((service: any) => (
              <ScrollReveal key={service._id}>
                <div className="rounded-3xl bg-[#090909] border border-white/5 overflow-hidden hover:border-lenux-emerald/50 transition-all duration-500 shadow-xl flex flex-col justify-between h-full group">
                  <div>
                    <div className="relative w-full h-56 bg-gray-900 overflow-hidden">
                      {service.image?.url && (
                        <Image src={service.image.url} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent" />
                    </div>
                    <div className="p-7 space-y-3">
                      <h4 className="text-xl font-bold text-white group-hover:text-lenux-emerald transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-xs text-gray-300 font-light leading-relaxed">
                        {service.shortDescription || service.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-7 pt-0 flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                    <Link
                      href={`/contact`}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lenux-emerald hover:text-white transition-colors"
                    >
                      Request Quote <ArrowRight size={14} />
                    </Link>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-lenux-emerald" /> Premium
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
          UV PREMIUM FINISHING NOTE
          ========================================== */}
      <section className="py-16 bg-[#080808] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="text-lenux-emerald" size={20} /> Enhanced with UV Premium Finishing
            </h4>
            <p className="text-xs sm:text-sm text-gray-400 font-light max-w-2xl">
              All of our production items can be upgraded with UV protective layers, gloss/matte lamination, and diamond cutting to ensure absolute quality.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark transition-all shrink-0 shadow-lg shadow-lenux-emerald/20"
          >
            Get Custom Quote
          </Link>
        </div>
      </section>

      {/* ==========================================
          RELATED PORTFOLIO WORKS (මෙම සේවාවට අදාළ වැඩ)
          ========================================== */}
      {relatedProjects.length > 0 && (
        <section className="py-28 bg-black relative">
          <div className="max-w-7xl mx-auto px-6 space-y-16">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Real Results</span>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide uppercase">
                  Recent <span className="text-lenux-emerald">{pageTitle} Works</span>
                </h3>
                <p className="text-gray-400 text-sm">Examples of {pageTitle} produced by Lenux Production.</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects.map((proj: any) => (
                <ScrollReveal key={proj._id}>
                  <Link 
                    href={`/portfolio?open=${proj._id}`}
                    className="group rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/5 hover:border-lenux-emerald/40 transition-all duration-500 shadow-xl flex flex-col justify-between block"
                  >
                    <div className="relative w-full h-64 overflow-hidden bg-gray-900">
                      <Image src={proj.coverImage.url} alt={proj.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                        <div className="w-12 h-12 rounded-full bg-lenux-emerald text-white flex items-center justify-center shadow-lg"><Eye size={20} /></div>
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <h4 className="text-lg font-bold text-white group-hover:text-lenux-emerald transition-colors">{proj.title}</h4>
                      {proj.clientName && <p className="text-xs text-gray-400">Client: {proj.clientName}</p>}
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          CTA BANNER
          ========================================== */}
      <section className="py-24 bg-gradient-to-r from-[#06241a] via-[#081f17] to-[#040e0a] border-t border-lenux-emerald/30 relative text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <ScrollReveal>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white">
              Ready to Order <span className="text-lenux-emerald">{pageTitle}?</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
              Contact our specialists today for fast turnaround times and competitive pricing.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/contact" className="px-8 py-4 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark shadow-xl transition-all">
                Get a Quote
              </Link>
              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="px-8 py-4 border border-emerald-400/40 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-emerald hover:text-white transition-all inline-flex items-center gap-2">
                <MessageCircle size={16} /> WhatsApp Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

     <Footer />

      <ScrollToTop />

    </div>
  );
}