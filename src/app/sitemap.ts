import { MetadataRoute } from 'next';
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { Gallery } from "@/models/Gallery";
import { JobVacancy } from "@/models/JobVacancy";
import { ServiceCategory } from "@/models/ServiceCategory";
import { Service } from "@/models/Service";

export const dynamic = 'force-dynamic';

export async function generateSitemaps() {
  return [
    { id: 'pages' },
    { id: 'services' },
    { id: 'portfolio' },
    { id: 'careers' },
  ];
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lenux-production.vercel.app";

  try {
    await connectDB();

    // ──────────────────────────────────────────────────────────────────────────
    // 1. Pages Sitemap (/sitemap/pages.xml)
    // ──────────────────────────────────────────────────────────────────────────
    if (id === 'pages') {
      const staticPages = [
        { route: '', priority: 1.0, changeFrequency: 'weekly' as const },
        { route: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
        { route: '/services', priority: 0.9, changeFrequency: 'weekly' as const },
        { route: '/portfolio', priority: 0.9, changeFrequency: 'weekly' as const },
        { route: '/gallery', priority: 0.8, changeFrequency: 'weekly' as const },
        { route: '/team', priority: 0.7, changeFrequency: 'monthly' as const },
        { route: '/careers', priority: 0.8, changeFrequency: 'weekly' as const },
        { route: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
      ];

      return staticPages.map((page) => ({
        url: `${baseUrl}${page.route}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      }));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. Services Sitemap (/sitemap/services.xml)
    // ──────────────────────────────────────────────────────────────────────────
    if (id === 'services') {
      const [categoriesDoc, servicesDoc] = await Promise.all([
        ServiceCategory.find({ isActive: true }).select('name slug updatedAt').lean(),
        Service.find({ isActive: true }).select('title slug updatedAt').lean(),
      ]);

      const mainServicesPage = {
        url: `${baseUrl}/services`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const categoryRoutes = categoriesDoc.map((cat: any) => ({
        url: `${baseUrl}/portfolio?category=${encodeURIComponent(cat.name)}`,
        lastModified: cat.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serviceRoutes = servicesDoc.map((ser: any) => ({
        url: `${baseUrl}/portfolio?service=${encodeURIComponent(ser.title)}`,
        lastModified: ser.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

      return [mainServicesPage, ...categoryRoutes, ...serviceRoutes];
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. Portfolio Sitemap (/sitemap/portfolio.xml)
    // ──────────────────────────────────────────────────────────────────────────
    if (id === 'portfolio') {
      const [projectsDoc, galleryDoc] = await Promise.all([
        Portfolio.find({ isPublished: true }).select('slug updatedAt').lean(),
        Gallery.find({ slug: { $exists: true, $ne: null } }).select('slug updatedAt').lean(),
      ]);

      const mainPortfolioPage = {
        url: `${baseUrl}/portfolio`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const projectRoutes = projectsDoc.map((proj: any) => ({
        url: `${baseUrl}/portfolio/${proj.slug}`,
        lastModified: proj.updatedAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const galleryRoutes = galleryDoc.map((item: any) => ({
        url: `${baseUrl}/gallery/${item.slug}`,
        lastModified: item.updatedAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

      return [mainPortfolioPage, ...projectRoutes, ...galleryRoutes];
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. Careers Sitemap (/sitemap/careers.xml)
    // ──────────────────────────────────────────────────────────────────────────
    if (id === 'careers') {
      const vacanciesDoc = await JobVacancy.find({ isActive: true })
        .select('slug updatedAt')
        .lean();

      const mainCareersPage = {
        url: `${baseUrl}/careers`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vacancyRoutes = vacanciesDoc.map((vac: any) => ({
        url: `${baseUrl}/careers/${vac.slug}`,
        lastModified: vac.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

      return [mainCareersPage, ...vacancyRoutes];
    }
  } catch (error) {
    console.error(`Error generating sitemap for id ${id}:`, error);
  }

  return [];
}