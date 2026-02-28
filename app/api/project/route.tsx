import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { ProjectsTable, usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userInput, deviceType, projectId } = body;

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!user || !email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [dbUser] = await db
      .select({ email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database. Complete sign-in first." },
        { status: 403 }
      );
    }

    if (!deviceType || !projectId) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const result = await db.insert(ProjectsTable).values({
      projectId,
      userId: email,
      deviceType,
      userInput: userInput ?? null,
    }).returning();

    return NextResponse.json(result[0]);
  } catch (err) {
    console.error("[POST /api/project]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to create project", details: message },
      { status: 500 }
    );
  }
}
