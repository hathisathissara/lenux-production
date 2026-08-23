"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface GalleryItem {
  _id: string;
  title?: string;
  description?: string;
  category?: string;
  image: { url: string; publicId?: string };
}

interface HomeFeaturedGalleryProps {
  images: GalleryItem[];
}

export default function HomeFeaturedGallery({ images }: HomeFeaturedGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Auto-play slideshow (4 seconds per slide, pause on hover)
  useEffect(() => {
    if (!images || images.length <= 1) return;
    if (isHovered) return;

    const timer = setInterval(handleNext, 4000);
    return () => clearInterval(timer);
  }, [images, isHovered, handleNext]);

  if (!images || images.length === 0) return null;

  return (
    <section className="py-16 md:py-28 bg-[#030303] border-t border-white/5 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-32 left-1/3 w-96 h-96 bg-lenux-emerald/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 space-y-12 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} /> Visual Showcase
            </span>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide">
              Our <span className="text-lenux-emerald">Gallery</span>
            </h3>
            <p className="text-gray-400 text-sm">A glimpse of our production work and creative executions.</p>
          </div>
          <Link href="/gallery" className="px-6 py-3 border border-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:border-lenux-emerald hover:bg-lenux-emerald/10 transition-all w-fit">
            View Full Gallery →
          </Link>
        </div>

        {/* Slideshow Container */}
        <div
          className="relative w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Content Area */}
          <div className="relative w-full overflow-hidden mb-6">
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {images.map((item, index) => (
                <div key={item._id} className="w-full shrink-0 flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
                  
                  {/* Left side: Image */}
                  <div className="w-full md:w-1/2 lg:w-[55%] shrink-0">
                    <div className="relative w-full bg-white h-[300px] sm:h-[400px] md:h-[450px] rounded-sm overflow-hidden shadow-2xl">
                      <Image
                        src={item.image.url}
                        alt={item.title || "Lenux Production Gallery"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                  
                  {/* Right side: Content */}
                  <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center space-y-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-lenux-emerald leading-snug">
                      {item.title || item.category || "Creative Production Work"}
                    </h3>
                    
                    {item.description && (
                      <div className="space-y-4">
                        <p className="text-base sm:text-lg text-white font-medium italic">
                          {item.description.split('\n')[0]} {/* If first line is a summary */}
                        </p>
                        
                        {item.description.split('\n').length > 1 && (
                          <div className="space-y-3 pt-2 text-sm text-gray-300">
                            {item.description.split('\n').slice(1).map((line, i) => (
                              line.trim() && <p key={i}>{line}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-4">
                      <Link href="/gallery" className="inline-block px-6 py-2.5 bg-lenux-emerald text-white rounded-sm text-xs font-bold uppercase tracking-wide hover:bg-lenux-emerald/90 transition-all shadow-lg shadow-lenux-emerald/20">
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows (Optional, absolute positioning over container or sides) */}
            {/* Can be kept or removed if dots are enough. Let's keep them on the sides on desktop */}
            <button
              onClick={handlePrev}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-lenux-emerald hover:border-lenux-emerald text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-lenux-emerald hover:border-lenux-emerald text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-2 pt-4 mt-8">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  currentIndex === idx
                    ? "w-8 bg-lenux-emerald shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                    : "w-2 bg-gray-600 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
