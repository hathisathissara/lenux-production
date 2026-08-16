import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Service } from '@/models/Service';

const slugify = (text: string) => 
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

// GET All Services with Category populated
export async function GET() {
  try {
    await connectDB();
    const services = await Service.find().populate('category', 'name').sort({ sortOrder: 1 });
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST Create Service
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, categoryId, shortDescription, description, image, isFeatured, sortOrder } = body;

    if (!title || !categoryId || !shortDescription || !description || !image) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const slug = slugify(title);

    const newService = await Service.create({
      title,
      slug,
      category: categoryId,
      shortDescription,
      description,
      image,
      isFeatured: isFeatured || false,
      sortOrder: sortOrder || 0
    });

    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}