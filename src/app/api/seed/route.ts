import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Admin } from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectDB();
    const existingAdmin = await Admin.findOne({ email: '[EMAIL_ADDRESS]' });

    if (existingAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: 'Admin user already exists. Seed not required.' 
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('[password]', saltRounds);

    const newAdmin = await Admin.create({
      name: 'Super Admin',
      email: '[EMAIL_ADDRESS]',
      password: hashedPassword,
      role: 'admin',
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully!',
      data: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to seed admin user', 
      error: error.message 
    }, { status: 500 });
  }
}