
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Draft from '@/models/Draft';

export async function GET(
  req: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    await dbConnect();

    const draft = await Draft.findOne({ trackingNumber: params.trackingNumber });

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ draft }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch draft' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    await dbConnect();

    const draft = await Draft.findOneAndDelete({ trackingNumber: params.trackingNumber });

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Draft deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete draft' },
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

    const draft = await Draft.findOneAndUpdate(
      { trackingNumber: params.trackingNumber },
      data,
      { new: true, runValidators: false }
    );

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, draft }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update draft' },
      { status: 500 }
    );
  }
}
