import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden font-sans">
      
      {/* Background Deep Green Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lenux-emerald/5 rounded-full blur-[140px] pointer-events-none" />

      {/* 🌟 Background Giant Watermark "404"*/}
      <span className="absolute text-[13rem] md:text-[22rem] font-black text-white/[0.04] select-none pointer-events-none z-0 tracking-wider">
        404
      </span>

      <div className="max-w-md w-full text-center space-y-8 relative z-10 border border-white/5 bg-[#090909]/40 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
        
        {/* Glowing Help Icon */}
        <div className="w-20 h-20 rounded-3xl bg-lenux-emerald/10 border border-lenux-emerald/30 flex items-center justify-center text-lenux-emerald mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <HelpCircle size={44} className="stroke-[1.5]" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-lenux-emerald uppercase tracking-widest border border-lenux-emerald/20 bg-lenux-emerald/5 px-3 py-1 rounded-full">
            Page Not Found
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-wide uppercase">
            Lost in Space?
          </h1>
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <Link 
            href="/" 
            className="w-full py-4 bg-lenux-emerald hover:bg-lenux-dark text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-lenux-emerald/10"
          >
            <ArrowLeft size={16} /> Return to Homepage
          </Link>
          
          <Link 
            href="/contact" 
            className="w-full py-3.5 border border-white/10 hover:border-white/20 text-gray-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center"
          >
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
}