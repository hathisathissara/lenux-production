import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ContactInformation } from '@/models/ContactInformation';
import cloudinary from '@/lib/cloudinary'; // 🌟 Cloudinary Config එක Import කරනවා

export async function GET() {
  try {
    await connectDB();
    let settings = await ContactInformation.findOne();
    
    if (!settings) {
      settings = await ContactInformation.create({
        companyName: "LENUX PRODUCTION (PVT) LTD",
        phone: "0765 650 798",
        businessHours: "Mon-Sat: 09AM - 05PM"
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // 1. දැනට Database එකේ තියෙන පරණ settings record එක ගන්නවා
    const existing = await ContactInformation.findOne();

    if (existing) {
      // 🌟 Logo එක අලුත් එකකින් මාරු කරලා නම්, පරණ Logo එක Cloudinary එකෙන් delete කරනවා
      if (body.logo?.publicId && existing.logo?.publicId && body.logo.publicId !== existing.logo.publicId) {
        await cloudinary.uploader.destroy(existing.logo.publicId).catch(console.error);
      }

      // 🌟 Vision Image එක මාරු කරලා නම්, පරණ එක Cloudinary එකෙන් delete කරනවා
      if (body.visionImage?.publicId && existing.visionImage?.publicId && body.visionImage.publicId !== existing.visionImage.publicId) {
        await cloudinary.uploader.destroy(existing.visionImage.publicId).catch(console.error);
      }

      // 🌟 Mission Image එක මාරු කරලා නම්, පරණ එක Cloudinary එකෙන් delete කරනවා
      if (body.missionImage?.publicId && existing.missionImage?.publicId && body.missionImage.publicId !== existing.missionImage.publicId) {
        await cloudinary.uploader.destroy(existing.missionImage.publicId).catch(console.error);
      }
    }

    // 2. අලුත් දත්ත Database එකට සේව් කරනවා
    const updatedSettings = await ContactInformation.findOneAndUpdate(
      {},
      { $set: body },
      {upsert: true, setDefaultsOnInsert: true,returnDocument: 'after' }
    );

    return NextResponse.json({
      success: true,
      message: 'Settings updated and old images cleaned from Cloudinary!',
      data: updatedSettings
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}