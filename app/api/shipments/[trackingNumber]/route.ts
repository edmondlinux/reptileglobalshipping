
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Shipment from '@/models/Shipment';

export async function GET(
  req: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    await dbConnect();

    const shipment = await Shipment.findOne({ trackingNumber: params.trackingNumber });

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    return NextResponse.json({ shipment }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch shipment' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    await dbConnect();

    const data = await req.json();

    const shipment = await Shipment.findOneAndUpdate(
      { trackingNumber: params.trackingNumber },
      data,
      { new: true }
    );

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, shipment }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update shipment' },
      { status: 500 }
    );
  }
}
