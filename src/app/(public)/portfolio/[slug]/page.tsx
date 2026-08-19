import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";
import { Portfolio } from "@/models/Portfolio";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollToTop from "@/components/ScrollToTop";
import ProjectImageLightbox from "@/components/ProjectImageLightbox"; // 🌟 Lightbox Modal Component

import { Calendar, User, MessageCircle, ImageIcon, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

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

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { settings, project } = await getProjectDetail(slug);

  if (!project) {
    notFound();
  }

  const phone = settings?.phone || "+94 77 123 4567";
  const hours = settings?.businessHours || "Monday - Saturday: 8:30 AM - 5:30 PM";
  const companyName = settings?.companyName || "LENUX PRODUCTION (PVT) LTD";
  const whatsapp = settings?.whatsapp || "+94 77 123 4567";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* Header */}
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* ==========================================
          PROJECT HERO / TITLE BANNER
          ========================================== */}
      <section className="relative w-full pt-45 pb-16 bg-gradient-to-b from-[#091712] via-black to-black border-b border-white/5 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-4">
          <ScrollReveal>
            <span className="px-4 py-1.5 rounded-full bg-lenux-emerald/10 border border-lenux-emerald/30 text-lenux-emerald text-xs font-bold uppercase tracking-widest">
              {project.service?.title || "Production Project"}
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

      {/* ==========================================
          PROJECT MAIN IMAGE & DETAILS SHOWCASE
          ========================================== */}
      <section className="py-20 bg-[#040404] relative">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          
          {/* Main Large Cover Photo with Lightbox Popup */}
          <ScrollReveal>
            <div className="relative w-full h-[400px] sm:h-[550px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-gray-950 shadow-2xl">
              <ProjectImageLightbox url={project.coverImage.url} alt={project.title} />
            </div>
          </ScrollReveal>

          {/* Project Overview / Description */}
          <ScrollReveal>
            <div className="bg-[#090909] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-6 shadow-xl">
              <h3 className="text-xs font-bold text-lenux-emerald uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={16} /> Project Overview & Execution
              </h3>
              <p className="text-base sm:text-lg text-gray-200 font-light leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
          </ScrollReveal>

          {/* Production Gallery Photos (Clicking opens Lightbox Modal) */}
          {project.gallery && project.gallery.length > 0 && (
            <ScrollReveal>
              <div className="space-y-6 pt-6">
                <h3 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                  <ImageIcon size={20} className="text-lenux-emerald" /> Production Gallery ({project.gallery.length} Photos)
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.gallery.map((img: any, i: number) => (
                    <div 
                      key={i} 
                      className="relative w-full h-72 rounded-3xl overflow-hidden border border-white/10 bg-gray-950 shadow-xl"
                    >
                      <ProjectImageLightbox url={img.url} alt={`${project.title} gallery photo ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

        </div>
      </section>

      {/* ==========================================
          CTA BANNER
          ========================================== */}
      <section className="py-24 bg-gradient-to-r from-[#06241a] via-[#081f17] to-[#040e0a] border-t border-lenux-emerald/30 relative text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <ScrollReveal>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white">
              Want Similar Results for <span className="text-lenux-emerald">Your Brand?</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
              Contact our production team today to discuss your custom requirements.
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

      <Footer/>

      <ScrollToTop />

    </div>
  );
}