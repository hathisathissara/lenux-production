import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Admin } from '@/models/Admin';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, message: 'Token and New Password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: 'Invalid or expired password reset link' }, { status: 400 });
    }

    // 2. අලුත් Password එක bcrypt මඟින් hash කිරීම
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update කර Token එක ඉවත් කිරීම
    admin.password = hashedPassword;
    admin.resetToken = null;
    admin.resetTokenExpires = null;
    await admin.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.',
    });
  } catch (error: unknown) {
    console.error('Reset password error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: 'Failed to reset password', error: errorMessage }, { status: 500 });
  }
}