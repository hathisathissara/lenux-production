import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { QuoteRequest } from '@/models/QuoteRequest';

// GET All Quote Requests
export async function GET() {
  try {
    await connectDB();
    const quotes = await QuoteRequest.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: quotes });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST Create Quote Request (පාරිභෝගිකයා එවද්දී සේව් වන තැන)
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { fullName, companyName, phoneNumber, email, requiredService, quantity, preferredDeliveryDate, budget, message, fileAttachment } = body;

    // 🌟 Email එක අනිවාර්යය නොවේ (Removed from required validation check)
    if (!fullName || !phoneNumber || !requiredService || !message) {
      return NextResponse.json({ success: false, message: 'Name, Phone/WhatsApp, Service, and Message are required' }, { status: 400 });
    }

    const newQuote = await QuoteRequest.create({
      fullName,
      companyName,
      phoneNumber,
      email: email || '', // 🌟 Email එක නැත්නම් හිස්ව සේව් වේ
      requiredService,
      quantity,
      preferredDeliveryDate: preferredDeliveryDate ? new Date(preferredDeliveryDate) : undefined,
      budget,
      message,
      fileAttachment
    });

    return NextResponse.json({ success: true, message: 'Quotation request submitted successfully!', data: newQuote }, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}