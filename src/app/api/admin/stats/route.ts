import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Service } from '@/models/Service';
import { Staff } from '@/models/Staff';
import { Portfolio } from '@/models/Portfolio';
import { QuoteRequest } from '@/models/QuoteRequest';

export async function GET() {
  try {
    await connectDB();

    // Database එකේ තියෙන data වල ප්‍රමාණයන් ගණන් කරනවා
    const [services, staff, portfolio, quotes, newQuotes] = await Promise.all([
      Service.countDocuments(),
      Staff.countDocuments(),
      Portfolio.countDocuments(),
      QuoteRequest.countDocuments(),
      QuoteRequest.countDocuments({ status: 'New' }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalServices: services,
        totalStaff: staff,
        totalPortfolio: portfolio,
        totalQuotes: quotes,
        newQuotes: newQuotes,
      }
    });

  } catch (error: any) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}