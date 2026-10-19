import mongoose, { Schema } from 'mongoose';

const ImageSchema = new Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  { _id: false }
);

const ContactInformationSchema = new Schema(
  {
    companyName: { type: String, default: 'LENUX PRODUCTION (PVT) LTD' },
    logo: { type: ImageSchema, default: null },
    vision: { type: String, default: '' },
    visionImage: { type: ImageSchema, default: null },
    mission: { type: String, default: '' },
    missionImage: { type: ImageSchema, default: null },
    phone: { type: String, default: '' },
    secondaryPhone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    businessHours: { type: String, default: 'Mon-Sat: 09AM - 05PM' },
    googleMapUrl: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    otherSocial: { type: String, default: '' },
  },
  { timestamps: true, strict: false }
);

if (mongoose.models.ContactInformation) {
  delete mongoose.models.ContactInformation;
}

export const ContactInformation = mongoose.model('ContactInformation', ContactInformationSchema);