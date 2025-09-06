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

    const { taskIndex, completed } = await request.json();
    
    if (typeof taskIndex !== 'number' || typeof completed !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('compliance_buddy');
    
    const checklist = await db.collection('checklists').findOne({
      _id: new ObjectId(params.id),
      userId
    });
    
    if (!checklist) {
      return NextResponse.json({ error: 'Checklist not found' }, { status: 404 });
    }
    
    // Update the specific task
    const updateField = `tasks.${taskIndex}.completed`;
    
    await db.collection('checklists').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          [updateField]: completed,
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating checklist:', error);
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

    const client = await clientPromise;
    const db = client.db('compliance_buddy');
    
    const result = await db.collection('checklists').deleteOne({
      _id: new ObjectId(params.id),
      userId
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Checklist not found' }, { status: 404 });
    }
    
    // Also delete related reminders
    await db.collection('reminders').deleteMany({
      checklistId: new ObjectId(params.id)
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting checklist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}