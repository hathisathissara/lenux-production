import Image from "next/image";
import Link from "next/link";

import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";
import { JobVacancy } from "@/models/JobVacancy";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";

import { 
  Sparkles, Briefcase, MapPin, Clock,
  MessageCircle, Mail
} from "lucide-react";

interface IJob {
  _id: string;
  slug: string;
  title: string;
  department: string;
  jobType: string;
  location: string;
  description: string;
  requirements: string;
  salary: string;
  deadline?: string;
  isActive: boolean;
}

export const dynamic = "force-dynamic";

export const metadata = {
  alternates: {
    canonical: "/careers",
  },
  title: "Careers & Job Vacancies | Lenux Production Sri Lanka",
  description: "Join the creative visual production team at Lenux Production. Explore career opportunities in graphic design, digital printing, signboard manufacturing, and advertising.",
};

async function getCareersData() {
  await connectDB();
  const [settingsDoc, jobsDoc] = await Promise.all([
    ContactInformation.findOne().lean(),
    JobVacancy.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
  ]);

  const settings = settingsDoc ? JSON.parse(JSON.stringify(settingsDoc)) : null;
  const jobs = jobsDoc ? JSON.parse(JSON.stringify(jobsDoc)) : [];

  return { settings, jobs };
}

export default async function CareersPage() {
  const { settings, jobs } = await getCareersData();

  const phone = settings?.phone;
  const hours = settings?.businessHours;
  const companyName = settings?.companyName;
  const email = settings?.email;
  const whatsapp = settings?.whatsapp;
  const cleanWhatsapp = whatsapp ? whatsapp.replace(/[^0-9]/g, "") : "";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* Header */}
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* ==========================================
          CAREERS HERO BANNER
          ========================================== */}
      <section className="relative w-full pt-40 pb-20 bg-gradient-to-b from-[#091712] via-black to-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image src="/images/hero-bg.png" alt="Careers Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lenux-emerald/30 bg-lenux-emerald/10 text-lenux-emerald text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> Join The Creative Force
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight">
              Build Your Career at <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 bg-clip-text text-transparent">Lenux</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Join a skilled team dedicated to precision printing, impactful branding, and innovative visual solutions across Sri Lanka.
            </p>
          </ScrollReveal>
        </div>
      </section>


      {/* ==========================================
          OPEN JOB VACANCIES LISTING
          ========================================== */}
      <section className="py-24 bg-black border-t border-white/5 relative" id="openings">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">Explore Openings</span>
              <h3 className="text-3xl sm:text-5xl font-extrabold text-white uppercase">
                Current <span className="text-lenux-emerald">Job Vacancies</span>
              </h3>
              <p className="text-gray-400 text-sm font-light">
                Find the right opportunity to grow your skills and contribute to our visual productions.
              </p>
            </div>
          </ScrollReveal>

          {jobs.length === 0 ? (
            <div className="bg-[#090909] rounded-3xl p-16 text-center border border-white/5 space-y-4 max-w-xl mx-auto">
              <Briefcase size={48} className="mx-auto text-lenux-emerald opacity-50" />
              <h4 className="text-xl font-bold text-white">No Open Vacancies Right Now</h4>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                We are not actively hiring for a specific role at this moment. However, we always welcome talented designers and technicians! Send your CV below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {jobs.map((job: IJob) => (
                <ScrollReveal key={job._id}>
                  <Link
                    href={`/careers/${job.slug}`}
                    className="block rounded-3xl bg-[#090909] border border-white/5 p-7 hover:border-lenux-emerald/50 transition-all duration-500 shadow-xl group h-full"
                  >
                    {/* Department badge */}
                    <span className="text-[10px] font-bold text-lenux-emerald uppercase tracking-widest bg-lenux-emerald/10 px-3 py-1 rounded-full border border-lenux-emerald/30 inline-block mb-3">
                      {job.department}
                    </span>

                    {/* Title */}
                    <h4 className="text-xl font-bold text-white group-hover:text-lenux-emerald transition-colors mb-4">
                      {job.title}
                    </h4>

                    {/* Meta tags */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                        <Clock size={12} className="text-lenux-emerald" /> {job.jobType}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                        <MapPin size={12} className="text-lenux-emerald" /> {job.location}
                      </span>
                    </div>

                    {/* Description preview */}
                    <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-3 mb-5">
                      {job.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs text-gray-400">
                        Salary: <strong className="text-white">{job.salary}</strong>
                      </span>
                      <span className="text-xs font-bold text-lenux-emerald uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        View Details →
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ==========================================
          OPEN SPECULATIVE CV SUBMISSION BANNER
          ========================================== */}
      <section className="py-20 bg-gradient-to-r from-[#06241a] via-[#081f17] to-[#040e0a] border-t border-lenux-emerald/30 relative text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <ScrollReveal>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
              Don’t See a Matching Role? <span className="text-lenux-emerald">Send Us Your CV Anyway!</span>
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
              We are constantly expanding our printing, graphic design, and on-site branding operations. Drop your resume directly to our HR contact.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Hi Lenux Production, I would like to submit my CV for future opportunities.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3 bg-lenux-emerald text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-dark shadow-xl transition-all inline-flex items-center gap-2"
              >
                <MessageCircle size={15} /> WhatsApp Your CV
              </a>
              <a
                href={`mailto:${email}?subject=${encodeURIComponent("Open Application / CV - Lenux Production")}`}
                className="px-7 py-3 border border-emerald-400/40 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lenux-emerald hover:text-white transition-all inline-flex items-center gap-2"
              >
                <Mail size={15} /> Email Your CV
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}