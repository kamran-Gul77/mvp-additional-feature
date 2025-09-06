import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occured -- no svix headers", {
        status: 400,
      });
    }

    // Get the body
    const payload = await request.text();
    const body = JSON.parse(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occured", {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("compliance_buddy");

    switch (evt.type) {
      case "user.created":
        const userData = evt.data;

        const newUser = {
          clerkId: userData.id,
          email: userData.email_addresses[0]?.email_address || "",
          firstName: userData.first_name,
          lastName: userData.last_name,
          subscription: "free",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.collection("users").insertOne(newUser);
        console.log("User created in MongoDB:", userData.id);
        break;

      case "user.updated":
        const updatedUserData = evt.data;

        await db.collection("users").updateOne(
          { clerkId: updatedUserData.id },
          {
            $set: {
              email: updatedUserData.email_addresses[0]?.email_address || "",
              firstName: updatedUserData.first_name,
              lastName: updatedUserData.last_name,
              updatedAt: new Date(),
            },
          }
        );
        console.log("User updated in MongoDB:", updatedUserData.id);
        break;

      case "user.deleted":
        const deletedUserData = evt.data;

        // Delete user and related data
        await db.collection("users").deleteOne({ clerkId: deletedUserData.id });
        await db
          .collection("checklists")
          .deleteMany({ userId: deletedUserData.id });
        await db
          .collection("reminders")
          .deleteMany({ userId: deletedUserData.id });
        console.log("User deleted from MongoDB:", deletedUserData.id);
        break;

      default:
        console.log(`Unhandled webhook type: ${evt.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling Clerk webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
