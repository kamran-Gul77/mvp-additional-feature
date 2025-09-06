import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Add admin check
    const client = await clientPromise;
    const db = client.db('compliance_buddy');
    
    const user = await db.collection('users').findOne({ clerkId: userId });
    if (!user || user.email !== 'admin@compliancebuddy.com') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const templateData = await request.json();
    
    await db.collection('checklist_templates').updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          city: templateData.city,
          businessType: templateData.businessType,
          tasks: templateData.tasks,
          updatedAt: new Date(),
        },
      }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Add admin check
    const client = await clientPromise;
    const db = client.db('compliance_buddy');
    
    const user = await db.collection('users').findOne({ clerkId: userId });
    if (!user || user.email !== 'admin@compliancebuddy.com') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    const result = await db.collection('checklist_templates').deleteOne({
      _id: new ObjectId(params.id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}