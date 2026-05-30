import { NextRequest } from "next/server";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/Prompt";
import { NextResponse } from "next/server";
import { ScreenConfigTable } from "@/config/schema";
import { db } from "@/config/db";
import { ProjectsTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { normalizeThemeKey } from "@/data/themes";
import { currentUser } from "@clerk/nextjs/server";
import { GENRATE_NEW_SCREEN_IN_EXISITING_PROJECT_PROJECT } from "@/data/Prompt";

const parseAiJson = (raw: string) => {
  const trimmed = raw.trim();
  const withoutFences = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  const candidates = [trimmed, withoutFences];
  const startIdx = withoutFences.indexOf("{");
  const endIdx = withoutFences.lastIndexOf("}");

  if (startIdx >= 0 && endIdx > startIdx) {
    candidates.push(withoutFences.slice(startIdx, endIdx + 1));
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // try next candidate
    }
  }

  throw new Error("Unable to parse model output as JSON");
};

export async function POST(req: NextRequest) {
  const {
    userInput,
    deviceType,
    projectId,
    projectName,
    theme,
    oldScreenDescription,
    existingScreens,
    projectVisualDescription,
  } = await req.json();

  if (!projectId || !userInput || !deviceType) {
    return NextResponse.json(
      { error: "Invalid request payload: missing projectId, userInput, or deviceType" },
      { status: 400 }
    );
  }

  try {
    const { openrouter } = await import("@/config/openrouter");
    const aiResponse = await openrouter.chat.send({
      chatRequest: {
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: oldScreenDescription ? 
                GENRATE_NEW_SCREEN_IN_EXISITING_PROJECT_PROJECT.replaceAll("{deviceType}", deviceType).replaceAll("{projectName}", projectName).replaceAll("{theme}", theme).replaceAll("{oldScreenDescription}", oldScreenDescription)
                : APP_LAYOUT_CONFIG_PROMPT.replaceAll("{deviceType}", deviceType),
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: oldScreenDescription
                  ? `${userInput}\n\nexistingProject:\n${JSON.stringify({
                      projectName: projectName ?? "",
                      theme: theme ?? "",
                      projectVisualDescription: projectVisualDescription ?? "",
                      screens: existingScreens ?? [],
                    })}\n\nOld screen description is: ${oldScreenDescription}`
                  : userInput,
              },
            ],
          },
        ],
        stream: false,
      },
    });

    const firstContent = aiResponse.choices[0]?.message?.content as string;
    const JSONAiResult = parseAiJson(firstContent);

    if (JSONAiResult?.projectVisualDescription && JSONAiResult?.projectName) {
      const normalizedTheme = normalizeThemeKey(
        oldScreenDescription ? (theme ?? JSONAiResult?.theme) : JSONAiResult?.theme
      );

      if (!oldScreenDescription) {
        await db
          .update(ProjectsTable)
          .set({
            projectVisualDescription: JSONAiResult?.projectVisualDescription,
            projectName: JSONAiResult?.projectName,
            theme: normalizedTheme,
          })
          .where(eq(ProjectsTable.projectId, projectId as string));
      }

      const existingRows = await db
        .select({ screenId: ScreenConfigTable.screenId })
        .from(ScreenConfigTable)
        .where(eq(ScreenConfigTable.projectId, projectId as string));
      const existingIds = new Set(existingRows.map((row) => row.screenId));

      for (const screen of JSONAiResult.screens ?? []) {
        if (existingIds.has(screen.id)) {
          continue;
        }
        await db.insert(ScreenConfigTable).values({
          projectId: projectId,
          purpose: screen.purpose,
          screenDescription: screen?.layoutDescription,
          screenId: screen?.id,
          screenName: screen?.name,
        });
        existingIds.add(screen.id);
      }

      return NextResponse.json({
        ...JSONAiResult,
        projectName: projectName ?? JSONAiResult?.projectName,
        theme: normalizedTheme,
        projectVisualDescription:
          projectVisualDescription ?? JSONAiResult?.projectVisualDescription,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to generate project config, Internal Server Error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Failed to generate project config", error);
    return NextResponse.json(
      { error: "Failed to generate project config, Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get('projectId');
  const screenId = req.nextUrl.searchParams.get('screenId');
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.delete(ScreenConfigTable).where(and(eq(ScreenConfigTable.projectId, projectId as string), eq(ScreenConfigTable.screenId, screenId as string)));
  if (!result) {
    return NextResponse.json({ error: "Screen not found or failed to delete" }, { status: 404 });
  }

  return NextResponse.json({ message: "Screen deleted successfully" });
}
