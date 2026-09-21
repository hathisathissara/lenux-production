"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Layers, Maximize2 } from "lucide-react";

interface GalleryImageItem {
  _id: string;
  title?: string;
  description?: string;
  category?: string;
  service?: string;
  url: string;
  publicId?: string;
}

interface VisualGalleryProps {
  galleryImages: GalleryImageItem[];
}

export default function VisualGallery({ galleryImages }: VisualGalleryProps) {
  const [selectedService, setSelectedService] = useState<string>("all");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeImage, setActiveImage] = useState<any | null>(null);

  // --- Mouse-drag scroll refs ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDragged = useRef(false); // true only when pointer moved > threshold

  const DRAG_THRESHOLD = 5; // px

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.clientX;
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      hasDragged.current = true;
      e.preventDefault();
      if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft.current - dx;
    }
  };

  const onPointerUp = () => { isDragging.current = false; };

  // 🌟 Only show services that actually have at least one gallery image
  const services = [
    "all",
    ...Array.from(
      new Set(
        galleryImages
          .map((img) => (img.service || img.title || img.category || "Production").trim())
          .filter(Boolean)
      )
    ),
  ];

  // Filter images by selected service
  const filteredImages = galleryImages.filter((img) => {
    if (selectedService === "all") return true;
    const itemService = (img.service || img.title || img.category || "Production").trim();
    return itemService.toLowerCase() === selectedService.toLowerCase();
  });

  return (
    <div className="space-y-10">

      {/* 🌟 1. SERVICE FILTER PILLS — touch + mouse-drag scrollable */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {services.map((svc: string) => {
          const count =
            svc === "all"
              ? galleryImages.length
              : galleryImages.filter(
                  (img) =>
                    (img.service || img.title || img.category || "Production")
                      .trim()
                      .toLowerCase() === svc.toLowerCase()
                ).length;

          const isSelected = selectedService.toLowerCase() === svc.toLowerCase();

          return (
            <button
              key={svc}
              onClick={() => {
                // Only filter when user tapped/clicked — not when they dragged to scroll
                if (!hasDragged.current) setSelectedService(svc);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 shrink-0 ${
                isSelected
                  ? "bg-lenux-emerald text-white shadow-lg shadow-lenux-emerald/30 scale-105"
                  : "bg-[#0d0d0d] text-gray-400 border border-white/5 hover:border-lenux-emerald/50 hover:text-white"
              }`}
            >
              {svc === "all" ? `All (${galleryImages.length})` : `${svc} (${count})`}
            </button>
          );
        })}
      </div>

      {/* 🌟 2. MASONRY / RESPONSIVE GALLERY GRID */}
      {filteredImages.length === 0 ? (
        <div className="bg-[#0a0a0a] rounded-3xl p-16 text-center border border-white/5 space-y-4 max-w-xl mx-auto">
          <Layers size={48} className="mx-auto text-lenux-emerald opacity-60" />
          <p className="text-xl font-bold text-white">No Gallery Photos Found</p>
          <p className="text-sm text-gray-400 font-light">
            No images found for this service yet.
          </p>
          <button
            onClick={() => setSelectedService("all")}
            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-lenux-emerald hover:bg-lenux-emerald hover:text-white transition-all"
          >
            Show All Photos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((imgItem, index) => {
            const displayBadge = imgItem.service || imgItem.title || imgItem.category || "Production";

            return (
              <div
                key={imgItem._id || index}
                onClick={() => setActiveImage(imgItem)}
                className="relative group h-80 rounded-3xl overflow-hidden bg-[#090909] border border-white/5 hover:border-lenux-emerald/50 cursor-pointer shadow-xl transition-all duration-500"
              >
                {/* Image */}
                <Image
                  src={imgItem.url}
                  alt={imgItem.title || displayBadge}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Dark Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  
                  {/* Top Service Badge */}
                  <span className="self-start px-3 py-1 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-lenux-emerald">
                    {displayBadge}
                  </span>

                  {/* Bottom Details & Zoom Icon */}
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      {imgItem.title && (
                        <p className="text-base font-bold text-white tracking-wide line-clamp-1">
                          {imgItem.title}
                        </p>
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
            );
          })}
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
              aria-label="Close image preview"
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
            {(activeImage.title || activeImage.description || activeImage.service || activeImage.category) && (
              <div className="w-full p-6 bg-[#090909] border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold text-lenux-emerald uppercase tracking-widest">
                    {activeImage.service || activeImage.category || "Visual Production"}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                    {activeImage.title || activeImage.service || "Lenux Production Gallery Work"}
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