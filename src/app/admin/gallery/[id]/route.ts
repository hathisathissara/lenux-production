import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Gallery } from '@/models/Gallery';
import cloudinary from '@/lib/cloudinary';

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
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}