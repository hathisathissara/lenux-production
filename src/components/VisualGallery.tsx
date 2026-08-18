"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, X, Layers, Maximize2 } from "lucide-react";

interface VisualGalleryProps {
  galleryImages: any[];
}

export default function VisualGallery({ galleryImages }: VisualGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeImage, setActiveImage] = useState<any | null>(null);

  // Categories නිර්මාණය කරගැනීම (All + Unique Categories)
  const categories = [
    "all",
    ...Array.from(new Set(galleryImages.map((img) => img.category || "Production"))),
  ];

  // Filter images by selected category
  const filteredImages = galleryImages.filter((img) => {
    if (selectedCategory === "all") return true;
    return (img.category || "Production").toLowerCase() === selectedCategory.toLowerCase();
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
            {cat === "all" ? `All Gallery (${galleryImages.length})` : cat}
          </button>
        ))}
      </div>

      {/* 🌟 2. MASONRY / RESPONSIVE GALLERY GRID */}
      {filteredImages.length === 0 ? (
        <div className="bg-[#0a0a0a] rounded-3xl p-16 text-center border border-white/5 space-y-4 max-w-xl mx-auto">
          <Layers size={48} className="mx-auto text-lenux-emerald opacity-60" />
          <h4 className="text-xl font-bold text-white">No Gallery Photos</h4>
          <p className="text-sm text-gray-400 font-light">
            No images found in this gallery category yet.
          </p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-lenux-emerald hover:bg-lenux-emerald hover:text-white transition-all"
          >
            Show All Photos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((imgItem, index) => (
            <div
              key={imgItem._id || index}
              onClick={() => setActiveImage(imgItem)}
              className="relative group h-80 rounded-3xl overflow-hidden bg-[#090909] border border-white/5 hover:border-lenux-emerald/50 cursor-pointer shadow-xl transition-all duration-500"
            >
              {/* Image */}
              <Image
                src={imgItem.url}
                alt={imgItem.title || "Lenux Production Gallery"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Dark Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                
                {/* Top Category Badge */}
                <span className="self-start px-3 py-1 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-lenux-emerald">
                  {imgItem.category || "Production"}
                </span>

                {/* Bottom Title & Zoom Icon */}
                <div className="flex items-end justify-between gap-4">
                  <div>
                    {imgItem.title && (
                      <h4 className="text-base font-bold text-white tracking-wide">
                        {imgItem.title}
                      </h4>
                    )}
                    {imgItem.description && (
                      <p className="text-xs text-gray-300 font-light line-clamp-1 mt-0.5">
                        {imgItem.description}
                      </p>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-lenux-emerald text-white flex items-center justify-center shrink-0 shadow-lg">
                    <Maximize2 size={16} />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==========================================
          🌟 3. FULLSCREEN LIGHTBOX MODAL
          ========================================== */}
      {activeImage && (
        <div 
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center bg-[#0c0c0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300"
          >
            
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all border border-white/10"
            >
              <X size={20} />
            </button>

            {/* Lightbox Image */}
            <div className="relative w-full h-[65vh] bg-black">
              <Image
                src={activeImage.url}
                alt={activeImage.title || "Lightbox Preview"}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Lightbox Footer Details */}
            {(activeImage.title || activeImage.description || activeImage.category) && (
              <div className="w-full p-6 bg-[#090909] border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold text-lenux-emerald uppercase tracking-widest">
                    {activeImage.category || "Visual Production"}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                    {activeImage.title || "Lenux Production Gallery Work"}
                  </h3>
                  {activeImage.description && (
                    <p className="text-xs text-gray-400 font-light mt-1 max-w-2xl leading-relaxed">
                      {activeImage.description}
                    </p>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}