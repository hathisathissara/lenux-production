import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { JobVacancy } from '@/models/JobVacancy';

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

// GET All Vacancies
export async function GET() {
  try {
    await connectDB();
    const jobs = await JobVacancy.find().sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: jobs });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

// POST Create Job Vacancy
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, department, jobType, location, description, requirements, salary, deadline, isActive, sortOrder } = body;

    if (!title || !department || !description || !requirements) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    let slug = slugify(title);
    let counter = 2;
    while (await JobVacancy.exists({ slug })) {
      slug = `${slugify(title)}-${counter}`;
      counter++;
    }

    const newJob = await JobVacancy.create({
      title,
      slug,
      department,
      jobType: jobType || 'Full-Time',
      location: location || 'Colombo',
      description,
      requirements,
      salary: salary || 'Negotiable',
      deadline: deadline ? new Date(deadline) : undefined,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0,
    });

    return NextResponse.json({ success: true, data: newJob }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}