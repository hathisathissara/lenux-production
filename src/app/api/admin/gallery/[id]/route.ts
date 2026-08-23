import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Gallery } from '@/models/Gallery';
import cloudinary from '@/lib/cloudinary';

// PUT Update Gallery Item (e.g. isFeaturedOnHome)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updatedItem = await Gallery.findByIdAndUpdate(id, body, { new: true });
    if (!updatedItem) {
      return NextResponse.json({ success: false, message: 'Gallery item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedItem });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE Gallery Item by ID
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;

    const item = await Gallery.findById(id);
    if (!item) {
      return NextResponse.json({ success: false, message: 'Gallery item not found' }, { status: 404 });
    }

    // Cloudinary එකෙන් Image එක Delete කිරීම
    if (item.image?.publicId) {
      await cloudinary.uploader.destroy(item.image.publicId).catch(console.error);
    }

    await Gallery.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Gallery image deleted successfully' });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}