import mongoose, { Schema, models } from 'mongoose';

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const GallerySchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    category: { type: String, default: 'Production' }, // e.g., Printing, Branding, Events, Behind The Scenes
    image: { type: ImageSchema, required: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, strict: false }
);

// Next.js Hot Reload වලදී Stale Model Cache වීම වැළැක්වීම
if (mongoose.models.Gallery) {
  delete mongoose.models.Gallery;
}

export const Gallery = mongoose.model('Gallery', GallerySchema);