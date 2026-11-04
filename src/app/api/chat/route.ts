import { GoogleGenerativeAI } from "@google/generative-ai";

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

  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
  const { stream } = await model.generateContentStream(body.content);
  const encoder = new TextEncoder();
  const iterator = stream[Symbol.asyncIterator]();

  const responseStream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await iterator.next();
        if (done) {
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(value.text()));
      } catch (error) {
        controller.error(error);
      }
    },
    async cancel() {
      await iterator.return?.(undefined);
    },
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
