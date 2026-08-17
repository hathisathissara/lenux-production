import type { Metadata } from "next";
import "./globals.css";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";

// 🌟 .env.local එකෙන් SITE_URL ලබාගැනීම (Fallback එකක් ලෙස Vercel URL එක ලබා දී ඇත)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lenux-production.vercel.app";

// Dynamically Generate Website Title & Favicon Icon from Database Settings
export async function generateMetadata(): Promise<Metadata> {
  let companyTitle = "Lenux Production";
  let logoUrl = `${SITE_URL}/images/logo.png`;

  try {
    await connectDB();
    const settings = await ContactInformation.findOne().lean();
    
    if (settings) {
      if (settings.companyName) {
        companyTitle = settings.companyName;
      }
      if (settings.logo?.url) {
        const rawLogo = settings.logo.url;
        logoUrl = rawLogo.startsWith("http") 
          ? rawLogo 
          : `${SITE_URL}${rawLogo.startsWith("/") ? "" : "/"}${rawLogo}`;
      }
    }
  } catch (error) {
    console.error("Metadata fetch error:", error);
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${companyTitle} | Design, Print & Production`,
      template: `%s | ${companyTitle}`
    },
    description: "Creative Advertising, Dynamic Branding, and visual production solutions in Sri Lanka.",
    icons: {
      icon: logoUrl,
      shortcut: logoUrl,
      apple: logoUrl,
    },
    openGraph: {
      title: `${companyTitle} | Design, Print & Production`,
      description: "Creative Advertising, Dynamic Branding, and visual production solutions in Sri Lanka.",
      url: SITE_URL,
      siteName: companyTitle,
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: `${companyTitle} - Creative Advertising & Production`,
          type: "image/png",
        }
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${companyTitle} | Design, Print & Production`,
      description: "Creative Advertising, Dynamic Branding, and visual production solutions in Sri Lanka.",
      images: [logoUrl],
    }
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}