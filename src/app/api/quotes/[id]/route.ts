import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { QuoteRequest } from '@/models/QuoteRequest';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes } = body;

    const updatedQuote = await QuoteRequest.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true }
    );

    if (!updatedQuote) {
      return NextResponse.json({ success: false, message: 'Quotation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Quotation updated successfully', data: updatedQuote });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    await QuoteRequest.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Quotation deleted successfully' });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}