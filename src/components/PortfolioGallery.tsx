"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, Calendar, User, Layers } from "lucide-react";

interface PortfolioGalleryProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projects: any[];
}

export default function PortfolioGallery({ projects }: PortfolioGalleryProps) {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (serviceParam) {
      // eslint-disable-next-line
      setSelectedCategory(serviceParam);
    } else if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [serviceParam, categoryParam]);

  // Unique Service Categories
  const categories = [
    "all",
    ...Array.from(new Set(projects.map((p) => p.service?.title || "Branding"))),
  ];

  // Grouped Categories to Display
  const displayedCategories = selectedCategory === "all"
    ? Array.from(new Set(projects.map((p) => p.service?.title || "Branding")))
    : [selectedCategory];

  return (
    <div className="space-y-20">
      
      {/* 🌟 1. TOP CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 justify-start sm:justify-center no-scrollbar">
        {categories.map((cat: string) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
              selectedCategory.toLowerCase() === cat.toLowerCase()
                ? "bg-lenux-emerald text-white shadow-lg shadow-lenux-emerald/30 scale-105"
                : "bg-[#0d0d0d] text-gray-400 border border-white/5 hover:border-lenux-emerald/50 hover:text-white"
            }`}
          >
            {cat === "all" ? `All Categories (${projects.length})` : cat}
          </button>
        ))}
      </div>

      {/* 🌟 2. ARRANGE BY SERVICE/CATEGORY SECTIONS */}
      {projects.length === 0 ? (
        <div className="bg-[#0a0a0a] rounded-3xl p-16 text-center border border-white/5 space-y-4 max-w-xl mx-auto">
          <Layers size={48} className="mx-auto text-lenux-emerald opacity-60" />
          <h4 className="text-xl font-bold text-white">No Portfolio Projects Yet</h4>
          <p className="text-sm text-gray-400 font-light">
            Projects added via Admin Dashboard will appear categorized here.
          </p>
        </div>
      ) : (
        <div className="space-y-24">
          {displayedCategories.map((catName: string) => {
            const catProjects = projects.filter((p) => (p.service?.title || "Branding").toLowerCase() === catName.toLowerCase());
            if (catProjects.length === 0) return null;

            return (
              <section key={catName} className="space-y-8 animate-in fade-in duration-500">
                
                {/* Section Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-5 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-lenux-emerald uppercase tracking-widest bg-lenux-emerald/10 px-3 py-1 rounded-full border border-lenux-emerald/30">
                      Work Category
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide uppercase mt-2">
                      {catName} <span className="text-lenux-emerald">Projects</span>
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400">{catProjects.length} Completed Works</span>
                </div>

                {/* Projects Grid for this Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {catProjects.map((project) => (
                    <Link
                      key={project._id}
                      href={`/portfolio/${project.slug}`}
                      className="group rounded-3xl overflow-hidden bg-[#090909] border border-white/5 hover:border-lenux-emerald/50 transition-all duration-500 shadow-2xl flex flex-col justify-between block"
                    >
                      <div>
                        {/* Cover Photo */}
                        <div className="relative w-full h-64 bg-gray-900 overflow-hidden">
                          <Image
                            src={project.coverImage.url}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent" />
                          
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

                      {/* Client & Date */}
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
                    </Link>
                  ))}
                </div>

              </section>
            );
          })}
        </div>
      )}

    </div>
  );
}