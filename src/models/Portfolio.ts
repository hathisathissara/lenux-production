import mongoose, { Schema } from 'mongoose';
import '@/models/Service';

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const PortfolioSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    service: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Service', 
      required: true 
    },
    description: { type: String, required: true },
    coverImage: { type: ImageSchema, required: true },

    // 🌟 Before / Production / Final Installation Photos
    beforeImages: [ImageSchema],
    productionImages: [ImageSchema],
    installationImages: [ImageSchema],
    gallery: [ImageSchema],

    clientName: { type: String },
    completionDate: { type: Date },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true, strict: false }
);

if (mongoose.models.Portfolio) {
  delete mongoose.models.Portfolio;
}

export const Portfolio = mongoose.model('Portfolio', PortfolioSchema);