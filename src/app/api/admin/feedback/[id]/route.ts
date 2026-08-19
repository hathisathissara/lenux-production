import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Feedback } from '@/models/Feedback';
import cloudinary from '@/lib/cloudinary';

// PATCH Toggle Feedback Approval Status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { isApproved } = body;

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { isApproved },
      { returnDocument: 'after' }
    );

    if (!updatedFeedback) {
      return NextResponse.json({ success: false, message: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: isApproved ? 'Feedback approved successfully!' : 'Feedback rejected!',
      data: updatedFeedback 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE Feedback & Cloudinary Image Clean up
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;

    const item = await Feedback.findById(id);
    if (!item) {
      return NextResponse.json({ success: false, message: 'Feedback not found' }, { status: 404 });
    }

    // 🌟 පින්තූරයක් ඇත්නම් Cloudinary එකෙන් ඉවත් කිරීම
    if (item.avatar?.publicId) {
      await cloudinary.uploader.destroy(item.avatar.publicId).catch(console.error);
    }

    await Feedback.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Feedback and avatar image deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}