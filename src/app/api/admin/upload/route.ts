import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'lenux';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🌟 Cloudinary Upload Stream with Forced WebP Conversion & Lossy Compression
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `lenux/${folder}`,
          resource_type: 'image',
          // 🌟 PNG සහ වෙනත් ඕනෑම එකක් අනිවාර්යයෙන්ම WebP වලට හැරවීම සඳහා format එක force කරයි
          format: 'webp',
          transformation: [
            { width: 1200, crop: 'limit' },
            { quality: 'auto:good', fetch_format: 'webp', flags: 'lossy' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url, // දැන් මෙහි URL එකේ අගට .webp අනිවාර්යයෙන්ම දිස්වේවි
      publicId: uploadResult.public_id
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { publicId } = await request.json();
    if (!publicId) {
      return NextResponse.json({ success: false, message: 'publicId is required' }, { status: 400 });
    }
    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ success: true, message: 'Image deleted from Cloudinary' });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Cloudinary Delete Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}