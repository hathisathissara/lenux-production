"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Eye, X, Calendar, User, ArrowRight, Layers, ImageIcon } from "lucide-react";

interface PortfolioGalleryProps {
  projects: any[];
}

export default function PortfolioGallery({ projects }: PortfolioGalleryProps) {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const categoryParam = searchParams.get("category");
  const openId = searchParams.get("open");

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeProject, setActiveProject] = useState<any | null>(null);

  // 🌟 Services පිටුවෙන් හෝ URL එකෙන් එන Query Param එක අනුව Auto Filter වීම
  useEffect(() => {
    if (serviceParam) {
      setSelectedCategory(serviceParam);
    } else if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [serviceParam, categoryParam]);

  // URL එකේ ?open=<id> තිබේ නම් අදාළ Modal එක Auto Open වීම
  useEffect(() => {
    if (openId && projects.length > 0) {
      const found = projects.find((p) => p._id === openId);
      if (found) setActiveProject(found);
    }
  }, [openId, projects]);

  // Available unique categories from projects
  const categories = [
    "all",
    ...Array.from(new Set(projects.map((p) => p.service?.title || "Branding"))),
  ];

  // Filter projects by selected service/category
  const filteredProjects = projects.filter((project) => {
    if (selectedCategory === "all") return true;
    const serviceTitle = project.service?.title || "";
    return serviceTitle.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-12">
      
      {/* 🌟 1. CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 justify-start sm:justify-center no-scrollbar">
        {categories.map((cat: any) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
              selectedCategory.toLowerCase() === cat.toLowerCase()
                ? "bg-lenux-emerald text-white shadow-lg shadow-lenux-emerald/30 scale-105"
                : "bg-[#0d0d0d] text-gray-400 border border-white/5 hover:border-lenux-emerald/50 hover:text-white"
            }`}
          >
            {cat === "all" ? `All Projects (${projects.length})` : cat}
          </button>
        ))}
      </div>

      {/* 🌟 2. PROJECTS GRID */}
      {filteredProjects.length === 0 ? (
        <div className="bg-[#0a0a0a] rounded-3xl p-16 text-center border border-white/5 space-y-4 max-w-xl mx-auto">
          <Layers size={48} className="mx-auto text-lenux-emerald opacity-60" />
          <h4 className="text-xl font-bold text-white">No Projects Available</h4>
          <p className="text-sm text-gray-400 font-light">
            No portfolio projects added in this category yet.
          </p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-lenux-emerald hover:bg-lenux-emerald hover:text-white transition-all"
          >
            Show All Projects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              onClick={() => setActiveProject(project)}
              className="group rounded-3xl overflow-hidden bg-[#090909] border border-white/5 hover:border-lenux-emerald/50 transition-all duration-500 shadow-2xl flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Project Cover Image */}
                <div className="relative w-full h-64 bg-gray-900 overflow-hidden">
                  <Image
                    src={project.coverImage.url}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent" />
                  
                  {/* Service Badge */}
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-lenux-emerald">
                    {project.service?.title || "Production"}
                  </span>

                  {/* Hover Eye Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-lenux-emerald text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                      <Eye size={20} />
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6 space-y-3">
                  <h4 className="text-xl font-bold text-white group-hover:text-lenux-emerald transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Client & Date Footer */}
              <div className="p-6 pt-0 flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4 mt-2">
                {project.clientName && (
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <User size={13} className="text-lenux-emerald" /> {project.clientName}
                  </span>
                )}
                {project.completionDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} /> {new Date(project.completionDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==========================================
          🌟 3. PROJECT DETAILS & GALLERY MODAL (Lightbox)
          ========================================== */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col justify-between relative animate-in fade-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#090909]">
              <div>
                <span className="text-[10px] font-bold text-lenux-emerald uppercase tracking-widest">
                  {activeProject.service?.title || "Case Study"}
                </span>
                <h3 className="text-2xl font-bold text-white mt-0.5">{activeProject.title}</h3>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {/* Main Cover Photo */}
              <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-white/5 bg-gray-950">
                <Image
                  src={activeProject.coverImage.url}
                  alt={activeProject.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Client / Date Specs */}
              <div className="flex flex-wrap gap-6 text-xs text-gray-300 bg-white/5 p-4 rounded-2xl border border-white/5">
                {activeProject.clientName && (
                  <div className="flex items-center gap-2">
                    <User size={15} className="text-lenux-emerald" />
                    <span><strong className="text-white">Client:</strong> {activeProject.clientName}</span>
                  </div>
                )}
                {activeProject.completionDate && (
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-lenux-emerald" />
                    <span><strong className="text-white">Completed:</strong> {new Date(activeProject.completionDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Project Overview</h4>
                <p className="text-sm text-gray-300 font-light leading-relaxed whitespace-pre-line">
                  {activeProject.description}
                </p>
              </div>

              {/* Project Extra Gallery Photos */}
              {activeProject.gallery && activeProject.gallery.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-lenux-emerald uppercase tracking-widest flex items-center gap-1.5">
                    <ImageIcon size={14} /> Production Gallery ({activeProject.gallery.length} Photos)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {activeProject.gallery.map((img: any, i: number) => (
                      <div key={i} className="relative w-full h-32 rounded-xl overflow-hidden border border-white/5 group">
                        <Image
                          src={img.url}
                          alt={`Gallery photo ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer CTA */}
            <div className="p-6 border-t border-white/5 bg-[#090909] flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-gray-400">Want similar visual results for your brand?</span>
              <Link
                href="/contact"
                className="px-6 py-2.5 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-lenux-dark transition-all inline-flex items-center gap-2"
              >
                Request Quote <ArrowRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}