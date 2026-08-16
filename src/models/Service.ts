import mongoose, { Schema, models } from 'mongoose';

const serviceSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: {
    url: String,
    publicId: String
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Service = models.Service || mongoose.model('Service', serviceSchema);