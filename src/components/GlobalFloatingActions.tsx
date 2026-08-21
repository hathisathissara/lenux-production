"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";

// ─── Official WhatsApp Brand SVG ─────────────────────────────────────────────
const WhatsAppIcon = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ─── WhatsApp Floating Button ─────────────────────────────────────────────────
function WhatsAppFloatingButton({ phone }: { phone: string }) {
  const [hovered, setHovered] = useState(false);

  if (!phone) return null;

  const cleanPhone = phone.replace(/[^0-9]/g, "").replace(/^0/, "94");
  const autoMessage = encodeURIComponent("Hi Lenux Production, I need a quotation for...");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${autoMessage}`;

  return (
    <>
      <style>{`
        @keyframes wa-pulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      <div
        className="fixed z-50 flex items-end gap-3"
        style={{ bottom: "24px", left: "24px" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="relative flex-shrink-0 flex items-center justify-center rounded-full text-white
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25d366]"
          style={{
            width: "56px",
            height: "56px",
            background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
            boxShadow: hovered
              ? "0 0 0 10px rgba(37,211,102,0.10), 0 0 36px rgba(37,211,102,0.50), 0 8px 24px rgba(0,0,0,0.4)"
              : "0 0 0 0 rgba(37,211,102,0), 0 0 22px rgba(37,211,102,0.28), 0 6px 18px rgba(0,0,0,0.35)",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "all 0.30s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {/* Pulse ring */}
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ animation: "wa-pulse 2.8s ease-in-out infinite", background: "rgba(37,211,102,0.22)" }}
          />
          <WhatsAppIcon className="w-[26px] h-[26px] relative z-10" />
        </a>

        {/* Hover Popup — desktop only, slides in from left */}
        <div
          className={`
            hidden md:flex flex-col gap-1 pointer-events-none select-none
            bg-[#080f0b]/90 border border-[#10b981]/20 backdrop-blur-md
            rounded-2xl px-4 py-3 shadow-2xl shadow-black/60
            transition-all duration-300 ease-out
            ${hovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
          `}
          style={{ minWidth: "195px" }}
        >
          <span className="text-[10px] text-[#25d366] font-bold uppercase tracking-widest">Need help?</span>
          <span className="text-white text-sm font-semibold leading-snug">Chat with Lenux Production</span>
          <span className="text-[#10b981] text-xs font-semibold mt-1 flex items-center gap-1">
            Let&apos;s Talk
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
          {/* Left-pointing triangle pointer */}
          <div
            className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#080f0b]/90 border-l border-b border-[#10b981]/20"
            style={{ transform: "translateY(-50%) rotate(45deg)" }}
          />
        </div>
      </div>
    </>
  );
}

// ─── Back to Top Button ───────────────────────────────────────────────────────
function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY > 400);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="fixed z-50" style={{ bottom: "24px", right: "24px" }}>
      {/* Tooltip */}
      <div
        aria-hidden="true"
        className={`
          absolute bottom-full mb-2 left-1/2 -translate-x-1/2
          px-3 py-1.5 rounded-lg text-xs font-semibold text-white/90 whitespace-nowrap
          bg-black/75 border border-[#10b981]/15 backdrop-blur-sm
          pointer-events-none transition-all duration-200 select-none
          ${hovered && isVisible ? "opacity-100 -translate-y-0.5" : "opacity-0 translate-y-1"}
        `}
      >
        Back to Top
        {/* Caret */}
        <span
          className="absolute top-full left-1/2 -translate-x-1/2 block w-0 h-0"
          style={{
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid rgba(0,0,0,0.75)",
          }}
        />
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Back to top"
        className={`
          relative flex items-center justify-center rounded-full
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981]
          ${isVisible ? "pointer-events-auto" : "pointer-events-none"}
        `}
        style={{
          width: "48px",
          height: "48px",
          background: hovered ? "rgba(16,185,129,0.13)" : "rgba(5,5,8,0.70)",
          border: `1px solid ${hovered ? "rgba(16,185,129,0.75)" : "rgba(16,185,129,0.30)"}`,
          backdropFilter: "blur(14px)",
          boxShadow: hovered
            ? "0 0 22px rgba(16,185,129,0.38), 0 4px 16px rgba(0,0,0,0.45)"
            : "0 2px 12px rgba(0,0,0,0.30)",
          color: hovered ? "#10b981" : "rgba(16,185,129,0.70)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? hovered ? "scale(1.08) translateY(0)" : "scale(1) translateY(0)"
            : "scale(0.85) translateY(14px)",
          transition: "all 0.40s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <ArrowUp
          size={18}
          strokeWidth={1.8}
          style={{
            transition: "transform 0.25s ease",
            transform: hovered ? "translateY(-1.5px)" : "translateY(0)",
          }}
        />
      </button>
    </div>
  );
}

// ─── Combined Global Floating Actions — added once in root layout ─────────────
export default function GlobalFloatingActions() {
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.data?.whatsapp) {
          setWhatsappNumber(data.data.whatsapp);
        } else {
          setWhatsappNumber("+94771234567");
        }
      })
      .catch(() => {
        setWhatsappNumber("+94771234567");
      });
  }, []);

  return (
    <>
      <WhatsAppFloatingButton phone={whatsappNumber} />
      <BackToTopButton />
    </>
  );
}
