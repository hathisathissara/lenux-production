import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Portfolio } from '@/models/Portfolio';

const slugify = (text: string) => 
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

// GET All Portfolio Projects (with linked Service details populated)
export async function GET() {
  try {
    await connectDB();
    // `.populate('service')` එකෙන් මේ වැඩේට අදාළ Service එකේ විස්තර (Title) auto අරන් දෙනවා
    const projects = await Portfolio.find().populate('service', 'title').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST Create Portfolio Project
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, serviceId, description, coverImage, gallery, clientName, completionDate, isFeatured } = body;

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
      gallery: gallery || [],
      clientName: clientName || '',
      completionDate: completionDate ? new Date(completionDate) : undefined,
      isFeatured: isFeatured || false,
    });

    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}