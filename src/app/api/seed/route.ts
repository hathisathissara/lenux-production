import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Admin } from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // 1. Database එකට connect වෙනවා
    await connectDB();

    // 2. දැනටමත් admin@lenux.lk කියලා කෙනෙක් ඉන්නවද බලනවා
    const existingAdmin = await Admin.findOne({ email: 'hathisathissara01@gmail.com' });

    if (existingAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: 'Admin user already exists. Seed not required.' 
      });
    }

    // 3. අලුත් Password එක Hash කරනවා 
    // (මෙතන ලොග් වෙන්න තියෙන password එක 'Lenux@2026')
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // 4. අලුත් Admin කෙනෙක් DB එකට Save කරනවා
    const newAdmin = await Admin.create({
      name: 'Super Admin',
      email: 'hathisathissara01@gmail.com',
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
        // Password එක කවදාවත් return කරන්නේ නෑ
      }
    });

  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to seed admin user', 
      error: error.message 
    }, { status: 500 });
  }
}