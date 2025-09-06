import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongodb";
import { addDaysToDate } from "@/lib/utils/date";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("compliance_buddy");

    // Ensure user exists in MongoDB
    await ensureUserExists(userId, db);

    const checklists = await db
      .collection("checklists")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(checklists);
  } catch (error) {
    console.error("Error fetching checklists:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { city, businessType } = await request.json();

    if (!city || !businessType) {
      return NextResponse.json(
        { error: "City and business type are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("compliance_buddy");

    // Ensure user exists in MongoDB
    await ensureUserExists(userId, db);

    // Check user subscription and limits
    const user = await db.collection("users").findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const checklistCount = await db
      .collection("checklists")
      .countDocuments({ userId });
    if (user.subscription === "free" && checklistCount >= 1) {
      return NextResponse.json(
        {
          error:
            "Free plan allows only 1 checklist. Upgrade to Pro for unlimited checklists.",
        },
        { status: 403 }
      );
    }

    // Get template
    const template = await db
      .collection("checklist_templates")
      .findOne({ city, businessType });
    if (!template) {
      return NextResponse.json(
        { error: "Template not found for this city and business type" },
        { status: 404 }
      );
    }

    // Create checklist with due dates
    const tasksWithDates = template.tasks.map((task: any) => ({
      task: task.task,
      renewal: task.renewal,
      completed: false,
      dueDate: getDueDateFromRenewal(task.renewal),
    }));

    const checklist = {
      userId,
      city,
      businessType,
      tasks: tasksWithDates,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("checklists").insertOne(checklist);

    // Create reminders for paid users
    if (user.subscription === "paid") {
      const reminders = tasksWithDates
        .filter((task: { dueDate: any }) => task.dueDate)
        .map((task: { task: any; dueDate: any }) => ({
          userId,
          checklistId: result.insertedId,
          taskName: task.task,
          city,
          dueDate: task.dueDate,
          sent: false,
          createdAt: new Date(),
        }));

      if (reminders.length > 0) {
        await db.collection("reminders").insertMany(reminders);
      }
    }

    return NextResponse.json({ _id: result.insertedId, ...checklist });
  } catch (error) {
    console.error("Error creating checklist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to ensure user exists in MongoDB
async function ensureUserExists(userId: string, db: any) {
  const existingUser = await db
    .collection("users")
    .findOne({ clerkId: userId });

  if (!existingUser) {
    try {
      const clerkUser = await currentUser();

      if (clerkUser) {
        const newUser = {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          subscription: "free",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.collection("users").insertOne(newUser);
        console.log("User created in MongoDB via ensureUserExists:", userId);
      }
    } catch (error) {
      console.error("Error creating user in ensureUserExists:", error);
    }
  }
}
function getDueDateFromRenewal(renewal: string): Date | undefined {
  const now = new Date();
  const renewalLower = renewal.toLowerCase();

  if (renewalLower.includes("annual") || renewalLower.includes("year")) {
    return addDaysToDate(now, 365);
  } else if (renewalLower.includes("6 months")) {
    return addDaysToDate(now, 180);
  } else if (renewalLower.includes("3 months")) {
    return addDaysToDate(now, 90);
  } else if (
    renewalLower.includes("monthly") ||
    renewalLower.includes("month")
  ) {
    return addDaysToDate(now, 30);
  } else if (renewalLower.includes("weekly") || renewalLower.includes("week")) {
    return addDaysToDate(now, 7);
  }

  // Try to extract number of months
  const monthMatch = renewal.match(/(\d+)\s*months?/i);
  if (monthMatch) {
    return addDaysToDate(now, parseInt(monthMatch[1]) * 30);
  }

  return undefined;
}
