import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Staff } from '@/models/Staff';

// GET All Staff Members
export async function GET() {
  try {
    await connectDB();
    // sortOrder එකට අනුව (MD, Directors මුලින්ම එන විදියට) සහ අලුතෙන්ම දාපු අනුපිළිවෙලට ගන්නවා
    const team = await Staff.find().sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: team });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST Create Staff Member
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, position, bio, photo, socialLinks, isActive, isFeatured, sortOrder } = body;

    if (!name || !position || !photo) {
      return NextResponse.json({ success: false, message: 'Name, position and photo are required' }, { status: 400 });
    }

    const newMember = await Staff.create({
      name,
      position,
      bio: bio || '',
      photo,
      socialLinks: socialLinks || {},
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false,
      sortOrder: sortOrder || 0
    });

    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}