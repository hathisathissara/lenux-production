"use client";

import { useEffect, useState } from "react";

export default function LenuxLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 2.8s පසු fade out කිරීම
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2800);

    // 3.4s පසු DOM එකෙන් ඉවත් කිරීම (fade out animation ශේෂ වූ පසු)
    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 3400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#050505",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.6s ease",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      {/* Green glow backdrop */}
      <div style={{
        position: "absolute",
        width: "420px",
        height: "420px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)",
        filter: "blur(40px)",
        animation: "pulseGlow 2s ease-in-out infinite",
      }} />

      {/* LENUX letters */}
      <div style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "2px",
      }}>
        {"LENUX".split("").map((letter, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Arial Black', 'Arial Bold', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(52px, 12vw, 96px)",
              letterSpacing: "-2px",
              color: letter === "X" ? "transparent" : "#ffffff",
              WebkitTextStroke: letter === "X" ? "2.5px #22c55e" : "none",
              textShadow: letter === "X"
                ? "0 0 30px rgba(34,197,94,0.8), 0 0 60px rgba(34,197,94,0.4)"
                : "0 0 20px rgba(255,255,255,0.15)",
              animation: "letterDrop 0.6s cubic-bezier(0.22,1,0.36,1) both",
              animationDelay: `${i * 0.1}s`,
              display: "inline-block",
              lineHeight: 1,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* PRODUCTION subtitle */}
      <div style={{
        marginTop: "6px",
        fontFamily: "'Arial', sans-serif",
        fontWeight: 400,
        fontSize: "clamp(10px, 2.5vw, 16px)",
        letterSpacing: "8px",
        color: "rgba(255,255,255,0.55)",
        textTransform: "uppercase" as const,
        animation: "fadeInUp 0.7s ease both",
        animationDelay: "0.65s",
      }}>
        PRODUCTION
      </div>

      {/* Green scanning line */}
      <div style={{
        position: "absolute",
        bottom: "52px",
        width: "clamp(160px, 36vw, 280px)",
        height: "2px",
        background: "linear-gradient(90deg, transparent, #22c55e, transparent)",
        animation: "scanLine 1.6s ease-in-out infinite",
        boxShadow: "0 0 8px #22c55e, 0 0 20px rgba(34,197,94,0.5)",
      }} />

      <style>{`
        @keyframes letterDrop {
          0%   { opacity: 0; transform: translateY(-40px) scale(0.85); }
          60%  { transform: translateY(4px) scale(1.04); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInUp {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1);   opacity: 0.8; }
          50%       { transform: scale(1.12); opacity: 1;   }
        }
        @keyframes scanLine {
          0%   { transform: scaleX(0.2); opacity: 0.3; }
          50%  { transform: scaleX(1);   opacity: 1;   }
          100% { transform: scaleX(0.2); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
