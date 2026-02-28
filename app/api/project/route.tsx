import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { ProjectsTable } from "@/config/schema";

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
