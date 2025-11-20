
import mongoose, { Schema, Document } from 'mongoose';

export interface IDraft extends Document {
  trackingNumber: string;
  senderName?: string;
  senderEmail?: string;
  senderPhone?: string;
  senderAddress?: string;
  senderCity?: string;
  senderState?: string;
  senderZip?: string;
  senderCountry?: string;
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientAddress?: string;
  recipientCity?: string;
  recipientState?: string;
  recipientZip?: string;
  recipientCountry?: string;
  packageType?: string;
  weight?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
  value?: string;
  description?: string;
  specialInstructions?: string;
  serviceType?: string;
  priority?: string;
  insurance?: boolean;
  signatureRequired?: boolean;
  shippingDate?: string;
  estimatedDeliveryDate?: string;
  shippingCost?: string;
  latitude?: number;
  longitude?: number;
  recipientLatitude?: number;
  recipientLongitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

const DraftSchema: Schema = new Schema(
  {
    trackingNumber: { type: String, required: true, unique: true },
    senderName: { type: String },
    senderEmail: { type: String },
    senderPhone: { type: String },
    senderAddress: { type: String },
    senderCity: { type: String },
    senderState: { type: String },
    senderZip: { type: String },
    senderCountry: { type: String },
    recipientName: { type: String },
    recipientEmail: { type: String },
    recipientPhone: { type: String },
    recipientAddress: { type: String },
    recipientCity: { type: String },
    recipientState: { type: String },
    recipientZip: { type: String },
    recipientCountry: { type: String },
    packageType: { type: String },
    weight: { type: String },
    dimensions: {
      length: { type: String },
      width: { type: String },
      height: { type: String },
    },
    value: { type: String },
    description: { type: String },
    specialInstructions: { type: String },
    serviceType: { type: String },
    priority: { type: String },
    insurance: { type: Boolean },
    signatureRequired: { type: Boolean },
    shippingDate: { type: String },
    estimatedDeliveryDate: { type: String },
    shippingCost: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    recipientLatitude: { type: Number },
    recipientLongitude: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.Draft || mongoose.model<IDraft>('Draft', DraftSchema);
