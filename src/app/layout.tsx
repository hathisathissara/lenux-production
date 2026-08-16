import type { Metadata } from "next";
import "./globals.css";
import { connectDB } from "@/lib/db";
import { ContactInformation } from "@/models/ContactInformation";

// Dynamically Generate Website Title & Favicon Icon from Database Settings
export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectDB();
    const settings = await ContactInformation.findOne();
    
    const title = settings?.companyName || "Lenux Production";
    const logoUrl = settings?.logo?.url || "/favicon.ico"; // Default icon if logo not uploaded yet

    return {
      title: {
        default: `${title} | Design, Print & Production`,
        template: `%s | ${title}`
      },
      description: "Creative Advertising, Dynamic Branding, and visual production solutions in Sri Lanka.",
      icons: {
        icon: logoUrl, // අප්ලෝඩ් කරපු Logo එක Dynamic Favicon එක විදියට සෙට් වෙනවා!
        shortcut: logoUrl,
        apple: logoUrl,
      }
    };
  } catch (error) {
    return {
      title: "Lenux Production | Design, Print & Production",
      icons: "/favicon.ico"
    };
  }
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