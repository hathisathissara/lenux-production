import mongoose, { Schema, models } from 'mongoose';

const FeedbackSchema = new Schema(
  {
    name: { type: String, required: true },
    designation: { type: String },
    comment: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    avatar: {
      url: { type: String },
      publicId: { type: String },
    },
    isApproved: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

export const Feedback = models.Feedback || mongoose.model('Feedback', FeedbackSchema);