import mongoose, { Schema } from 'mongoose';

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
    category: { type: String, default: 'Production' }, // display label (category name)
    serviceCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory' }, // ObjectId ref
    image: { type: ImageSchema, required: true },
    slug: { type: String, unique: true, sparse: true },
    sortOrder: { type: Number, default: 0 },
    isFeaturedOnHome: { type: Boolean, default: false },
  },
  { timestamps: true, strict: false }
);

if (mongoose.models.Gallery) {
  delete mongoose.models.Gallery;
}

export const Gallery = mongoose.model('Gallery', GallerySchema);