import mongoose, { Schema, models } from 'mongoose';

const ContactInformationSchema = new Schema(
  {
    companyName: { type: String, default: 'Lenux Production' },
    phone: { type: String },
    secondaryPhone: { type: String },
    whatsapp: { type: String },
    email: { type: String },
    address: { type: String },
    businessHours: { type: String },
    googleMapUrl: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    otherSocial: { type: String },
  },
  { timestamps: true }
);

export const ContactInformation = models.ContactInformation || mongoose.model('ContactInformation', ContactInformationSchema);