import { NextRequest } from "next/server";
import { openrouter } from "@/config/openrouter";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/Prompt";
import { NextResponse } from "next/server";
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
      model: "qwen/qwen3.6-plus:free",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: APP_LAYOUT_CONFIG_PROMPT.replace("{deviceType}", deviceType),
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
  console.log(aiResponse)
  return NextResponse.json(JSONAiResult);
}
