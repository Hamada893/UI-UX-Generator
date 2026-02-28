import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { ProjectsTable } from "@/config/schema";

/**
 * Create a new project record from the request body and return the inserted record.
 *
 * Expects the request JSON body to contain `userInput`, `deviceType`, and `projectId`. The created record will use the authenticated user's primary email as `userId`.
 *
 * @param req - Incoming NextRequest whose JSON body must include `userInput`, `deviceType`, and `projectId`
 * @returns The newly created project record (the first row returned from the insert)
 */
export async function POST(req: NextRequest) {
  const {userInput, deviceType, projectId} = await req.json()
  const user = await currentUser()

  const result = await db.insert(ProjectsTable).values({
    projectId: projectId,
    userId: user?.primaryEmailAddress?.emailAddress as string,
    deviceType: deviceType,
    userInput: userInput,
  }).returning()

  return NextResponse.json(result[0])
}
