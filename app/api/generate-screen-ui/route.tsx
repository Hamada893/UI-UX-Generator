import { openrouter } from "@/config/openrouter";
import { NextRequest, NextResponse } from "next/server";
import { GENERATE_SCREEN_UI_PROMPT } from "@/data/Prompt";
import { ScreenConfigTable } from "@/config/schema";
import { db } from "@/config/db";
import { and, eq } from "drizzle-orm";


export async function POST(req: NextRequest) {
  const { projectId, screenId, screenName, purpose, screenDescription, projectVisualDescription } = await req.json();

  const userInput = `
    screen name is: ${screenName},
    screen purpose is: ${purpose},
    screen description is: ${screenDescription},
  `
  try {
    const aiResponse = await openrouter.chat.send({
      chatRequest: {
        model: "qwen/qwen3.6-plus",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: GENERATE_SCREEN_UI_PROMPT,
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
  
    const code = aiResponse.choices[0]?.message?.content
    const updateResult = await db.update(ScreenConfigTable).set({
      code: code as string,
    }).where(and(eq(ScreenConfigTable.projectId, projectId as string), eq(ScreenConfigTable?.screenId, screenId as string))).returning();
  
    return NextResponse.json(updateResult[0]);
  } catch (error) {
    console.error('Failed to generate screen UI', error);
    return NextResponse.json({ error: 'Failed to generate screen UI, Internal Server Error' }, { status: 500 });
  }
}
