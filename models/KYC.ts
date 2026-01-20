import mongoose, { Schema, Document } from 'mongoose';

export interface IKYC extends Document {
  shipmentId: mongoose.Types.ObjectId;
  token: string;
  idFrontUrl: string;
  idBackUrl: string;
  selfieUrl: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const KYCSchema: Schema = new Schema(
  {
    shipmentId: { type: Schema.Types.ObjectId, ref: 'Shipment', required: true },
    token: { type: String, required: true, unique: true },
    idFrontUrl: { type: String },
    idBackUrl: { type: String },
    selfieUrl: { type: String },
    status: { 
      type: String, 
      default: 'pending',
      enum: ['pending', 'submitted', 'approved', 'rejected']
    }
  },
  { timestamps: true }
);

export default mongoose.models.KYC || mongoose.model<IKYC>('KYC', KYCSchema);