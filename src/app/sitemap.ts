import { MetadataRoute } from 'next';
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";

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

  // 2. Dynamic Routes (Portfolio Single Pages)
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  
  try {
    await connectDB();
    const projects = await Portfolio.find({}).select('slug updatedAt').lean();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dynamicRoutes = projects.map((project: any) => ({
      url: `${baseUrl}/portfolio/${project.slug}`,
      lastModified: project.updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error generating sitemap dynamic routes:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
