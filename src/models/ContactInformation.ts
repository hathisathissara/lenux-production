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
  // strict: false දැමීමෙන් කිසිදු field එකක් Mongoose මඟින් discard නොවේ
  { timestamps: true, strict: false }
);

// Next.js Hot Reload වලදී පරණ Model එක cache වී තිබීම වැළැක්වීම
if (mongoose.models.ContactInformation) {
  delete mongoose.models.ContactInformation;
}

export const ContactInformation = mongoose.model('ContactInformation', ContactInformationSchema);