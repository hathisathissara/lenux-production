import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Feedback } from '@/models/Feedback';

// GET Feedback (පාරිභෝගිකයින්ට පේන්න Approved ඒවා විතරක් හෝ Admin ට සේරම ලබාගැනීම)
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const onlyApproved = searchParams.get('approved') === 'true';

    // onlyApproved true නම්, Approve කරපුවා විතරක් ගන්නවා. නැත්නම් සේරම ගන්නවා (Admin ට)
    const filter = onlyApproved ? { isApproved: true } : {};
    const feedbackList = await Feedback.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: feedbackList });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST Create Feedback (පාරිභෝගිකයා Website එකෙන් Review එකක් එවද්දී සේව් වෙන තැන)
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, designation, comment, rating, avatar } = body;

    if (!name || !comment) {
      return NextResponse.json({ success: false, message: 'Name and Comment are required' }, { status: 400 });
    }

    const newFeedback = await Feedback.create({
      name,
      designation,
      comment,
      rating: rating || 5,
      avatar,
      isApproved: false // Defaultවම අනුමත නැත
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your valuable feedback! It will be displayed once approved.', 
      data: newFeedback 
    }, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}