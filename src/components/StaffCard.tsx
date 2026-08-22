"use client";

import { useState } from "react";
import Image from "next/image";

// Inline Build-Safe SVGs
const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
);
const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);
const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);
const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StaffCard({ member }: { member: any }) {
  // Mobile එකේදී Touch කළ විට විස්තර toggle වීමට state එකක්
  const [isActive, setIsActive] = useState(false);

  return (
    <div 
      onClick={() => setIsActive(!isActive)}
      className="relative w-full h-[450px] rounded-[2.2rem] overflow-hidden group cursor-pointer border border-white/10 hover:border-lenux-emerald/60 shadow-2xl transition-all duration-700 bg-[#080808]"
    >
      {/* 🌟 1. Full-Bleed Profile Photo (කාඩ් එකේ මායිම දක්වාම පිරී පවතී) */}
      <Image 
        src={member.photo.url} 
        alt={member.name} 
        fill 
        className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      />

      {/* Subtle Gradient Shadow Base */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent z-10" />

      {/* 🌟 2. Interactive Slide-Up Overlay (Desktop Hover හෝ Mobile Touch කළ විට විවෘත වේ) */}
      <div 
        className={`absolute inset-x-0 bottom-0 z-20 p-6 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-[3px] transition-all duration-500 ease-out flex flex-col justify-end ${
          isActive 
          ? "translate-y-0" 
          : "translate-y-[calc(100%-80px)] lg:group-hover:translate-y-0"
        }`}
      >
        {/* Name and Position Header (සැමවිටම පෙනේ) */}
        <div className="space-y-1">
          <h4 className="text-xl font-bold text-white tracking-wide group-hover:text-lenux-emerald transition-colors">
            {member.name}
          </h4>
          <p className="text-xs font-semibold uppercase tracking-wider text-lenux-emerald">
            {member.position}
          </p>
        </div>

        {/* 🌟 Hidden Section (Hover / Touch කළ විට දිගහැරෙන කොටස: Bio + Social Links) */}
        <div className="space-y-4 pt-4 mt-2 border-t border-white/10">
          {member.bio ? (
            <p className="text-xs text-gray-300 font-light leading-relaxed line-clamp-3">
              {member.bio}
            </p>
          ) : (
            <p className="text-xs text-gray-400 font-light italic">
              Creative specialist at Lenux Production.
            </p>
          )}

          {/* Social Profile Links */}
          <div className="flex items-center gap-2.5 pt-1 text-gray-300">
            {member.socialLinks?.facebook && (
              <a 
                href={member.socialLinks.facebook} 
                target="_blank" 
                onClick={(e) => e.stopPropagation()} 
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all shadow-md"
              >
                <FacebookIcon />
              </a>
            )}
            {member.socialLinks?.instagram && (
              <a 
                href={member.socialLinks.instagram} 
                target="_blank" 
                onClick={(e) => e.stopPropagation()} 
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-all shadow-md"
              >
                <InstagramIcon />
              </a>
            )}
            {member.socialLinks?.linkedin && (
              <a 
                href={member.socialLinks.linkedin} 
                target="_blank" 
                onClick={(e) => e.stopPropagation()} 
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-blue-700 hover:text-white flex items-center justify-center transition-all shadow-md"
              >
                <LinkedinIcon />
              </a>
            )}
            {member.socialLinks?.whatsapp && (
              <a 
                href={`https://wa.me/${member.socialLinks.whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '94')}`}
                target="_blank" 
                onClick={(e) => e.stopPropagation()} 
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all shadow-md"
              >
                <WhatsAppIcon />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}