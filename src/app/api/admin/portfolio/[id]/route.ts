import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Portfolio } from '@/models/Portfolio';
import cloudinary from '@/lib/cloudinary';

// PUT Update Portfolio Project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const existingProject = await Portfolio.findById(id);
    if (!existingProject) {
      return NextResponse.json({ success: false, message: 'Portfolio project not found' }, { status: 404 });
    }

    // Cover Image එක මාරු කරලා නම්, පරණ එක Cloudinary එකෙන් delete කරනවා
    if (body.coverImage?.publicId && existingProject.coverImage?.publicId && body.coverImage.publicId !== existingProject.coverImage.publicId) {
      await cloudinary.uploader.destroy(existingProject.coverImage.publicId).catch(console.error);
    }

    const updatedProject = await Portfolio.findByIdAndUpdate(
      id,
      { $set: body },
      { returnDocument: 'after' }
    );

    return NextResponse.json({ success: true, message: 'Portfolio updated successfully', data: updatedProject });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE Portfolio Project
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;

    const project = await Portfolio.findById(id);
    if (!project) {
      return NextResponse.json({ success: false, message: 'Portfolio project not found' }, { status: 404 });
    }

    // Cover Image එක Delete කිරීම
    if (project.coverImage?.publicId) {
      await cloudinary.uploader.destroy(project.coverImage.publicId).catch(console.error);
    }

    // Gallery Images ටිකත් Delete කිරීම
    if (project.gallery && project.gallery.length > 0) {
      for (const img of project.gallery) {
        if (img.publicId) {
          await cloudinary.uploader.destroy(img.publicId).catch(console.error);
        }
      }
    }

    await Portfolio.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Portfolio project and images deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}