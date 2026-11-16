import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-config";
import { getChatsForUser } from "@/lib/chat-persistence";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chats = await getChatsForUser(session.user.email);
  return NextResponse.json({ chats });
}
