
import mongoose, { Schema, Document } from 'mongoose';

export interface IShipment extends Document {
  trackingNumber: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  senderState: string;
  senderZip: string;
  senderCountry: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCity: string;
  recipientState: string;
  recipientZip: string;
  recipientCountry: string;
  packageType: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  value: string;
  description: string;
  specialInstructions: string;
  serviceType: string;
  priority: string;
  insurance: boolean;
  signatureRequired: boolean;
  shippingDate: string;
  estimatedDeliveryDate: string;
  shippingCost: string;
  latitude: number;
  longitude: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShipmentSchema: Schema = new Schema(
  {
    trackingNumber: { type: String, required: true, unique: true },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderPhone: { type: String, required: true },
    senderAddress: { type: String, required: true },
    senderCity: { type: String, required: true },
    senderState: { type: String, required: true },
    senderZip: { type: String, required: true },
    senderCountry: { type: String, required: true },
    recipientName: { type: String, required: true },
    recipientEmail: { type: String, required: true },
    recipientPhone: { type: String, required: true },
    recipientAddress: { type: String, required: true },
    recipientCity: { type: String, required: true },
    recipientState: { type: String, required: true },
    recipientZip: { type: String, required: true },
    recipientCountry: { type: String, required: true },
    packageType: { type: String, required: true },
    weight: { type: String, required: true },
    dimensions: {
      length: { type: String, required: true },
      width: { type: String, required: true },
      height: { type: String, required: true },
    },
    value: { type: String, required: true },
    description: { type: String },
    specialInstructions: { type: String },
    serviceType: { type: String, required: true },
    priority: { type: String, required: true },
    insurance: { type: Boolean, default: false },
    signatureRequired: { type: Boolean, default: false },
    shippingDate: { type: String, required: true },
    estimatedDeliveryDate: { type: String, required: true },
    shippingCost: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.models.Shipment || mongoose.model<IShipment>('Shipment', ShipmentSchema);
