import mongoose, { Schema, models } from 'mongoose';

const QuoteRequestSchema = new Schema(
  {
    fullName: { type: String, required: true },
    companyName: { type: String, default: "" },
    phoneNumber: { type: String, required: true },
    email: { type: String, default: "" }, // Optional
    requiredService: { type: String, required: true },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['New', 'Contacted', 'Quoted', 'In Progress', 'Completed', 'Cancelled'], 
      default: 'New' 
    },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

if (mongoose.models.QuoteRequest) {
  delete mongoose.models.QuoteRequest;
}

export const QuoteRequest = models.QuoteRequest || mongoose.model('QuoteRequest', QuoteRequestSchema);