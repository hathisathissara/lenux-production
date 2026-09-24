import { MetadataRoute } from 'next';
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { JobVacancy } from "@/models/JobVacancy";

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  try {
    await connectDB();

    // 2. Dynamic Portfolio projects
    const projectsDoc = await Portfolio.find({
      isPublished: true,
      slug: { $exists: true, $ne: null },
    })
      .select('slug updatedAt')
      .lean();

    type SlugDocItem = { slug: string; updatedAt?: Date };

    const projectRoutes: MetadataRoute.Sitemap = (projectsDoc as unknown as SlugDocItem[])
      .filter((proj) => proj.slug && proj.slug.trim() !== '')
      .map((proj) => ({
        url: `${baseUrl}/portfolio/${proj.slug}`,
        lastModified: proj.updatedAt || new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      }));

    // 3. Dynamic Careers vacancies
    const vacanciesDoc = await JobVacancy.find({
      isActive: true,
      slug: { $exists: true, $ne: null },
    })
      .select('slug updatedAt')
      .lean();

    const vacancyRoutes: MetadataRoute.Sitemap = (vacanciesDoc as unknown as SlugDocItem[])
      .filter((vac) => vac.slug && vac.slug.trim() !== '')
      .map((vac) => ({
        url: `${baseUrl}/careers/${vac.slug}`,
        lastModified: vac.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    return [...staticPages, ...projectRoutes, ...vacancyRoutes];
  } catch (error) {
    console.error("Error generating unified sitemap:", error);
    return staticPages;
  }
}