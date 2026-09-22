import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Gallery } from '@/models/Gallery';
import { slugify } from '@/lib/slugify';

// GET All Gallery Images
export async function GET() {
  try {
    await connectDB();
    const images = await Gallery.find().sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: images });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST Add New Gallery Images (Multiple හෝ Single සේව් වීමට)
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, description, category, serviceCategory, images, sortOrder, isFeaturedOnHome } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ success: false, message: 'At least one image is required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createdImages: any[] = [];
    for (const img of images) {
      const itemFeatured = Boolean(
        img.isFeaturedOnHome !== undefined ? img.isFeaturedOnHome : isFeaturedOnHome
      );
      const itemDescription = itemFeatured ? (img.description || description || '') : '';
      const imagePayload = {
        url: img.url,
        publicId: img.publicId,
      };

      let slugCandidate: string | undefined = undefined;
      if (itemFeatured) {
        const base = slugify(title || category || 'gallery-item') || 'gallery-item';
        slugCandidate = base;
        let counter = 2;
        while (await Gallery.exists({ slug: slugCandidate })) {
          slugCandidate = `${base}-${counter}`;
          counter++;
        }
      }

      const newItem = await Gallery.create({
        title: title || '',
        description: itemDescription,
        category: category || 'Production',
        serviceCategory: serviceCategory || null,
        image: imagePayload,
        sortOrder: sortOrder || 0,
        isFeaturedOnHome: itemFeatured,
        ...(slugCandidate ? { slug: slugCandidate } : {}),
      });
      createdImages.push(newItem);
    }

    return NextResponse.json({ success: true, count: createdImages.length, data: createdImages }, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT Update Multiple Gallery Images (Bulk Update for Album)
export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { imageIds, originalTitle, title, category, serviceCategory, description, isFeaturedOnHome } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFilter: any = {};
    if (imageIds && Array.isArray(imageIds) && imageIds.length > 0) {
      updateFilter._id = { $in: imageIds };
    } else if (originalTitle) {
      updateFilter.title = originalTitle;
    } else {
      return NextResponse.json({ success: false, message: 'imageIds or originalTitle is required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (serviceCategory !== undefined) updateData.serviceCategory = serviceCategory || null;
    if (description !== undefined) updateData.description = description;
    if (isFeaturedOnHome !== undefined) updateData.isFeaturedOnHome = Boolean(isFeaturedOnHome);

    // If marked as featured, ensure slug exists
    if (updateData.isFeaturedOnHome === true) {
      const itemsNeedingSlug = await Gallery.find({
        ...updateFilter,
        $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
      });

      for (const item of itemsNeedingSlug) {
        const base = slugify(updateData.title || item.title || updateData.category || item.category || 'gallery-item') || 'gallery-item';
        let candidate = base;
        let counter = 2;
        while (await Gallery.exists({ slug: candidate, _id: { $ne: item._id } })) {
          candidate = `${base}-${counter}`;
          counter++;
        }
        await Gallery.findByIdAndUpdate(item._id, { slug: candidate });
      }
    }

    const result = await Gallery.updateMany(updateFilter, { $set: updateData });

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} photos successfully`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}