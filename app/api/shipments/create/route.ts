
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Shipment from '@/models/Shipment';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const data = await req.json();

    const shipment = await Shipment.create(data);

    return NextResponse.json({ success: true, shipment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create shipment' },
      { status: 500 }
    );
  }
}
