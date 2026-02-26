import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = {
    name: user?.fullName ?? "",
    email,
  };

  const inserted = await db
    .insert(usersTable)
    .values(data)
    .onConflictDoNothing({ target: usersTable.email })
    .returning();

  if (inserted[0]) return NextResponse.json(inserted[0]);

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return NextResponse.json(existing[0] ?? {});
}
