import mongoose, { Schema, models } from 'mongoose';

const AdminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // මෙතනට එන්නේ Hash කරපු Password එකක් (bcrypt)
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

export const Admin = models.Admin || mongoose.model('Admin', AdminSchema);