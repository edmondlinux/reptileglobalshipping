
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Draft from '@/models/Draft';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const data = await req.json();

    const newDraft = new Draft(data);
    await newDraft.save();

    return NextResponse.json({ success: true, draft: newDraft }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating draft:", error);
    return NextResponse.json(
      { error: error.message || 'Failed to create draft' },
      { status: 500 }
    );
  }
}
