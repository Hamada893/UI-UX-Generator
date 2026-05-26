import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { ProjectsTable, ScreenConfigTable, usersTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const user = await currentUser();

    const result = await db.select().from(ProjectsTable).where(and(eq(ProjectsTable.projectId, projectId as string), eq(ProjectsTable.userId, user?.primaryEmailAddress?.emailAddress as string)));
    const screenConfig = await db.select().from(ScreenConfigTable).where(eq(ScreenConfigTable.projectId, projectId as string));
    return NextResponse.json({
      projectDetail: result[0],
      screenConfig: screenConfig,
    });
  } catch (err) {
    console.error("[GET /api/project]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { projectName, theme, projectId } = await req.json();
    // #region agent log
    fetch('http://127.0.0.1:7629/ingest/ef469cf5-8a62-4f7c-b9b9-2f1e881ef921',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'971e07'},body:JSON.stringify({sessionId:'971e07',location:'route.tsx:PUT:entry',message:'put handler',data:{projectName,theme,projectId,hasProjectId:!!projectId},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    const result = await db
      .update(ProjectsTable)
      .set({
        projectName: projectName,
        theme: theme,
        projectId: projectId,
      })
      .where(eq(ProjectsTable.projectId, projectId))
      .returning();

    // #region agent log
    fetch('http://127.0.0.1:7629/ingest/ef469cf5-8a62-4f7c-b9b9-2f1e881ef921',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'971e07'},body:JSON.stringify({sessionId:'971e07',location:'route.tsx:PUT:afterUpdate',message:'update result',data:{rowCount:result.length,firstRow:result[0]??null},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    return NextResponse.json(result[0]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // #region agent log
    fetch('http://127.0.0.1:7629/ingest/ef469cf5-8a62-4f7c-b9b9-2f1e881ef921',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'971e07'},body:JSON.stringify({sessionId:'971e07',location:'route.tsx:PUT:catch',message:'put threw',data:{message},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    console.error("[PUT /api/project]", err);
    return NextResponse.json(
      { error: "Failed to update project", details: message },
      { status: 500 }
    );
  }
}