import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import KYC from '@/models/KYC';
import Shipment from '@/models/Shipment';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { token, idFrontUrl, idBackUrl, selfieUrl } = await req.json();

    const kyc = await KYC.findOne({ token });
    if (!kyc) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
    }

    kyc.idFrontUrl = idFrontUrl;
    kyc.idBackUrl = idBackUrl;
    kyc.selfieUrl = selfieUrl;
    kyc.status = 'submitted';
    await kyc.save();

    await Shipment.findByIdAndUpdate(kyc.shipmentId, { kycStatus: 'submitted' });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    
    try {
        await dbConnect();
        const kyc = await KYC.findOne({ token }).populate('shipmentId');
        if (!kyc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(kyc);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}