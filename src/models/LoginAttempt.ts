import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILoginAttempt extends Document {
  key: string;
  email: string;
  ip: string;
  attempts: number;
  lockUntil: Date | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LoginAttemptSchema = new Schema<ILoginAttempt>(
  {
    key: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    ip: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

export const LoginAttempt: Model<ILoginAttempt> =
  mongoose.models.LoginAttempt || mongoose.model<ILoginAttempt>('LoginAttempt', LoginAttemptSchema);
