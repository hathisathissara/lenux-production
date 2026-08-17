import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Staff } from '@/models/Staff';
import cloudinary from '@/lib/cloudinary';

// PUT Update Staff Member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const existingStaff = await Staff.findById(id);
    if (!existingStaff) {
      return NextResponse.json({ success: false, message: 'Staff member not found' }, { status: 404 });
    }

    // Profile photo එක මාරු කරලා නම්, පරණ එක Cloudinary එකෙන් delete කරනවා
    if (body.photo?.publicId && existingStaff.photo?.publicId && body.photo.publicId !== existingStaff.photo.publicId) {
      await cloudinary.uploader.destroy(existingStaff.photo.publicId).catch(console.error);
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    return NextResponse.json({ success: true, message: 'Staff member updated successfully', data: updatedStaff });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE Staff Member
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;

    const staff = await Staff.findById(id);
    if (!staff) {
      return NextResponse.json({ success: false, message: 'Staff member not found' }, { status: 404 });
    }

    // Cloudinary එකෙන් Profile Photo එක Delete කිරීම
    if (staff.photo?.publicId) {
      await cloudinary.uploader.destroy(staff.photo.publicId).catch(console.error);
    }

    await Staff.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Staff member and photo deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}