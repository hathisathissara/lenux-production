import mongoose, { Schema, models } from 'mongoose';

const FeedbackSchema = new Schema(
  {
    name: { type: String, required: true },
    designation: { type: String }, // e.g., "Director, Abans"
    comment: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 }, // 1 සිට 5 දක්වා තරු සලකුණු
    avatar: {
      url: { type: String }, // පාරිභෝගිකයාගේ පින්තූරය (Optional)
      publicId: { type: String },
    },
    isApproved: { type: Boolean, default: false }, // Admin approve කරන තෙක් False වේ
  },
  { timestamps: true }
);

export const Feedback = models.Feedback || mongoose.model('Feedback', FeedbackSchema);