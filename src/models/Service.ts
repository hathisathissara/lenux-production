import mongoose, { Schema, models } from 'mongoose';

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    gallery: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Service = models.Service || mongoose.model('Service', ServiceSchema);