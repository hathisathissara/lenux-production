import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ServiceCategory } from '@/models/ServiceCategory';

// Helper function to create a slug
const slugify = (text: string) => 
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

// GET All Categories
export async function GET() {
  try {
    await connectDB();
    const categories = await ServiceCategory.find().sort({ sortOrder: 1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST Create Category
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, description, image, icon, sortOrder } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: 'Category Name is required' }, { status: 400 });
    }

    const slug = slugify(name);

    const newCategory = await ServiceCategory.create({
      name,
      slug,
      description,
      image,
      icon: icon || 'Printer',
      sortOrder: sortOrder || 0
    });

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}