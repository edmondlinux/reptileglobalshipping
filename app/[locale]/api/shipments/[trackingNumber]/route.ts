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

    // Prepare update data - exclude history from direct updates to avoid conflicts
    const updateData: any = { ...data };
    delete updateData.history; // Remove history to avoid conflicts with $push

    const getIconForStatus = (status: string) => {
      const iconMap: Record<string, string> = {
        'pending': 'clock',
        'in-transit': 'truck',
        'out-for-delivery': 'mappin',
        'delivered': 'check',
        'cancelled': 'x',
        'processing': 'package',
        'on-hold': 'alert'
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
        'processing': 'Being processed at facility',
        'on-hold': 'Shipment is on hold'
      };
      return descMap[status.toLowerCase()] || 'Status updated';
    };

    // Check for status change
    const statusChanged = data.status && data.status !== currentShipment.status;
    
    // Check for location change (latitude/longitude)
    const locationChanged = (data.latitude !== undefined && data.latitude !== currentShipment.latitude) ||
                           (data.longitude !== undefined && data.longitude !== currentShipment.longitude);

    // Check for address changes
    const addressChanged = (data.recipientCity && data.recipientCity !== currentShipment.recipientCity) ||
                          (data.recipientState && data.recipientState !== currentShipment.recipientState) ||
                          (data.recipientAddress && data.recipientAddress !== currentShipment.recipientAddress);

    // Add history entry if status or location changed
    if (statusChanged || locationChanged || addressChanged) {
      const currentStatus = data.status || currentShipment.status;
      const currentLocation = data.recipientCity 
        ? `${data.recipientCity}, ${data.recipientState || currentShipment.recipientState}` 
        : `${currentShipment.recipientCity}, ${currentShipment.recipientState}`;
      
      let description = '';
      
      if (statusChanged && (locationChanged || addressChanged)) {
        description = `${getDescriptionForStatus(currentStatus)} - Location updated to ${currentLocation}`;
      } else if (statusChanged) {
        description = getDescriptionForStatus(currentStatus);
      } else if (locationChanged || addressChanged) {
        description = `Location updated to ${currentLocation}`;
      }

      const newHistoryEntry = {
        status: currentStatus,
        location: currentLocation,
        description: description,
        timestamp: new Date().toISOString(),
        icon: getIconForStatus(currentStatus)
      };

      // Append to history array
      updateData.$push = { history: newHistoryEntry };
    }

    const shipment = await Shipment.findOneAndUpdate(
      { trackingNumber: params.trackingNumber },
      updateData,
      { new: true }
    );

    return NextResponse.json({ success: true, shipment });
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