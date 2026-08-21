import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Vercel හි ඇති Environment Variables වල http:// ලෙස සටහන් වී ඇති නිසා Sitemap එකේ http හැදේ.
  // ඒක මගහරවා ගැනීමට මෙතන කෙලින්ම https://lenux-production.vercel.app ලබා දී ඇත.
  const baseUrl = 'https://lenux-production.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Protect admin panel and API routes from being indexed
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
