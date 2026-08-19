"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";

interface LightboxProps {
  url: string;
  alt: string;
}

export default function ProjectImageLightbox({ url, alt }: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 🌟 Cover Image / Gallery Image මත Click කළ විට Modal එක විවෘත වේ */}
      <div 
        onClick={() => setIsOpen(true)}
        className="relative w-full h-full cursor-pointer group"
      >
        <Image
          src={url}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          priority
        />
        <div className="absolute bottom-4 right-4 z-20 px-4 py-2 bg-black/70 hover:bg-lenux-emerald text-white rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 transition-all flex items-center gap-1.5 shadow-xl opacity-0 group-hover:opacity-100">
          <Maximize2 size={14} /> Click to Zoom
        </div>
      </div>

      {/* 🌟 Fullscreen Lightbox Modal Popup */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-6xl w-full max-h-[95vh] flex flex-col items-center justify-center bg-[#0c0c0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 z-30 w-11 h-11 rounded-full bg-black/80 hover:bg-lenux-emerald text-white flex items-center justify-center transition-all border border-white/10 shadow-lg"
            >
              <X size={22} />
            </button>

            {/* Large Fullscreen Image */}
            <div className="relative w-full h-[80vh] bg-black rounded-2xl overflow-hidden">
              <Image
                src={url}
                alt={alt}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}