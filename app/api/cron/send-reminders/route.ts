import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { resend } from '@/lib/resend';
import { getDaysUntil, formatDate } from '@/lib/utils/date';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('compliance_buddy');
    
    // Find reminders that are due within 30 days and haven't been sent
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const upcomingReminders = await db.collection('reminders')
      .aggregate([
        {
          $match: {
            dueDate: { $lte: thirtyDaysFromNow },
            sent: false
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'clerkId',
            as: 'user'
          }
        },
        {
          $match: {
            'user.subscription': 'paid'
          }
        }
      ])
      .toArray();

    for (const reminder of upcomingReminders) {
      const user = reminder.user[0];
      const daysUntil = getDaysUntil(new Date(reminder.dueDate));
      
      if (daysUntil <= 30 && daysUntil >= 0) {
        try {
          await resend.emails.send({
            from: 'Compliance Buddy <noreply@compliancebuddy.com>',
            to: user.email,
            subject: `Reminder: ${reminder.taskName} due in ${daysUntil} days`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #F97316;">Compliance Reminder</h1>
                <p>Hello ${user.firstName || 'there'},</p>
                
                <p>This is a friendly reminder that your <strong>${reminder.taskName}</strong> 
                in <strong>${reminder.city}</strong> is due in <strong>${daysUntil} days</strong>.</p>
                
                <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Task:</strong> ${reminder.taskName}</p>
                  <p style="margin: 10px 0 0 0;"><strong>Due Date:</strong> ${formatDate(new Date(reminder.dueDate))}</p>
                  <p style="margin: 10px 0 0 0;"><strong>City:</strong> ${reminder.city}</p>
                </div>
                
                <p>Don't forget to renew on time to stay compliant!</p>
                
                <p style="margin-top: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                     style="background-color: #F97316; color: white; padding: 12px 24px; 
                            text-decoration: none; border-radius: 6px; font-weight: bold;">
                    View My Checklists
                  </a>
                </p>
                
                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                  Best regards,<br>
                  The Compliance Buddy Team
                </p>
              </div>
            `,
          });

          // Mark reminder as sent
          await db.collection('reminders').updateOne(
            { _id: reminder._id },
            { $set: { sent: true } }
          );
          
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }
    }
    
    return NextResponse.json({ 
      message: `Processed ${upcomingReminders.length} reminders` 
    });
  } catch (error) {
    console.error('Error in send-reminders cron:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}