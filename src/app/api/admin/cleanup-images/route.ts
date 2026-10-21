/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import cloudinary from '@/lib/cloudinary';

// Import All Models
import '@/models/ServiceCategory';
import '@/models/Service';
import '@/models/Portfolio';
import '@/models/Staff';
import '@/models/Gallery';
import '@/models/ContactInformation';
import '@/models/Feedback';
import '@/models/QuoteRequest';
import '@/models/ClientLogo';

import { ServiceCategory } from '@/models/ServiceCategory';
import { Service } from '@/models/Service';
import { Portfolio } from '@/models/Portfolio';
import { Staff } from '@/models/Staff';
import { Gallery } from '@/models/Gallery';
import { ContactInformation } from '@/models/ContactInformation';
import { Feedback } from '@/models/Feedback';
import { QuoteRequest } from '@/models/QuoteRequest';
import { ClientLogo } from '@/models/ClientLogo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    // 🌟 1. Database එකේ දැනට ඇත්තටම පාවිච්චි වෙන සියලුම publicId එකතු කරගැනීම
    const usedPublicIds = new Set<string>();

    // A. Service Categories
    const categories = await ServiceCategory.find({}, 'image.publicId').lean();
    categories.forEach((c: any) => c.image?.publicId && usedPublicIds.add(c.image.publicId));

    // B. Services
    const services = await Service.find({}, 'image.publicId gallery.publicId').lean();
    services.forEach((s: any) => {
      if (s.image?.publicId) usedPublicIds.add(s.image.publicId);
      s.gallery?.forEach((g: any) => g.publicId && usedPublicIds.add(g.publicId));
    });

    // C. Portfolio Projects
    const portfolios = await Portfolio.find({}, 'coverImage.publicId beforeImages.publicId productionImages.publicId installationImages.publicId gallery.publicId').lean();
    portfolios.forEach((p: any) => {
      if (p.coverImage?.publicId) usedPublicIds.add(p.coverImage.publicId);
      p.beforeImages?.forEach((img: any) => img.publicId && usedPublicIds.add(img.publicId));
      p.productionImages?.forEach((img: any) => img.publicId && usedPublicIds.add(img.publicId));
      p.installationImages?.forEach((img: any) => img.publicId && usedPublicIds.add(img.publicId));
      p.gallery?.forEach((img: any) => img.publicId && usedPublicIds.add(img.publicId));
    });

    // D. Staff Members
    const staff = await Staff.find({}, 'photo.publicId').lean();
    staff.forEach((st: any) => st.photo?.publicId && usedPublicIds.add(st.photo.publicId));

    // E. Gallery
    const galleryItems = await Gallery.find({}, 'image.publicId').lean();
    galleryItems.forEach((g: any) => g.image?.publicId && usedPublicIds.add(g.image.publicId));

    // F. Contact Information (Logo, Vision, Mission)
    const settings = await ContactInformation.find({}, 'logo.publicId visionImage.publicId missionImage.publicId').lean();
    settings.forEach((set: any) => {
      if (set.logo?.publicId) usedPublicIds.add(set.logo.publicId);
      if (set.visionImage?.publicId) usedPublicIds.add(set.visionImage.publicId);
      if (set.missionImage?.publicId) usedPublicIds.add(set.missionImage.publicId);
    });

    // G. Feedbacks
    const feedbacks = await Feedback.find({}, 'avatar.publicId').lean();
    feedbacks.forEach((f: any) => f.avatar?.publicId && usedPublicIds.add(f.avatar.publicId));

    // H. Quote Requests
    const quotes = await QuoteRequest.find({}, 'fileAttachment.publicId').lean();
    quotes.forEach((q: any) => q.fileAttachment?.publicId && usedPublicIds.add(q.fileAttachment.publicId));

    // I. Client Logos
    const clientLogos = await ClientLogo.find({}, 'logo logoPublicId').lean();
    clientLogos.forEach((cl: any) => {
      if (cl.logoPublicId) {
        usedPublicIds.add(cl.logoPublicId);
      } else if (cl.logo && typeof cl.logo === 'string' && cl.logo.includes('lenux/')) {
        const match = cl.logo.match(/(lenux\/[^.\s]+)/);
        if (match) usedPublicIds.add(match[1]);
      }
    });


    
    // 🌟 2. Cloudinary එකේ ඇති සියලුම Resources ලබාගැනීම (lenux folder සහ lenux public_id ඇති සියල්ල)
    let nextCursor: string | undefined = undefined;
    const lenuxCloudinaryResources: { publicId: string; assetFolder?: string }[] = [];

    do {
      const res: any = await cloudinary.api.resources({
        type: 'upload',
        max_results: 500,
        next_cursor: nextCursor,
      });

      for (const resource of res.resources) {
        const isLenuxPublicId = typeof resource.public_id === 'string' && resource.public_id.startsWith('lenux');
        const isLenuxFolder = typeof resource.asset_folder === 'string' && resource.asset_folder.startsWith('lenux');

        // Lenux folder එකට හෝ lenux publicId prefix එකට අයිති resources පමණක් එකතු කරයි
        if (isLenuxPublicId || isLenuxFolder) {
          lenuxCloudinaryResources.push({
            publicId: resource.public_id,
            assetFolder: resource.asset_folder,
          });
        }
      }

      nextCursor = res.next_cursor;
    } while (nextCursor);

    // 🌟 3. Database එකේ නැති (අනවශ්‍ය / Orphan) පින්තූර හඳුනාගැනීම
    const orphanImagesToDelete = lenuxCloudinaryResources
      .filter((res) => !usedPublicIds.has(res.publicId))
      .map((res) => res.publicId);

    // 🌟 4. Cloudinary එකෙන් එකවර Bulk Delete කිරීම
    const deletionResults: Record<string, string> = {};

    if (orphanImagesToDelete.length > 0) {
      // Cloudinary එකෙන් එකවර 100 බැගින් delete කිරීමට chunk කරයි
      for (let i = 0; i < orphanImagesToDelete.length; i += 100) {
        const batch = orphanImagesToDelete.slice(i, i + 100);
        const delRes: any = await cloudinary.api.delete_resources(batch);
        if (delRes?.deleted) {
          Object.assign(deletionResults, delRes.deleted);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleanup completed! Deleted ${orphanImagesToDelete.length} unused images from Cloudinary.`,
      stats: {
        totalLenuxImagesInCloudinary: lenuxCloudinaryResources.length,
        activeImagesInDatabase: usedPublicIds.size,
        deletedUnusedImages: orphanImagesToDelete.length,
        deletedImagePublicIds: orphanImagesToDelete,
        deletionResults,
      },
    });

  } catch (error: any) {
    console.error('Cloudinary cleanup error:', error);
    return NextResponse.json({ success: false, message: 'Cleanup failed', error: error.message }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}

export async function DELETE() {
  return GET();
}