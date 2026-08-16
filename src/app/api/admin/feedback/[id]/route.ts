import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Feedback } from '@/models/Feedback';

// PATCH Toggle Feedback Approval Status (Approve ➜ Reject / Reject ➜ Approve)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    const { isApproved } = body;

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      params.id,
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

// DELETE Feedback
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Feedback.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}