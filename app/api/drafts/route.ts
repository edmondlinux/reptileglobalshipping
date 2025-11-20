
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Draft from '@/models/Draft';

export async function GET() {
  try {
    await dbConnect();

    const drafts = await Draft.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ drafts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}
