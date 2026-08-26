import { MetadataRoute } from 'next';
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { Gallery } from "@/models/Gallery";

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/portfolio',
    '/gallery',
    '/team',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    await connectDB();

    // Portfolio Single Pages
    const projects = await Portfolio.find({}).select('slug updatedAt').lean();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const portfolioRoutes = projects.map((project: any) => ({
      url: `${baseUrl}/portfolio/${project.slug}`,
      lastModified: project.updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Gallery Single Pages (slug තියෙන ඒවට විතරයි)
    const galleryItems = await Gallery.find({ slug: { $exists: true, $ne: null } })
      .select('slug updatedAt')
      .lean();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const galleryRoutes = galleryItems.map((item: any) => ({
      url: `${baseUrl}/gallery/${item.slug}`,
      lastModified: item.updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    dynamicRoutes = [...portfolioRoutes, ...galleryRoutes];
  } catch (error) {
    console.error("Error generating sitemap dynamic routes:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}