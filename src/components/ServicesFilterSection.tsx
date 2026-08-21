"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface ServicesFilterProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  services: any[];
}

export default function ServicesFilterSection({ categories, services }: ServicesFilterProps) {
  const [selectedCatId, setSelectedCatId] = useState<string>("all");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Category එකක් මාරු කරද්දී ඇනිමේෂන් එක නැවත පණගැන්වීම
  const handleCategoryChange = (id: string) => {
    setIsTransitioning(true);
    setSelectedCatId(id);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Animation duration
  };

  // PC වලදී Mouse Drag Scroll ලොජික් එක
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const displayedCategories = selectedCatId === "all" 
    ? categories 
    : categories.filter((cat) => cat._id.toString() === selectedCatId);

  return (
    <div className="bg-[#030303] py-16 space-y-20">
      
      {/* 🌟 Custom Keyframe Animations CSS (100% Build-Safe) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customFadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: customFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        div::-webkit-scrollbar {
          display: none !important;
        }
      `}} />

      {/* 1. TOP CATEGORY FILTER PILLS */}
      <div className="max-w-7xl mx-auto px-6">
        <div 
          ref={sliderRef}
          className="flex items-center gap-2.5 overflow-x-auto pb-4 pt-1 cursor-grab active:cursor-grabbing select-none scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 shrink-0 ${
              selectedCatId === "all"
                ? "bg-lenux-emerald text-white shadow-lg shadow-lenux-emerald/30 scale-105"
                : "bg-[#0d0d0d] text-gray-400 border border-white/5 hover:border-lenux-emerald/50 hover:text-white"
            }`}
          >
            All Categories ({categories.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryChange(cat._id.toString())}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 shrink-0 ${
                selectedCatId === cat._id.toString()
                  ? "bg-lenux-emerald text-white shadow-lg shadow-lenux-emerald/30 scale-105"
                  : "bg-[#0d0d0d] text-gray-400 border border-white/5 hover:border-lenux-emerald/50 hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CATEGORY SECTIONS (with 100% Working Custom Animation) */}
      <div className={`space-y-24 transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        {/* eslint-disable-next-line */}
        {displayedCategories.map((cat: any) => {
          {/* eslint-disable-next-line */}
          const catServices = services.filter((ser: any) => {
            const serCatId = ser.category?._id?.toString() || ser.category?.toString();
            return serCatId === cat._id.toString();
          });

          if (catServices.length === 0) return null;

          return (
            <section 
              key={cat._id} 
              className="max-w-7xl mx-auto px-6 space-y-8 animate-fade-up" // 🌟 මෙහිදී අපගේ අලුත් Custom Animation එක දමා ඇත
            >
              
              {/* Category Title Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-5 gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide uppercase">
                    {cat.name}
                  </h2>
                  {cat.description && (
                    <p className="text-xs sm:text-sm text-gray-400 font-light max-w-xl">
                      {cat.description}
                    </p>
                  )}
                </div>
                
                <Link
                  href={`/portfolio?category=${encodeURIComponent(cat.name)}`}
                  className="text-xs font-bold uppercase tracking-wider text-lenux-emerald hover:text-white transition-colors inline-flex items-center gap-1.5 shrink-0"
                >
                  View {cat.name} Works <ArrowRight size={14} />
                </Link>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* eslint-disable-next-line */}
                {catServices.map((service: any, index: number) => (
                  <div key={service._id} className="rounded-3xl bg-[#090909] border border-white/5 overflow-hidden hover:border-lenux-emerald/50 transition-all duration-500 group shadow-2xl flex flex-col justify-between h-full">
                    <div>
                      <div className="relative w-full h-56 sm:h-60 bg-gray-900 overflow-hidden">
                        {service.image?.url ? (
                          <Image
                            src={service.image.url}
                            alt={service.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent" />
                      </div>

                      <div className="p-6 sm:p-7 space-y-3">
                        <h4 className="text-lg sm:text-xl font-bold text-white group-hover:text-lenux-emerald transition-colors">
                          {service.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed line-clamp-3">
                          {service.shortDescription || service.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 sm:p-7 pt-0 flex items-center justify-between border-t border-white/5 mt-4 pt-4">
                      <Link
                        href={`/portfolio?service=${encodeURIComponent(service.title)}`}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lenux-emerald hover:text-white transition-colors"
                      >
                        View Related Projects <ArrowRight size={14} />
                      </Link>
                      
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest hidden sm:flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-lenux-emerald" /> Quality
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </section>
          );
        })}
      </div>

    </div>
  );
}