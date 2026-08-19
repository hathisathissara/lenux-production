import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'public_uploads';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🌟 PNG ඇතුළු සියලුම පින්තූර අනිවාර්යයෙන්ම WebP බවට හැරවීම සඳහා format: 'webp' සහ flags: 'lossy' යොදා ඇත
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `lenux/${folder}`,
          resource_type: 'image',
          format: 'webp', // 🌟 Force WebP for PNG, JPG, etc.
          transformation: [
            { width: 1000, crop: 'limit' },
            { quality: 'auto:good', flags: 'lossy' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    }) as any;

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url, // දැන් මෙහි අවසානය .webp ලෙසම පෙනෙනු ඇත
      publicId: uploadResult.public_id
    });

  } catch (error: any) {
    console.error('Public Upload Error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed', error: error.message }, { status: 500 });
  }
}

// 🌟 X බටනය ඔබන විට Cloudinary එකෙන් පින්තූරය සම්පූර්ණයෙන්ම ඉවත් කිරීම
export async function DELETE(request: Request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json({ success: false, message: 'publicId is required' }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok' && result.result !== 'not found') {
      return NextResponse.json({ success: false, message: 'Failed to delete image', result }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Image deleted' });

  } catch (error: any) {
    console.error('Public Delete Error:', error);
    return NextResponse.json({ success: false, message: 'Delete failed', error: error.message }, { status: 500 });
  }
}