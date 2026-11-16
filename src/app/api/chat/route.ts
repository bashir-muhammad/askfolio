import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-config";
import { upsertChatMessage } from "@/lib/chat-persistence";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const GUEST_CHAT_LIMIT = 3;
const RATE_LIMIT_STORE = new Map<string, { count: number; resetAt: number }>();

function getRateLimitKey(req: Request, sessionUserEmail?: string | null) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const remoteAddress = req.headers.get("x-real-ip");

  if (sessionUserEmail) {
    return `user:${sessionUserEmail}`;
  }

  return `ip:${forwardedFor?.split(",")[0]?.trim() ?? remoteAddress ?? "unknown"}`;
}

function isRateLimited(req: Request, sessionUserEmail?: string | null) {
  const key = getRateLimitKey(req, sessionUserEmail);
  const now = Date.now();
  const state = RATE_LIMIT_STORE.get(key);

  if (!state || state.resetAt <= now) {
    RATE_LIMIT_STORE.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (state.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  state.count += 1;
  return false;
}

function getGuestUsageCount(body: unknown, req: Request) {
  const headerValue = req.headers.get("x-guest-chat-count");
  const payloadValue =
    typeof body === "object" && body !== null && "guestChatCount" in body
      ? body.guestChatCount
      : undefined;

  const candidate =
    typeof payloadValue === "number"
      ? payloadValue
      : headerValue !== null
        ? Number(headerValue)
        : NaN;

  return Number.isFinite(candidate) ? candidate : NaN;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body: unknown = await req.json();

  if (
    typeof body !== "object" ||
    body === null ||
    !("content" in body) ||
    typeof body.content !== "string"
  ) {
    return Response.json({ error: "A message is required." }, { status: 400 });
  }

  const content = body.content.trim();
  if (!content) {
    return Response.json({ error: "A message is required." }, { status: 400 });
  }

  if (content.length > 4000) {
    return Response.json(
      { error: "Your message is too long. Please shorten it and try again." },
      { status: 413 },
    );
  }

  const isAuthenticated = Boolean(session?.user?.email);
  const guestUsageCount = getGuestUsageCount(body, req);

  if (!isAuthenticated) {
    if (
      !Number.isFinite(guestUsageCount) ||
      guestUsageCount < 0 ||
      guestUsageCount >= GUEST_CHAT_LIMIT
    ) {
      return Response.json(
        { error: "You have used all 3 free chats. Please sign in to continue." },
        { status: 403 },
      );
    }
  }

  if (isRateLimited(req, session?.user?.email)) {
    return Response.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  const chatId =
    typeof body === "object" && body !== null && "chatId" in body && typeof body.chatId === "string"
      ? body.chatId
      : undefined;
  const title =
    typeof body === "object" && body !== null && "title" in body && typeof body.title === "string"
      ? body.title
      : undefined;

  try {
    if (session?.user?.email) {
      await upsertChatMessage(session.user.email, {
        chatId,
        title,
        role: "user",
        content,
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    const geminiStream = await model.generateContentStream(content);
    const responseChunks: string[] = [];

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of geminiStream.stream) {
            const text = chunk.text();
            responseChunks.push(text);
            controller.enqueue(text);
          }

          if (session?.user?.email) {
            await upsertChatMessage(session.user.email, {
              chatId,
              title,
              role: "assistant",
              content: responseChunks.join(""),
            });
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(responseStream);
  } catch (error) {
    console.error("Gemini request failed:", error);
    return Response.json(
      { error: "The response could not be completed. Please try again." },
      { status: 502 },
    );
  }
}
