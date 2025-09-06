import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Add admin check here - you can implement your own logic
    // For now, we'll use a simple email check
    const client = await clientPromise;
    const db = client.db('compliance_buddy');
    
    const user = await db.collection('users').findOne({ clerkId: userId });
    if (!user || user.email !== 'admin@compliancebuddy.com') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    const templates = await db
      .collection('checklist_templates')
      .find({})
      .sort({ city: 1, businessType: 1 })
      .toArray();
    
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
    
    const template = {
      city: templateData.city,
      businessType: templateData.businessType,
      tasks: templateData.tasks,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('checklist_templates').insertOne(template);
    
    return NextResponse.json({ _id: result.insertedId, ...template });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}