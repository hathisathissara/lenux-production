import mongoose, { Schema, models } from 'mongoose';

const ServiceCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    icon: { type: String }, // Icon name from lucide-react (e.g. "Printer")
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ServiceCategory = models.ServiceCategory || mongoose.model('ServiceCategory', ServiceCategorySchema);