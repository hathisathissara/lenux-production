import mongoose, { Schema, models } from 'mongoose';

const JobVacancySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    jobType: { type: String, default: 'Full-Time' },
    location: { type: String, default: 'Colombo' },
    description: { type: String, required: true },
    requirements: { type: String, required: true }, 
    salary: { type: String, default: 'Negotiable' },
    deadline: { type: Date },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (mongoose.models.JobVacancy) {
  delete mongoose.models.JobVacancy;
}

export const JobVacancy = models.JobVacancy || mongoose.model('JobVacancy', JobVacancySchema);