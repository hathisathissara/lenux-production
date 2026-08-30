"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface TestimonialsSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  feedbacks: any[];
}

export default function TestimonialsSection({ feedbacks }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play Slideshow (තත්පර 6 කට වරක් auto මාරු වේ)
  useEffect(() => {
    if (!feedbacks || feedbacks.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % feedbacks.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [feedbacks]);

  // කිසිම feedback එකක් නැත්නම් මේ section එක පෙන්වන්නේ නැත
  if (!feedbacks || feedbacks.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? feedbacks.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % feedbacks.length);
  };

  const current = feedbacks[currentIndex];

  return (
    <section className="py-28 bg-[#030303] border-t border-white/5 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-lenux-emerald/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Client Testimonials</span>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-wide uppercase">
            What Our Clients <span className="text-lenux-emerald">Say</span>
          </h3>
          <p className="text-gray-400 text-sm font-light">
            Trusted by businesses across Sri Lanka for quality printing, branding, and visual production.
          </p>
        </div>

        {/* 🌟 Slideshow Card Container */}
        <div className="relative bg-[#090909] border border-white/10 rounded-[2.5rem] p-8 sm:p-14 shadow-2xl overflow-hidden transition-all duration-700">
          
          <div className="absolute top-6 right-8 text-lenux-emerald/10 pointer-events-none">
            <Quote size={60} />
          </div>

          <div key={currentIndex} className="min-h-[220px] flex flex-col justify-between relative z-10 space-y-8 animate-fade-in">
            
            {/* Rating Stars & Comment */}
            <div className="space-y-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < current.rating ? "fill-amber-400 text-amber-400" : "text-gray-700"} 
                  />
                ))}
              </div>

              <p className="text-base sm:text-xl text-gray-200 font-light leading-relaxed italic">
                &quot;{current.comment}&quot;
              </p>
            </div>

            {/* Author info & Navigation Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-white/5">
              
              {/* Customer Avatar + Name */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-800 border border-white/10 shrink-0">
                  <Image 
                    src={current.avatar?.url || "/images/hero-bg.jpg"} 
                    alt={current.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div>
                  <p className="font-bold text-white text-base">{current.name}</p>
                  {current.designation && <p className="text-xs text-gray-400">{current.designation}</p>}
                </div>
              </div>

              {/* Slider Arrows & Dots */}
              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="flex gap-1.5 mr-2">
                  {feedbacks.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative flex items-center justify-center min-w-[24px] min-h-[24px] bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-lenux-emerald rounded-full transition-all duration-300`}
                      aria-label={`Go to slide ${idx + 1}`}
                    >
                      <span className={`block h-2 rounded-full transition-all duration-300 ${
                        currentIndex === idx ? "w-6 bg-lenux-emerald" : "w-2 bg-white/20"
                      }`} />
                    </button>
                  ))}
                </div>

                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-lenux-emerald hover:text-white flex items-center justify-center text-gray-300 transition-all"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-lenux-emerald hover:text-white flex items-center justify-center text-gray-300 transition-all"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}