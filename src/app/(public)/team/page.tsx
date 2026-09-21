import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";
import { Staff } from "@/models/Staff";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import StaffCard from "@/components/StaffCard"; 

import { Sparkles, Award } from "lucide-react";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

async function getTeamData() {
  await connectDB();
  const [settingsDoc, staffListDoc] = await Promise.all([
    ContactInformation.findOne().lean(),
    Staff.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
  ]);

  const settings = settingsDoc ? JSON.parse(JSON.stringify(settingsDoc)) : null;
  const staffList = staffListDoc ? JSON.parse(JSON.stringify(staffListDoc)) : [];

  return { settings, staffList };
}

export default async function TeamPage() {
  const { settings, staffList } = await getTeamData();

  const phone = settings?.phone;
  const hours = settings?.businessHours;
  const companyName = settings?.companyName;


  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* 🌟 1. Header */}
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* ==========================================
          TEAM HERO BANNER
          ========================================== */}
      <section className="relative w-full pt-40 pb-20 bg-gradient-to-b from-[#091712] via-black to-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image src="/images/hero-bg.png" alt="Team Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lenux-emerald/30 bg-lenux-emerald/10 text-lenux-emerald text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> The Creative Force
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight">
              Meet Our <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 bg-clip-text text-transparent">Team</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              The skilled minds, designers, and dedicated production professionals behind Lenux Production.
            </p>
          </ScrollReveal>
        </div>
      </section>
      {/* ==========================================
          🌟 FULL TEAM SHOWCASE GRID (Cleaned up heading)
          ========================================== */}
      <section className="py-28 bg-[#040404] relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          {staffList.length === 0 ? (
            <div className="bg-[#0a0a0a] rounded-3xl p-16 text-center border border-white/5 space-y-4 max-w-xl mx-auto">
              <Award size={48} className="mx-auto text-lenux-emerald opacity-60" />
              <h4 className="text-xl font-bold text-white">No Team Members Found</h4>
              <p className="text-sm text-gray-400 font-light">
                Active staff members will appear here once added from the Admin Dashboard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {staffList.map((member: any) => (
                <ScrollReveal key={member._id}>
                  <StaffCard member={member} />
                </ScrollReveal>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ==========================================
          CTA BANNER
          ========================================== */}
      {/* ==========================================
          🌟 CAREERS CTA BANNER
          ========================================== */}
      <section className="py-24 bg-gradient-to-r from-[#06241a] via-[#081f17] to-[#040e0a] border-t border-lenux-emerald/30 relative text-center">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-lenux-emerald/20 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <ScrollReveal>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white">
              Want to Join the <br /><span className="text-lenux-emerald">Lenux Team?</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
              Explore current career opportunities and become part of our creative journey.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link 
                href="/careers" 
                className="px-8 py-4 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark shadow-xl shadow-lenux-emerald/30 transition-all duration-300 inline-flex items-center gap-2"
              >
                View Career Opportunities <span className="text-base leading-none">→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

     <Footer />

    </div>
  );
}