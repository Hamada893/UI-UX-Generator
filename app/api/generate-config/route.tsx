import { NextRequest } from "next/server";
import { openrouter } from "@/config/openrouter";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/Prompt";
import { NextResponse } from "next/server";
import { ScreenConfigTable } from "@/config/schema";
import { db } from "@/config/db";
import { ProjectsTable } from "@/config/schema";
import { eq } from "drizzle-orm";
export async function POST(req: NextRequest) {
  const { userInput, deviceType, projectId } = await req.json();

  // #region agent log
  fetch("http://127.0.0.1:7828/ingest/ddfa51bf-b980-45e0-8bfb-c3680ba4b51f", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "cdc050",
    },
    body: JSON.stringify({
      sessionId: "cdc050",
      runId: "verify",
      hypothesisId: "A",
      location: "generate-config/route.tsx:POST",
      message: "after parse body",
      data: {
        userInputLen: typeof userInput === "string" ? userInput.length : -1,
        hasDeviceType: deviceType != null && deviceType !== "",
        hasProjectId: projectId != null && projectId !== "",
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const aiResponse = await openrouter.chat.send({
    chatRequest: {
      model: "stepfun/step-3.5-flash:free", //use qwen/qwen3.6-plus:free if run into visual issues in the future
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: APP_LAYOUT_CONFIG_PROMPT.replaceAll("{deviceType}", deviceType),
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

  // #region agent log
  fetch("http://127.0.0.1:7828/ingest/ddfa51bf-b980-45e0-8bfb-c3680ba4b51f", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "cdc050",
    },
    body: JSON.stringify({
      sessionId: "cdc050",
      runId: "verify",
      hypothesisId: "D",
      location: "generate-config/route.tsx:POST",
      message: "openrouter chat.send resolved",
      data: {
        choicesCount: aiResponse.choices?.length ?? -1,
        responseModel: aiResponse.model,
        hasFirstContent:
          aiResponse.choices?.[0]?.message?.content != null &&
          aiResponse.choices[0].message.content !== "",
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  
  const JSONAiResult = JSON.parse(aiResponse.choices[0]?.message?.content as string);


  if (JSONAiResult?.projectVisualDescription && JSONAiResult?.projectName) {
    await db.update(ProjectsTable).set({
      projectVisualDescription: JSONAiResult?.projectVisualDescription,
      projectName: JSONAiResult?.projectName,
      theme: JSONAiResult?.theme,
    }).where(eq(ProjectsTable.projectId, projectId as string));

    JSONAiResult.screens?.forEach(async (screen: any) => {
      const result = await db.insert(ScreenConfigTable).values({
        projectId: projectId,
        purpose: screen.purpose,
        screenDescription: screen?.layoutDescription,
        screenId: screen?.id,
        screenName: screen?.name,
      })
    })
    return NextResponse.json(JSONAiResult);
  } else {
    return NextResponse.json({ error: "Failed to generate project config, Internal Server Error" }, { status: 500 });
  }
}
