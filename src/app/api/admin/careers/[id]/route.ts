import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { JobVacancy } from '@/models/JobVacancy';

// PUT Update Vacancy
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updatedJob = await JobVacancy.findByIdAndUpdate(
      id,
      { $set: body },
      { returnDocument: 'after' }
    );

    if (!updatedJob) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Job vacancy updated successfully', data: updatedJob });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

// DELETE Vacancy
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;
    await JobVacancy.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Job vacancy deleted successfully' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}