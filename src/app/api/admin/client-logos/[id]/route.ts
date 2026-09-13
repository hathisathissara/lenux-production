import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ClientLogo } from '@/models/ClientLogo';
import cloudinary from '@/lib/cloudinary';

// GET single client logo
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;
    const item = await ClientLogo.findById(id);
    if (!item) {
      return NextResponse.json({ success: false, message: 'Client logo not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT update client logo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const existing = await ClientLogo.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Client logo not found' }, { status: 404 });
    }

    // If logo image was changed and old publicId exists, clean up old image on Cloudinary
    if (body.logoPublicId && existing.logoPublicId && body.logoPublicId !== existing.logoPublicId) {
      try {
        await cloudinary.uploader.destroy(existing.logoPublicId);
      } catch (cloudErr) {
        console.error('Error destroying old logo image:', cloudErr);
      }
    }

    const updated = await ClientLogo.findByIdAndUpdate(
      id,
      {
        ...(body.companyName !== undefined && { companyName: body.companyName.trim() }),
        ...(body.logo !== undefined && { logo: body.logo.trim() }),
        ...(body.logoPublicId !== undefined && { logoPublicId: body.logoPublicId }),
        ...(body.websiteUrl !== undefined && { websiteUrl: body.websiteUrl.trim() }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
        ...(body.order !== undefined && { order: Number(body.order) || 0 }),
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE client logo
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;

    const item = await ClientLogo.findById(id);
    if (!item) {
      return NextResponse.json({ success: false, message: 'Client logo not found' }, { status: 404 });
    }

    // Cloudinary cleanup if publicId exists
    if (item.logoPublicId) {
      try {
        await cloudinary.uploader.destroy(item.logoPublicId);
      } catch (cloudErr) {
        console.error('Error deleting logo from Cloudinary:', cloudErr);
      }
    }

    await ClientLogo.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Client logo deleted successfully' });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
