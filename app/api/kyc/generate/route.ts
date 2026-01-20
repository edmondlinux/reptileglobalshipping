import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Shipment from '@/models/Shipment';
import KYC from '@/models/KYC';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { shipmentId } = await req.json();

    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    
    await KYC.findOneAndUpdate(
      { shipmentId },
      { token, status: 'pending' },
      { upsert: true, new: true }
    );

    shipment.kycStatus = 'pending';
    await shipment.save();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';
    const magicLink = `${baseUrl}/kyc/${token}`;

    return NextResponse.json({ magicLink });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}