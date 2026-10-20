import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Admin } from '@/models/Admin';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email address is required' }, { status: 400 });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return NextResponse.json({ success: false, message: 'No admin account found with this email' }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); 

    admin.resetToken = token;
    admin.resetTokenExpires = tokenExpires;
    await admin.save();

    // 2. Direct Reset Link එක සැකසීම
    const resetUrl = `${SITE_URL}/admin/reset-password?token=${token}`;

    // 3. Nodemailer Gmail Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 4. සුපිරි Branded Email එකක් යැවීම
    const mailOptions = {
      from: `"Lenux Security" <${process.env.GMAIL_USER}>`,
      to: admin.email,
      subject: 'Reset Your Password - Lenux Production Admin Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background-color: #0c0c0c; color: #ffffff; padding: 35px; border-radius: 20px; border: 1px solid #1f2937;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #10b981; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 1px;">LENUX</h1>
            <p style="color: #6ee7b7; font-size: 11px; margin-top: 4px; letter-spacing: 2px;">PRODUCTION ADMIN PORTAL</p>
          </div>
          <p style="color: #e5e7eb; font-size: 15px; line-height: 1.6;">Hello ${admin.name},</p>
          <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">We received a request to reset your administrator password. Click the secure button below to set a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #10b981; color: #ffffff; font-size: 14px; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
              Reset Password Now ➔
            </a>
          </div>

          <p style="color: #6b7280; font-size: 12px; line-height: 1.5; text-align: center;">Or copy and paste this link in your browser:<br /><a href="${resetUrl}" style="color: #10b981; word-break: break-all;">${resetUrl}</a></p>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">This secure link is valid for <strong>1 hour</strong> only. If you didn't request this, ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #1f2937; margin: 25px 0;" />
          <p style="color: #4b5563; font-size: 11px; text-align: center; margin: 0;">© ${new Date().getFullYear()} Lenux Production. All Rights Reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Password reset link has been sent to your email address.',
    });
  } catch (error: unknown) {
    console.error('Forgot password link error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: 'Failed to send reset link', error: errorMessage }, { status: 500 });
  }
}