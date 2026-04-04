import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const {userInput, deviceType, projectId} = await req.json()
  
}
