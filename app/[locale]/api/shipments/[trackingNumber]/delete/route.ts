
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Shipment from '@/models/Shipment';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    await dbConnect();

    const shipment = await Shipment.findOneAndDelete({ 
      trackingNumber: params.trackingNumber 
    });

    if (!shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Shipment deleted successfully',
        deletedShipment: shipment 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting shipment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete shipment' },
      { status: 500 }
    );
  }
}
