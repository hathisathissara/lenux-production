import mongoose, { Schema, models } from 'mongoose';

// 🌟 ServiceCategory Schema එක අනිවාර්යයෙන් මෙහි සම්බන්ධ විය යුතුය (Population සඳහා)
import '@/models/ServiceCategory';

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: ImageSchema, required: true },
    gallery: [ImageSchema],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);


if (mongoose.models.Service) {
  delete mongoose.models.Service;
}

export const Service = mongoose.model('Service', ServiceSchema);