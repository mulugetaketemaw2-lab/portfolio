import mongoose, { Schema, Document } from "mongoose";

export interface ICertificate extends Document {
  title: string;
  org: string;
  imageUrl: string;
  imageUrls: string[];
  order: number;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    title: { type: String, required: true },
    org: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    imageUrls: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Handle existing model in development
if (mongoose.models.Certificate) {
  delete mongoose.models.Certificate;
}

const Certificate = mongoose.model<ICertificate>("Certificate", CertificateSchema);
export default Certificate;
