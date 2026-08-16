import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Feedback } from '@/models/Feedback';

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
      { new: true }
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;
    await Feedback.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}