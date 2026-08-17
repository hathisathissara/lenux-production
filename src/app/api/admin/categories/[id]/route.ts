import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ServiceCategory } from '@/models/ServiceCategory';
import cloudinary from '@/lib/cloudinary';

// PUT Update Category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const existingCat = await ServiceCategory.findById(id);
    if (!existingCat) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    if (body.image?.publicId && existingCat.image?.publicId && body.image.publicId !== existingCat.image.publicId) {
      await cloudinary.uploader.destroy(existingCat.image.publicId).catch(console.error);
    }

    const updatedCat = await ServiceCategory.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    return NextResponse.json({ success: true, message: 'Category updated successfully', data: updatedCat });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE Category
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;

    const category = await ServiceCategory.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    if (category.image?.publicId) {
      await cloudinary.uploader.destroy(category.image.publicId).catch(console.error);
    }

    await ServiceCategory.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Category and image deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}