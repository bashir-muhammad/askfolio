import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const body: unknown = await req.json();
  if (
    typeof body !== "object" ||
    body === null ||
    !("content" in body) ||
    typeof body.content !== "string"
  ) {
    return Response.json({ error: "A message is required." }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    const geminiStream = await model.generateContentStream(body.content);
    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of geminiStream.stream) {
          controller.enqueue(chunk.text());
        }
        controller.close();
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
