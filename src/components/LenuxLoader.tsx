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

      {/* LENUX + PRODUCTION wrapper — inline-flex column so PRODUCTION width = LENUX width */}
      <div style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}>

        {/* LENUX letters row */}
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "2px",
        }}>
          {"LENU".split("").map((letter, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Arial Black', 'Arial Bold', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(52px, 12vw, 96px)",
                letterSpacing: "-2px",
                color: "#ffffff",
                textShadow: "0 0 20px rgba(255,255,255,0.15)",
                animation: "letterDrop 0.6s cubic-bezier(0.22,1,0.36,1) both",
                animationDelay: `${i * 0.1}s`,
                display: "inline-block",
                lineHeight: 1,
              }}
            >
              {letter}
            </span>
          ))}

          {/* SVG X — image eke widiyata: bold solid-fill green geometric X */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(52px, 12vw, 96px)",
              lineHeight: 1,
              animation: "letterDrop 0.6s cubic-bezier(0.22,1,0.36,1) both",
              animationDelay: "0.4s",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              style={{
                width: "0.82em",
                height: "0.82em",
                filter:
                  "drop-shadow(0 0 12px rgba(34,197,94,0.9)) drop-shadow(0 0 32px rgba(34,197,94,0.5))",
                overflow: "visible",
              }}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* ╲ bar: top-left → bottom-right */}
              <polygon points="0,0  28,0  100,100  72,100" fill="#22c55e" />
              {/* ╱ bar: top-right → bottom-left */}
              <polygon points="72,0 100,0  28,100   0,100" fill="#22c55e" />
              {/* centre overlap — brighten the cross */}
              <polygon points="40,36 60,36 60,64 40,64" fill="#6ee7a0" opacity="0.55" />
            </svg>
          </span>
        </div>

        {/* PRODUCTION — width 100% of wrapper = exactly LENUX word width */}
        <div
          style={{
            marginTop: "5px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "'Arial', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(9px, 2vw, 13px)",
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0px",
            textTransform: "uppercase" as const,
            animation: "fadeInUp 0.7s ease both",
            animationDelay: "0.65s",
          }}
        >
          {"PRODUCTION".split("").map((ch, i) => (
            <span key={i} style={{ display: "inline-block" }}>{ch}</span>
          ))}
        </div>

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
