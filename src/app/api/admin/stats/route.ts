import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Service } from '@/models/Service';
import { Staff } from '@/models/Staff';
import { Portfolio } from '@/models/Portfolio';
import { Gallery } from '@/models/Gallery';
import { QuoteRequest } from '@/models/QuoteRequest';
import { ClientLogo } from '@/models/ClientLogo';
import { Feedback } from '@/models/Feedback';

export async function GET() {
  try {
    await connectDB();

    const [
      services,
      staff,
      portfolio,
      gallery,
      quotes,
      newQuotes,
      clients,
      feedback,
      recentQuotes
    ] = await Promise.all([
      Service.countDocuments(),
      Staff.countDocuments(),
      Portfolio.countDocuments(),
      Gallery.countDocuments(),
      QuoteRequest.countDocuments(),
      QuoteRequest.countDocuments({ status: 'New' }),
      ClientLogo.countDocuments(),
      Feedback.countDocuments(),
      QuoteRequest.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalServices: services,
        totalStaff: staff,
        totalPortfolio: portfolio,
        totalGallery: gallery,
        totalQuotes: quotes,
        newQuotes: newQuotes,
        totalClients: clients,
        totalFeedback: feedback,
        recentQuotes: recentQuotes || []
      }
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}