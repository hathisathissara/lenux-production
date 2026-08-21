import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Portfolio } from '@/models/Portfolio';

const slugify = (text: string) => 
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export async function GET() {
  try {
    await connectDB();
    const projects = await Portfolio.find().populate('service', 'title').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projects });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { 
      title, serviceId, description, coverImage, 
      beforeImages, productionImages, installationImages, gallery, 
      clientName, completionDate, isFeatured 
    } = body;

    if (!title || !serviceId || !description || !coverImage) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const slug = slugify(title);

    const newProject = await Portfolio.create({
      title,
      slug,
      service: serviceId,
      description,
      coverImage,
      beforeImages: beforeImages || [],
      productionImages: productionImages || [],
      installationImages: installationImages || [],
      gallery: gallery || [],
      clientName: clientName || '',
      completionDate: completionDate ? new Date(completionDate) : undefined,
      isFeatured: isFeatured || false,
    });

    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}