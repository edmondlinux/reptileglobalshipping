import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Shipment from '@/models/Shipment';
import { z, ZodError } from 'zod';

// Define the shipment validation schema
const shipmentValidationSchema = z.object({
  trackingNumber: z.string().min(1, 'Tracking number is required'),
  senderName: z.string().min(1, 'Sender name is required'),
  senderAddress: z.string().min(1, 'Sender address is required'),
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientAddress: z.string().min(1, 'Recipient address is required'),
  weight: z.number().positive('Weight must be positive'),
  dimensions: z.object({
    length: z.number().positive('Length must be positive'),
    width: z.number().positive('Width must be positive'),
    height: z.number().positive('Height must be positive'),
  }),
  status: z.enum(['PENDING', 'IN_TRANSIT', 'DELIVERED', 'EXCEPTION']),
  estimatedDelivery: z.string().datetime('Invalid date format for estimated delivery'),
});

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

    // Get current shipment to check status change
    const currentShipment = await Shipment.findOne({ trackingNumber: params.trackingNumber });
    
    if (!currentShipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    // Helper functions
    const getIconForStatus = (status: string) => {
      const iconMap: Record<string, string> = {
        'pending': 'clock',
        'in-transit': 'truck',
        'out-for-delivery': 'mappin',
        'delivered': 'check',
        'cancelled': 'x',
        'processing': 'package'
      };
      return iconMap[status.toLowerCase()] || 'clock';
    };

    const getDescriptionForStatus = (status: string) => {
      const descMap: Record<string, string> = {
        'pending': 'Awaiting processing',
        'in-transit': 'Package is on the way',
        'out-for-delivery': 'Out for delivery to recipient',
        'delivered': 'Successfully delivered',
        'cancelled': 'Shipment cancelled',
        'processing': 'Being processed at facility'
      };
      return descMap[status.toLowerCase()] || 'Status updated';
    };

    // Normalize status for comparison
    const normalizeStatus = (status: string) => status.toLowerCase().replace(/_/g, '-');

    // Check if status changed
    const statusChanged = data.status && 
      normalizeStatus(data.status) !== normalizeStatus(currentShipment.status);

    // Prepare update data (without $push for now)
    const updateData: any = { ...data };
    delete updateData.$push;

    // If status changed, add to history
    if (statusChanged) {
      const location = data.recipientCity && data.recipientState
        ? `${data.recipientCity}, ${data.recipientState}`
        : `${currentShipment.recipientCity}, ${currentShipment.recipientState}`;

      const newHistoryEntry = {
        status: data.status,
        location: location,
        description: getDescriptionForStatus(data.status),
        timestamp: new Date(),
        icon: getIconForStatus(data.status)
      };

      // Update shipment with new data and push history entry
      const shipment = await Shipment.findOneAndUpdate(
        { trackingNumber: params.trackingNumber },
        {
          ...updateData,
          $push: { history: newHistoryEntry }
        },
        { new: true }
      );

      return NextResponse.json({ success: true, shipment });
    } else {
      // Update without adding history
      const shipment = await Shipment.findOneAndUpdate(
        { trackingNumber: params.trackingNumber },
        updateData,
        { new: true }
      );

      return NextResponse.json({ success: true, shipment });
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update shipment' },
      { status: 500 }
    );
  }
}