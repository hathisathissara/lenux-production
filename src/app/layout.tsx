import type { Metadata } from "next";
import "./globals.css";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";

// 🌟 .env.local එකෙන් SITE_URL ලබාගැනීම (නැතහොත් Default Vercel URL එක)
// Vercel හි ඇති Environment Variables වල http:// ලෙස සටහන් වී ඇති නිසා Sitemap එකේ http හැදේ.
// ඒක මගහරවා ගැනීමට මෙතන කෙලින්ම https://lenux-production.vercel.app ලබා දී ඇත.
const SITE_URL = 'https://lenux-production.vercel.app';

// 🌟 WhatsApp සහ Social Media වල Link Preview පෙන්වීම සඳහා Metadata ජනනය කිරීම
export async function generateMetadata(): Promise<Metadata> {
  let companyTitle = "Lenux Production";
  let logoUrl = `${SITE_URL}/images/logo.png`; // Fallback image

  try {
    await connectDB();
    const settings = await ContactInformation.findOne().lean();

    if (settings) {
      if (settings.companyName) {
        companyTitle = settings.companyName;
      }
      if (settings.logo?.url) {
        const rawLogo = settings.logo.url;
        // Absolute URL එකක් බවට පත් කිරීම (WhatsApp වලට Absolute URL අත්‍යවශ්‍ය වේ)
        logoUrl = rawLogo.startsWith("http")
          ? rawLogo
          : `${SITE_URL}${rawLogo.startsWith("/") ? "" : "/"}${rawLogo}`;
      }
    }
  } catch (error) {
    console.error("Metadata fetch error:", error);
  }

  const siteDescription = "Lenux Production is Sri Lanka's leading creative advertising and branding partner, providing high-quality digital printing, signboards, displays, and event solutions.";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${companyTitle} | Design, Print & Production`,
      template: `%s | ${companyTitle}`
    },
    description: siteDescription,
    icons: {
      icon: logoUrl,
      shortcut: logoUrl,
      apple: logoUrl,
    },
    verification: {
      google: "I1hW3W_RUL-5fgeKdm6qdG-ZrFP5pSUVx_ibnFak5QI",
    },
    // 🌟 WhatsApp සහ Facebook OpenGraph (OG) Tags
    openGraph: {
      title: `${companyTitle} | Design, Print & Production`,
      description: siteDescription,
      url: SITE_URL,
      siteName: companyTitle,
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630, // WhatsApp/Facebook Standard Share Image Size
          alt: `${companyTitle} - Creative Advertising & Production`,
          type: "image/png",
        }
      ],
      type: 'website',
      locale: 'en_US',
    },
    // 🌟 Twitter / X Card Tags
    twitter: {
      card: 'summary_large_image',
      title: `${companyTitle} | Design, Print & Production`,
      description: siteDescription,
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