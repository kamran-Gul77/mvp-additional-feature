import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("compliance_buddy");

    const user = await db.collection("users").findOne({ clerkId: userId });

    if (!user) {
      // Get user data from Clerk and create user if doesn't exist
      const clerkUser = await currentUser();

      if (!clerkUser) {
        return NextResponse.json(
          { error: "User not found in Clerk" },
          { status: 404 }
        );
      }

      const newUser = {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        subscription: "free",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection("users").insertOne(newUser);
      console.log("User created in MongoDB via API:", userId);
      return NextResponse.json(newUser);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
