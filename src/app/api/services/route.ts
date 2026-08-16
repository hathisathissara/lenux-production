import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Service } from '@/models/Service';

// GET All Services
export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({ isActive: true });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

// POST New Service (Admin Only)
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newService = await Service.create(body);
    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Creation failed' }, { status: 400 });
  }
}