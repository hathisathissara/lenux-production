import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { QuoteRequest } from '@/models/QuoteRequest';

// GET All Quote Requests (Admin පැනල් එකට සේරම Quotes ලබාගැනීම)
export async function GET() {
  try {
    await connectDB();
    const quotes = await QuoteRequest.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: quotes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST Create Quote Request (පාරිභෝගිකයා Website එකෙන් පෝරමය පුරවලා එවද්දී සේව් වෙන තැන)
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { fullName, companyName, phoneNumber, email, requiredService, quantity, preferredDeliveryDate, budget, message, fileAttachment } = body;

    if (!fullName || !phoneNumber || !email || !requiredService || !message) {
      return NextResponse.json({ success: false, message: 'Required fields are missing' }, { status: 400 });
    }

    const newQuote = await QuoteRequest.create({
      fullName,
      companyName,
      phoneNumber,
      email,
      requiredService,
      quantity,
      preferredDeliveryDate: preferredDeliveryDate ? new Date(preferredDeliveryDate) : undefined,
      budget,
      message,
      fileAttachment
    });

    return NextResponse.json({ success: true, message: 'Quotation request submitted successfully!', data: newQuote }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}