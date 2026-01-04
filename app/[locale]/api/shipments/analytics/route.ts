
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Shipment from '@/models/Shipment';

export async function GET() {
  try {
    await dbConnect();

    const totalShipments = await Shipment.countDocuments();
    const pendingShipments = await Shipment.countDocuments({ status: 'pending' });
    const inTransitShipments = await Shipment.countDocuments({ status: 'in-transit' });
    const deliveredShipments = await Shipment.countDocuments({ status: 'delivered' });
    const cancelledShipments = await Shipment.countDocuments({ status: 'cancelled' });

    return NextResponse.json(
      {
        totalShipments,
        pendingShipments,
        inTransitShipments,
        deliveredShipments,
        cancelledShipments,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
