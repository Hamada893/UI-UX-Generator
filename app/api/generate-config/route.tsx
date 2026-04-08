import { NextRequest } from "next/server";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/Prompt";
import { NextResponse } from "next/server";
import { ScreenConfigTable } from "@/config/schema";
import { db } from "@/config/db";
import { ProjectsTable } from "@/config/schema";
import { eq } from "drizzle-orm";

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
  const { userInput, deviceType, projectId } = await req.json();

  try {
    const { openrouter } = await import("@/config/openrouter");
    const aiResponse = await openrouter.chat.send({
      chatRequest: {
        model: "openai/gpt-5.1-codex-mini",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: APP_LAYOUT_CONFIG_PROMPT.replaceAll(
                  "{deviceType}",
                  deviceType
                ),
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userInput,
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
      await db
        .update(ProjectsTable)
        .set({
          projectVisualDescription: JSONAiResult?.projectVisualDescription,
          projectName: JSONAiResult?.projectName,
          theme: JSONAiResult?.theme,
        })
        .where(eq(ProjectsTable.projectId, projectId as string));

      JSONAiResult.screens?.forEach(async (screen: any) => {
        await db.insert(ScreenConfigTable).values({
          projectId: projectId,
          purpose: screen.purpose,
          screenDescription: screen?.layoutDescription,
          screenId: screen?.id,
          screenName: screen?.name,
        });
      });
      return NextResponse.json(JSONAiResult);
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
