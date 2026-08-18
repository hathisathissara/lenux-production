import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Gallery } from '@/models/Gallery';

// GET All Gallery Images
export async function GET() {
  try {
    await connectDB();
    const images = await Gallery.find().sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: images });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST Add New Gallery Images (Multiple හෝ Single සේව් වීමට)
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, description, category, images, sortOrder } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ success: false, message: 'At least one image is required' }, { status: 400 });
    }

    // එකපාර පින්තූර කිහිපයක් දී තිබේ නම්, ඒවා Loop කර එකින් එක Database එකට සේව් කරනවා
    const createdImages = [];
    for (const img of images) {
      const newItem = await Gallery.create({
        title: title || '',
        description: description || '',
        category: category || 'Production',
        image: img,
        sortOrder: sortOrder || 0,
      });
      createdImages.push(newItem);
    }

    return NextResponse.json({ success: true, count: createdImages.length, data: createdImages }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}