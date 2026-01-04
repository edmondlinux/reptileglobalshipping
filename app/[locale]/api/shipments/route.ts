
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Shipment from '@/models/Shipment';

export async function GET() {
  try {
    await dbConnect();

    const shipments = await Shipment.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ shipments }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch shipments' },
      { status: 500 }
    );
  }
}
