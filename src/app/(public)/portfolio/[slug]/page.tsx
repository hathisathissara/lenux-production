import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";
import { Portfolio } from "@/models/Portfolio";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import ProjectImageLightbox from "@/components/ProjectImageLightbox"; // 🌟 Lightbox Modal Popup Component

import { Calendar, User, MessageCircle, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const project = await Portfolio.findOne({ slug, isPublished: true }).lean() as any;

  if (!project) return { title: "Project Not Found | Lenux Production" };

  const projectTitle = project.title;
  const projectDesc = project.description ? project.description.substring(0, 150) + "..." : "Lenux Production portfolio project.";
  const coverImg = project.coverImage?.url || `${SITE_URL}/images/logo.png`;

  return {
    alternates: {
      canonical: `/portfolio/${slug}`,
    },
    title: `${projectTitle} | Lenux Production Portfolio`,
    description: projectDesc,
    openGraph: {
      title: `${projectTitle} | Lenux Production`,
      description: projectDesc,
      url: `${SITE_URL}/portfolio/${slug}`,
      images: [{ url: coverImg, width: 1200, height: 630, alt: projectTitle }],
    }
  };
}

async function getProjectDetail(slug: string) {
  await connectDB();
  const [settingsDoc, projectDoc] = await Promise.all([
    ContactInformation.findOne().lean(),
    Portfolio.findOne({ slug, isPublished: true }).populate('service', 'title').lean(),
  ]);

  return {
    settings: settingsDoc ? JSON.parse(JSON.stringify(settingsDoc)) : null,
    project: projectDoc ? JSON.parse(JSON.stringify(projectDoc)) : null,
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;
  const { settings, project } = await getProjectDetail(slug);

  if (!project) notFound();

  const phone = settings?.phone;
  const hours = settings?.businessHours;
  const companyName = settings?.companyName;
  const whatsapp = settings?.whatsapp;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* PROJECT HERO BANNER */}
      <section className="relative w-full pt-40 pb-16 bg-gradient-to-b from-[#091712] via-black to-black border-b border-white/5 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-4">
          <ScrollReveal>
            <span className="px-4 py-1.5 rounded-full bg-lenux-emerald/10 border border-lenux-emerald/30 text-lenux-emerald text-xs font-bold uppercase tracking-widest">
              {project.service?.title || "Visual Production"}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight pt-2">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 pt-2">
              {project.clientName && (
                <span className="flex items-center gap-1.5 text-gray-200">
                  <User size={14} className="text-lenux-emerald" /> <strong>Client:</strong> {project.clientName}
                </span>
              )}
              {project.completionDate && (
                <span className="flex items-center gap-1.5 text-gray-200">
                  <Calendar size={14} className="text-lenux-emerald" /> <strong>Completed:</strong> {new Date(project.completionDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SHOWCASE SECTION */}
      <section className="py-20 bg-[#040404] relative">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          
          {/* Main Cover Result with Lightbox Popup */}
          <ScrollReveal>
            <div className="relative w-full h-[400px] sm:h-[550px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-gray-950 shadow-2xl">
              <ProjectImageLightbox url={project.coverImage.url} alt={project.title} />
            </div>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal>
            <div className="bg-[#090909] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold text-lenux-emerald uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={16} /> Project Execution & Scope
              </h3>
              <p className="text-base sm:text-lg text-gray-200 font-light leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
          </ScrollReveal>

          {/* 🌟 1. BEFORE PHOTOS SECTION (with Lightbox Modal) */}
          {project.beforeImages && project.beforeImages.length > 0 && (
            <ScrollReveal>
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">Phase 01</span>
                  <h3 className="text-2xl font-bold text-white uppercase mt-2">Before Project Execution ({project.beforeImages.length} Photos)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.beforeImages.map((img: Record<string, string>, i: number) => (
                    <div key={i} className="relative w-full h-72 rounded-3xl overflow-hidden border border-white/10 bg-gray-950 shadow-xl">
                      <ProjectImageLightbox url={img.url} alt={`Before photo ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* 🌟 2. PRODUCTION PHOTOS SECTION (with Lightbox Modal) */}
          {project.productionImages && project.productionImages.length > 0 && (
            <ScrollReveal>
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/30">Phase 02</span>
                  <h3 className="text-2xl font-bold text-white uppercase mt-2">Workshop & Production Process ({project.productionImages.length} Photos)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.productionImages.map((img: Record<string, string>, i: number) => (
                    <div key={i} className="relative w-full h-72 rounded-3xl overflow-hidden border border-white/10 bg-gray-950 shadow-xl">
                      <ProjectImageLightbox url={img.url} alt={`Production photo ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* 🌟 3. FINAL INSTALLATION PHOTOS SECTION (with Lightbox Modal) */}
          {project.installationImages && project.installationImages.length > 0 && (
            <ScrollReveal>
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest bg-lenux-emerald/10 px-3 py-1 rounded-full border border-lenux-emerald/30">Phase 03</span>
                  <h3 className="text-2xl font-bold text-white uppercase mt-2">Final On-Site Installation ({project.installationImages.length} Photos)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.installationImages.map((img: Record<string, string>, i: number) => (
                    <div key={i} className="relative w-full h-72 rounded-3xl overflow-hidden border border-white/10 bg-gray-950 shadow-xl">
                      <ProjectImageLightbox url={img.url} alt={`Installation photo ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-[#06241a] via-[#081f17] to-[#040e0a] border-t border-lenux-emerald/30 relative text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <ScrollReveal>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white">
              Want Similar Results for <span className="text-lenux-emerald">Your Brand?</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/contact" className="px-8 py-4 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark shadow-xl transition-all">
                Get a Quote
              </Link>
              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '94')}?text=Hi%20Lenux%20Production%2C%20I%20need%20a%20quotation%20for...`} target="_blank" className="px-8 py-4 border border-emerald-400/40 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-emerald hover:text-white transition-all inline-flex items-center gap-2">
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