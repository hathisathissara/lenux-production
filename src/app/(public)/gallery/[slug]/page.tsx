import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Gallery } from "@/models/Gallery";
import { ContactInformation } from "@/models/ContactInformation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = await getGalleryItem(slug);

  if (!item) {
    return { title: "Gallery Item Not Found | Lenux Production" };
  }

  const titleText = item.title || item.category || "Gallery Item";

  return {
    title: `${titleText} | Lenux Production`,
    description: item.description?.substring(0, 160) || "View our creative production work at Lenux Production.",
    openGraph: {
      images: item.image?.url ? [{ url: item.image.url }] : [],
    },
  };
}

async function getGalleryItem(slug: string) {
  await connectDB();
  const item = await Gallery.findOne({ slug }).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

async function getSettings() {
  await connectDB();
  const settingsDoc = await ContactInformation.findOne().lean();
  return settingsDoc ? JSON.parse(JSON.stringify(settingsDoc)) : null;
}

export default async function GalleryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [galleryItem, settings] = await Promise.all([
    getGalleryItem(slug),
    getSettings(),
  ]);

  if (!galleryItem) {
    notFound();
  }

  const phone = settings?.phone || "+94 77 123 4567";
  const hours = settings?.businessHours || "Monday - Saturday: 8:30 AM - 5:30 PM";
  const companyName = settings?.companyName || "LENUX PRODUCTION (PVT) LTD";

  const titleText = galleryItem.title || galleryItem.category || "Gallery Item";

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-between overflow-x-hidden font-sans">
      <Header phone={phone} hours={hours} companyName={companyName} />

      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto space-y-12">

          <Link href="/#featured-gallery" className="inline-flex items-center gap-2 text-lenux-emerald hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-lenux-emerald tracking-wide leading-tight">
              {titleText}
            </h1>
          </div>

          <div className="relative w-full aspect-video md:aspect-[21/9] bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">
            <Image
              src={galleryItem.image?.url}
              alt={titleText}
              fill
              className="object-contain"
              priority
            />
          </div>

          {galleryItem.description && (
            <div className="bg-[#1a1a1a] p-8 md:p-12 rounded-lg border border-white/5 space-y-6">
              {galleryItem.description.split('\n').map((paragraph: string, index: number) => {
                const isFirst = index === 0;
                const isBullet = paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•');

                if (isBullet) {
                  return (
                    <ul key={index} className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>{paragraph.replace(/^[-•]\s*/, '')}</li>
                    </ul>
                  );
                }

                return (
                  <p
                    key={index}
                    className={`${isFirst ? "text-xl md:text-2xl font-bold text-white italic" : "text-gray-300 leading-relaxed"}`}
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}