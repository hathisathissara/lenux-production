import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Protect admin panel and API routes from being indexed
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap/pages.xml`,
      `${baseUrl}/sitemap/portfolio.xml`,
      `${baseUrl}/sitemap/gallery.xml`,
      `${baseUrl}/sitemap/careers.xml`,
    ],
  };
}
