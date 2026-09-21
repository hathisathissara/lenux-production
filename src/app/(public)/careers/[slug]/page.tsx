import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";
import { JobVacancy } from "@/models/JobVacancy";
import type { Metadata } from "next";

import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";

import {
  Briefcase, MapPin, Clock, MessageCircle, Mail,
  ArrowLeft, CalendarDays, DollarSign, CheckCircle2,
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

// ── Dynamic metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  await connectDB();
  const { slug } = await params;
  const job = await JobVacancy.findOne({ slug, isActive: true }).lean();
  if (!job) return { title: "Job Not Found | Lenux Production" };
  const j = JSON.parse(JSON.stringify(job)) as IJob;
  return {
    alternates: {
      canonical: `/careers/${slug}`,
    },
    title: `${j.title} | Careers at Lenux Production`,
    description: `${j.department} · ${j.jobType} · ${j.location} — ${j.description.slice(0, 140)}…`,
  };
}

export const dynamic = "force-dynamic";

async function getJobData(slug: string) {
  await connectDB();
  const [settingsDoc, jobDoc] = await Promise.all([
    ContactInformation.findOne().lean(),
    JobVacancy.findOne({ slug, isActive: true }).lean(),
  ]);
  const settings = settingsDoc ? JSON.parse(JSON.stringify(settingsDoc)) : null;
  const job = jobDoc ? (JSON.parse(JSON.stringify(jobDoc)) as IJob) : null;
  return { settings, job };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { settings, job } = await getJobData(slug);

  if (!job) notFound();

  const phone = settings?.phone;
  const hours = settings?.businessHours;
  const companyName = settings?.companyName;
  const email = settings?.email;
  const whatsapp = settings?.whatsapp;
  const cleanWhatsapp = whatsapp ? whatsapp.replace(/[^0-9]/g, "") : "";

  const waText = encodeURIComponent(
    `Hi Lenux Production, I would like to apply for the position of "${job.title}". I have my CV ready.`
  );
  const mailSubject = encodeURIComponent(
    `Job Application: ${job.title} - Lenux Production`
  );
  const mailBody = encodeURIComponent(
    `Hi Lenux Production Recruitment Team,\n\nI am applying for the position of "${job.title}".\n\nPlease find my CV and details attached.\n\nThank you.`
  );

  // Split requirements into lines for bullet rendering
  const requirementLines = job.requirements
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      <Header phone={phone} hours={hours} companyName={companyName} />

      {/* ── HERO ── */}
      <section className="relative w-full pt-40 pb-16 bg-gradient-to-b from-[#091712] via-black to-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/hero-bg.png"
            alt="Job Detail Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <ScrollReveal>
            {/* Back link */}
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-xs font-bold text-lenux-emerald uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity"
            >
              <ArrowLeft size={14} /> Back to Careers
            </Link>

            {/* Department badge */}
            <div className="mb-4">
              <span className="text-[10px] font-bold text-lenux-emerald uppercase tracking-widest bg-lenux-emerald/10 px-3 py-1 rounded-full border border-lenux-emerald/30">
                {job.department}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              {job.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <Clock size={13} className="text-lenux-emerald" /> {job.jobType}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <MapPin size={13} className="text-lenux-emerald" /> {job.location}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <DollarSign size={13} className="text-lenux-emerald" /> {job.salary}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <Briefcase size={13} className="text-lenux-emerald" /> {job.department}
              </span>
              {job.deadline && (
                <span className="flex items-center gap-1.5 bg-red-900/20 px-3 py-1.5 rounded-xl border border-red-500/20 text-red-400">
                  <CalendarDays size={13} /> Deadline:{" "}
                  {new Date(job.deadline).toLocaleDateString("en-LK", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── DETAILS BODY ── */}
      <section className="py-20 bg-[#040404]">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT: Description + Requirements */}
          <div className="lg:col-span-2 space-y-10">
            <ScrollReveal>
              <div className="bg-[#090909] rounded-3xl border border-white/5 p-8 space-y-4">
                <h2 className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">
                  Role Overview
                </h2>
                <p className="text-gray-300 text-sm font-light leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-[#090909] rounded-3xl border border-white/5 p-8 space-y-4">
                <h2 className="text-xs font-bold text-lenux-emerald uppercase tracking-widest">
                  Requirements &amp; Qualifications
                </h2>
                <ul className="space-y-3">
                  {requirementLines.map((line, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-light">
                      <CheckCircle2
                        size={16}
                        className="text-lenux-emerald mt-0.5 shrink-0"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT: Apply sidebar */}
          <div className="space-y-6">
            <ScrollReveal>
              <div className="bg-[#090909] rounded-3xl border border-lenux-emerald/30 p-8 space-y-5 sticky top-28">
                <h3 className="text-lg font-extrabold text-white">
                  Apply for this Role
                </h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Send your CV directly via WhatsApp or Email. We typically respond within 2–3 working days.
                </p>

                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <MessageCircle size={16} /> Send CV on WhatsApp
                </a>

                {/* Email CTA */}
                <a
                  href={`mailto:${email}?subject=${mailSubject}&body=${mailBody}`}
                  className="w-full px-5 py-3.5 border border-white/10 hover:border-lenux-emerald hover:bg-lenux-emerald/10 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2"
                >
                  <Mail size={16} /> Send CV via Email
                </a>

                <div className="border-t border-white/5 pt-4 space-y-2 text-xs text-gray-500">
                  <p className="flex items-center gap-2">
                    <Briefcase size={13} className="text-lenux-emerald" />
                    {job.department}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={13} className="text-lenux-emerald" />
                    {job.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={13} className="text-lenux-emerald" />
                    {job.jobType}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
