import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'lenux';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // File එක Buffer එකක් බවට පත් කරනවා
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cloudinary Stream එක හරහා Upload සහ Compression එක එකපාර සිද්ද වෙනවා
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `lenux/${folder}`,
          // 1. පින්තූරය අනිවාර්යයෙන්ම WebP Format එකට හැරවීම
          format: 'webp',
          
          // 2. Compression සහ Auto-Resize කිරීම
          transformation: [
            { 
              width: 1200,      // පින්තූරය ගොඩක් ලොකු නම් Width එක Pixels 1200 කට සීමා කරනවා
              crop: 'limit'     // පින්තූරයේ අනුපාතය (Ratio) වෙනස් නොවී Limit කරනවා
            },
            { 
              quality: 'auto:good', // පෙනුම වෙනස් නොවී උපරිම Compression එක දෙනවා
              fetch_format: 'auto' 
            }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    }) as any;

    // Output එක බැලුවොත් ඔයාට පෙනෙයි .webp extension එකෙන්මයි URL එක එන්නේ කියලා
    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url, // WebP URL එක
      publicId: uploadResult.public_id
    });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed', error: error.message }, { status: 500 });
  }
}