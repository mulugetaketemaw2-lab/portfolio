import mongoose, { Schema, Document } from "mongoose";

export interface ICertificate extends Document {
  title: string;
  org: string;
  imageUrl: string;
  order: number;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    title: { type: String, required: true },
    org: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", CertificateSchema);
