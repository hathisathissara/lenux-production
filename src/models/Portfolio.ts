import mongoose, { Schema, models } from 'mongoose';

const PortfolioSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true }, // e.g., "Printing", "Branding"
    description: { type: String, required: true },
    coverImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    gallery: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    clientName: { type: String },
    completionDate: { type: Date },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Portfolio = models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);