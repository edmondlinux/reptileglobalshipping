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
  recipientLatitude: number;
  recipientLongitude: number;
  status: string;
  kycStatus: 'none' | 'pending' | 'submitted' | 'approved' | 'rejected';
  history: Array<{
    status: string;
    location: string;
    description: string;
    timestamp: Date;
    icon: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ShipmentSchema: Schema = new Schema(
  {
    trackingNumber: { type: String, required: true, unique: true },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderPhone: { type: String },
    senderAddress: { type: String, required: true },
    senderCity: { type: String },
    senderState: { type: String },
    senderZip: { type: String },
    senderCountry: { type: String, required: true },
    recipientName: { type: String, required: true },
    recipientEmail: { type: String, required: true },
    recipientPhone: { type: String },
    recipientAddress: { type: String, required: true },
    recipientCity: { type: String },
    recipientState: { type: String },
    recipientZip: { type: String },
    recipientCountry: { type: String },
    packageType: { type: String, required: true },
    weight: { type: String },
    dimensions: {
      length: { type: String },
      width: { type: String },
      height: { type: String },
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
    recipientLatitude: { type: Number },
    recipientLongitude: { type: Number },
    status: { 
      type: String, 
      default: 'pending',
      enum: ['pending', 'processing', 'in-transit', 'out-for-delivery', 'delivered', 'on-hold', 'cancelled']
    },
    kycStatus: {
      type: String,
      default: 'none',
      enum: ['none', 'pending', 'submitted', 'approved', 'rejected']
    },
    history: [{
      status: { type: String, required: true },
      location: { type: String, required: true },
      description: { type: String, required: true },
      timestamp: { type: Date, required: true },
      icon: { type: String, required: true }
    }]
  },
  { timestamps: true }
);

export default mongoose.models.Shipment || mongoose.model<IShipment>('Shipment', ShipmentSchema);