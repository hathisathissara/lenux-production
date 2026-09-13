import mongoose, { Schema, models } from 'mongoose';

export interface IClientLogo {
  _id?: string;
  companyName: string;
  logo: string;
  logoPublicId?: string;
  websiteUrl?: string;
  isActive: boolean;
  order: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

const ClientLogoSchema = new Schema(
  {
    companyName: { type: String, required: [true, 'Company name is required'], trim: true },
    logo: { type: String, required: [true, 'Logo image URL is required'] },
    logoPublicId: { type: String, default: '' },
    websiteUrl: { type: String, default: '', trim: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent caching issues in Next.js hot reload
if (mongoose.models.ClientLogo) {
  delete mongoose.models.ClientLogo;
}

export const ClientLogo = models.ClientLogo || mongoose.model<IClientLogo>('ClientLogo', ClientLogoSchema);
