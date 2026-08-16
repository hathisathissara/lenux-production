import mongoose, { Schema, models } from 'mongoose';

const StaffSchema = new Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    bio: { type: String },
    photo: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      whatsapp: { type: String },
      other: { type: String },
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Staff = models.Staff || mongoose.model('Staff', StaffSchema);