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
    category: { type: String, default: 'Production' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    image: { type: ImageSchema, required: true },
    slug: { type: String, unique: true, sparse: true }, // featured items වලට විතරක් set වෙනවා
    sortOrder: { type: Number, default: 0 },
    isFeaturedOnHome: { type: Boolean, default: false },
  },
  { timestamps: true, strict: false }
);

// Next.js Hot Reload වලදී Stale Model Cache වීම වැළැක්වීම
if (mongoose.models.Gallery) {
  delete mongoose.models.Gallery;
}

export const Gallery = mongoose.model('Gallery', GallerySchema);