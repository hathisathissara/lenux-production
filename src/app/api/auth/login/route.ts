import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Admin } from '@/models/Admin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  getClientIp,
  getRateLimitKey,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from '@/lib/loginRateLimit';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request);
    const rateLimitKey = getRateLimitKey(clientIp, email);

    // Rate limit check: Is the user currently locked out?
    const limitStatus = await checkRateLimit(rateLimitKey);
    if (limitStatus.isLocked) {
      const minutes = limitStatus.remainingMinutes || 1;
      return NextResponse.json(
        {
          success: false,
          isLocked: true,
          remainingMinutes: minutes,
          remainingSeconds: limitStatus.remainingSeconds,
          lockUntil: limitStatus.lockUntil,
          message: `Too many failed login attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`,
        },
        { status: 429 }
      );
    }

    const sanitizedEmail = email.trim();
    const admin = await Admin.findOne({
      email: { $regex: new RegExp(`^${sanitizedEmail}$`, 'i') },
    });

    if (!admin) {
      const failure = await recordFailedAttempt(rateLimitKey, sanitizedEmail, clientIp);
      if (failure.isLocked) {
        return NextResponse.json(
          {
            success: false,
            isLocked: true,
            remainingMinutes: failure.remainingMinutes,
            remainingSeconds: failure.remainingSeconds,
            lockUntil: failure.lockUntil,
            message: `Too many failed login attempts. Access temporarily locked for ${failure.remainingMinutes} minutes.`,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          remainingAttempts: failure.remainingAttempts,
          message: `Invalid credentials. ${failure.remainingAttempts} attempt${failure.remainingAttempts === 1 ? '' : 's'} remaining.`,
        },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      const failure = await recordFailedAttempt(rateLimitKey, sanitizedEmail, clientIp);
      if (failure.isLocked) {
        return NextResponse.json(
          {
            success: false,
            isLocked: true,
            remainingMinutes: failure.remainingMinutes,
            remainingSeconds: failure.remainingSeconds,
            lockUntil: failure.lockUntil,
            message: `Too many failed login attempts. Access temporarily locked for ${failure.remainingMinutes} minutes.`,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          remainingAttempts: failure.remainingAttempts,
          message: `Invalid credentials. ${failure.remainingAttempts} attempt${failure.remainingAttempts === 1 ? '' : 's'} remaining.`,
        },
        { status: 401 }
      );
    }

    // Login successful -> reset failed attempts
    await resetRateLimit(rateLimitKey);

    // Generate JWT Token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      user: { name: admin.name, email: admin.email },
    });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}