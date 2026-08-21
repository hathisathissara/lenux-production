"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { createPortal } from "react-dom";

interface LightboxProps {
  url: string;
  alt: string;
}

export default function ProjectImageLightbox({ url, alt }: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  // 🔒 Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const lightbox = isOpen ? (
    <div
      onClick={() => setIsOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.97)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      {/* Close Button */}
      <button
        onClick={() => setIsOpen(false)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 100000,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255,255,255,0.25)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255,255,255,0.1)")
        }
      >
        <X size={22} />
      </button>

      {/* Image Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          maxWidth: "1400px",
          maxHeight: "calc(100vh - 80px)",
        }}
      >
        <Image
          src={url}
          alt={alt}
          fill
          className="object-contain"
          priority
          sizes="100vw"
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  ) : null;

  return (
    <>
      {/* Thumbnail with hover */}
      <div
        onClick={() => setIsOpen(true)}
        className="relative w-full h-full cursor-pointer group"
      >
        <Image
          src={url}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 1200px) 100vw, 80vw"
          priority
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] z-10">
          <div className="px-5 py-2.5 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Maximize2 size={14} /> Click to View Full Image
          </div>
        </div>
      </div>

      {/* Portal — body root ෙකට render කරයි */}
      {mounted && createPortal(lightbox, document.body)}
    </>
  );
}