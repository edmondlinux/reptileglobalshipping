
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Shipment from '@/models/Shipment';
import { shipmentValidationSchema } from '@/lib/validations/shipment';
import { ZodError } from 'zod';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const data = await req.json();

    // Validate the data
    const validatedData = shipmentValidationSchema.parse(data);

    // Use recipient coordinates if provided, otherwise use placeholder
    const recipientLat = validatedData.recipientLatitude || 0;
    const recipientLng = validatedData.recipientLongitude || 0;

    const newShipment = new Shipment({
      trackingNumber: validatedData.trackingNumber,
      senderName: validatedData.senderName,
      senderEmail: validatedData.senderEmail,
      senderPhone: validatedData.senderPhone,
      senderAddress: validatedData.senderAddress,
      senderCity: validatedData.senderCity,
      senderState: validatedData.senderState,
      senderZip: validatedData.senderZip,
      senderCountry: validatedData.senderCountry,
      recipientName: validatedData.recipientName,
      recipientEmail: validatedData.recipientEmail,
      recipientPhone: validatedData.recipientPhone,
      recipientAddress: validatedData.recipientAddress,
      recipientCity: validatedData.recipientCity,
      recipientState: validatedData.recipientState,
      recipientZip: validatedData.recipientZip,
      recipientCountry: validatedData.recipientCountry,
      packageType: validatedData.packageType,
      weight: validatedData.weight,
      dimensions: validatedData.dimensions,
      value: validatedData.value,
      description: validatedData.description || '',
      specialInstructions: validatedData.specialInstructions || '',
      serviceType: validatedData.serviceType,
      priority: validatedData.priority,
      insurance: validatedData.insurance || false,
      signatureRequired: validatedData.signatureRequired || false,
      shippingDate: validatedData.shippingDate,
      estimatedDeliveryDate: validatedData.estimatedDeliveryDate,
      shippingCost: validatedData.shippingCost,
      latitude: validatedData.latitude,
      longitude: validatedData.longitude,
      recipientLatitude: recipientLat,
      recipientLongitude: recipientLng,
      status: 'pending',
      history: [{
        status: 'pending',
        location: `${validatedData.senderCity}, ${validatedData.senderState}`,
        description: 'Shipment created at origin facility',
        timestamp: new Date(),
        icon: 'package'
      }]
    });

    await newShipment.save();

    return NextResponse.json({ success: true, shipment: newShipment }, { status: 201 });
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

    console.error("Error creating shipment:", error);
    return NextResponse.json(
      { error: error.message || 'Failed to create shipment' },
      { status: 500 }
    );
  }
}
