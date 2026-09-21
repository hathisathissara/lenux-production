import { MetadataRoute } from 'next';
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { Gallery } from "@/models/Gallery";
import { JobVacancy } from "@/models/JobVacancy";

export const dynamic = 'force-dynamic';

export async function generateSitemaps() {
  return [
    { id: 'pages' },
    { id: 'portfolio' },
    { id: 'gallery' },
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
    // 2. Portfolio Sitemap (/sitemap/portfolio.xml)
    // ──────────────────────────────────────────────────────────────────────────
    if (id === 'portfolio') {
      const projectsDoc = await Portfolio.find({
        isPublished: true,
        slug: { $exists: true, $ne: null },
      })
        .select('slug updatedAt')
        .lean();

      const mainPortfolioPage = {
        url: `${baseUrl}/portfolio`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      };

      type SlugDocItem = { slug: string; updatedAt?: Date };

      const projectRoutes = (projectsDoc as unknown as SlugDocItem[]).map((proj) => ({
        url: `${baseUrl}/portfolio/${proj.slug}`,
        lastModified: proj.updatedAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }));

      return [mainPortfolioPage, ...projectRoutes];
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. Gallery Sitemap (/sitemap/gallery.xml)
    // ──────────────────────────────────────────────────────────────────────────
    if (id === 'gallery') {
      const galleryDoc = await Gallery.find({
        slug: { $exists: true, $ne: null, $nin: ['', null] },
      })
        .select('slug updatedAt')
        .lean();

      const mainGalleryPage = {
        url: `${baseUrl}/gallery`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };

      type SlugDocItem = { slug: string; updatedAt?: Date };

      const galleryRoutes = (galleryDoc as unknown as SlugDocItem[]).map((item) => ({
        url: `${baseUrl}/gallery/${item.slug}`,
        lastModified: item.updatedAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

      return [mainGalleryPage, ...galleryRoutes];
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. Careers Sitemap (/sitemap/careers.xml)
    // ──────────────────────────────────────────────────────────────────────────
    if (id === 'careers') {
      const vacanciesDoc = await JobVacancy.find({ isActive: true, slug: { $exists: true, $ne: null } })
        .select('slug updatedAt')
        .lean();

      const mainCareersPage = {
        url: `${baseUrl}/careers`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      };

      type VacancyItem = { slug: string; updatedAt?: Date };

      const vacancyRoutes = (vacanciesDoc as unknown as VacancyItem[]).map((vac) => ({
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