import mongoose, { Schema, models } from 'mongoose';

const QuoteRequestSchema = new Schema(
  {
    fullName: { type: String, required: true },
    companyName: { type: String },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    requiredService: { type: String, required: true },
    quantity: { type: String },
    preferredDeliveryDate: { type: Date },
    budget: { type: String },
    message: { type: String, required: true },
    fileAttachment: {
      url: { type: String },
      publicId: { type: String },
    },
    status: { 
      type: String, 
      enum: ['New', 'Contacted', 'Quoted', 'In Progress', 'Completed', 'Cancelled'], 
      default: 'New' 
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

export const QuoteRequest = models.QuoteRequest || mongoose.model('QuoteRequest', QuoteRequestSchema);