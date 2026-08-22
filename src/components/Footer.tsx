import Link from "next/link";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";

// Inline Build-Safe SVGs for Footer Socials
const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
);
const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);
const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);
const TiktokIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
);

export default async function Footer() {
  await connectDB();
  const settings = await ContactInformation.findOne().lean();
  const data = settings ? JSON.parse(JSON.stringify(settings)) : null;

  const companyName = data?.companyName || "LENUX PRODUCTION (PVT) LTD";
  const phone = data?.phone || "+94 76 565 0798";
  const email = data?.email || "lenuxproduction12@gmail.com";
  const address = data?.address || "No:75/6 Dewala Road Moratuwa. Katubedda , Moratuwa Sri Lanka";


  return (
    <footer className="bg-[#040404] border-t border-white/10 pt-12 md:pt-16 pb-8 md:pb-12 text-sm text-gray-400 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 pb-8 md:pb-12 border-b border-white/5">
        
        {/* Company Intro */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xl font-bold text-white tracking-wider uppercase">{companyName}</h4>
          <p className="text-xs text-lenux-emerald font-semibold uppercase tracking-widest">Design, Print & Production</p>
          <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
            Sri Lanka&apos;s leading visual advertising and branding partner, creating impactful printing, signboards, displays, and event solutions.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h5 className="text-white font-bold text-xs uppercase tracking-widest">Quick Links</h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-lenux-emerald transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-lenux-emerald transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-lenux-emerald transition-colors">All Services</Link></li>
            <li><Link href="/portfolio" className="hover:text-lenux-emerald transition-colors">Portfolio</Link></li>
            <li><Link href="/gallery" className="hover:text-lenux-emerald transition-colors">Gallery</Link></li>
            <li><Link href="/team" className="hover:text-lenux-emerald transition-colors">Our Team</Link></li>
            <li><Link href="/contact" className="hover:text-lenux-emerald transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Top Services */}
        <div className="space-y-3">
          <h5 className="text-white font-bold text-xs uppercase tracking-widest">Top Services</h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/services" className="hover:text-lenux-emerald transition-colors">Digital Printing</Link></li>
            <li><Link href="/services" className="hover:text-lenux-emerald transition-colors">Offset Printing</Link></li>
            <li><Link href="/services" className="hover:text-lenux-emerald transition-colors">Vehicle Branding</Link></li>
            <li><Link href="/services" className="hover:text-lenux-emerald transition-colors">Board & Signage</Link></li>
            <li><Link href="/services" className="hover:text-lenux-emerald transition-colors">Event Services</Link></li>
          </ul>
        </div>

        {/* Get In Touch & Socials */}
        <div className="space-y-3">
          <h5 className="text-white font-bold text-xs uppercase tracking-widest">Get In Touch</h5>
          <p className="text-xs">{phone}</p>
          <p className="text-xs">{email}</p>
          <p className="text-xs">{address}</p>
          <div className="flex gap-3 pt-2">
            <a href={data?.facebook || "#"} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-lenux-emerald hover:text-white transition-all"><FacebookIcon /></a>
            <a href={data?.instagram || "#"} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-lenux-emerald hover:text-white transition-all"><InstagramIcon /></a>
            <a href={data?.linkedin || "#"} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-lenux-emerald hover:text-white transition-all"><LinkedinIcon /></a>
            {data?.tiktok && (
              <a href={data.tiktok} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-lenux-emerald hover:text-white transition-all"><TiktokIcon /></a>
            )}
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Lenux Production. All Rights Reserved.</p>
          <p className="text-[11px]">Crafted with Premium Brand Precision.</p>
        </div>
    </footer>
  );
}