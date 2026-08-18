import mongoose, { Schema, models } from 'mongoose';

// 🌟 Vercel Serverless වලදී Service Populate වීම සඳහා මෙය අත්‍යවශ්‍ය වේ
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
    
    // Service Model Reference
    service: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Service', 
      required: true 
    },

    description: { type: String, required: true },
    coverImage: { type: ImageSchema, required: true },
    gallery: [ImageSchema],
    clientName: { type: String },
    completionDate: { type: Date },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true, strict: false }
);

// Next.js Hot Reload සහ Vercel Build වලදී Model Cache ගැටලු මඟහරවා ගැනීම
if (mongoose.models.Portfolio) {
  delete mongoose.models.Portfolio;
}

export const Portfolio = mongoose.model('Portfolio', PortfolioSchema);