import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { QuoteRequest } from '@/models/QuoteRequest';

// PATCH Update Quote Status and Admin Notes
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    const { status, adminNotes } = body;

    const updatedQuote = await QuoteRequest.findByIdAndUpdate(
      params.id,
      { status, adminNotes },
      { new: true } // Update වූ අලුත්ම document එක return කරනවා
    );

    if (!updatedQuote) {
      return NextResponse.json({ success: false, message: 'Quotation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Quotation updated successfully', data: updatedQuote });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE Quote Request
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await QuoteRequest.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Quotation deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}