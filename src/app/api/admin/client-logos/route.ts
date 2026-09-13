import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ClientLogo } from '@/models/ClientLogo';

// GET all client logos for admin
export async function GET() {
  try {
    await connectDB();
    const logos = await ClientLogo.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: logos });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST create a new client logo
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { companyName, logo, logoPublicId, websiteUrl, isActive, order } = body;

    if (!companyName || !companyName.trim()) {
      return NextResponse.json({ success: false, message: 'Company name is required' }, { status: 400 });
    }

    if (!logo || !logo.trim()) {
      return NextResponse.json({ success: false, message: 'Logo image is required' }, { status: 400 });
    }

    const newLogo = await ClientLogo.create({
      companyName: companyName.trim(),
      logo: logo.trim(),
      logoPublicId: logoPublicId || '',
      websiteUrl: websiteUrl ? websiteUrl.trim() : '',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      order: typeof order === 'number' ? order : Number(order) || 0,
    });

    return NextResponse.json({ success: true, data: newLogo }, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
