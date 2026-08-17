import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Service } from '@/models/Service';
import cloudinary from '@/lib/cloudinary';

// PUT Update Service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const existingService = await Service.findById(id);
    if (!existingService) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
    }

    // පින්තූරය මාරු කරලා නම්, පරණ පින්තූරය Cloudinary එකෙන් delete කරනවා
    if (body.image?.publicId && existingService.image?.publicId && body.image.publicId !== existingService.image.publicId) {
      await cloudinary.uploader.destroy(existingService.image.publicId).catch(console.error);
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    return NextResponse.json({ success: true, message: 'Service updated successfully', data: updatedService });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE Service
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;

    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
    }

    if (service.image?.publicId) {
      await cloudinary.uploader.destroy(service.image.publicId).catch(console.error);
    }

    await Service.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Service and associated images deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}