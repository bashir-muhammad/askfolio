import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const body = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
  const result = await model.generateContent(body.content);

  const text = result.response.text();

  // const responseStream = new ReadableStream({
  //   async start(controller) {
  //     for await (const chunk of geminiStream.stream) {
  //       controller.enqueue(chunk.text());
  //     }
  //     controller.close();
  //   },
  // });

  return NextResponse.json({ message: text });
}
