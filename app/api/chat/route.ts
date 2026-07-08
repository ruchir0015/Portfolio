import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are [Ruchir Jain]'s personal assistant on their portfolio website.
Answer questions about their background, projects, and experience.
Keep answers concise and friendly. Here's what you know:
- Currently: [Intern] at [KYQA]
- Projects: [Project 1], [Project 2]
- Skills: [Your skills]
- Contact: your@email.com
If you don't know something, say so - don't make things up.`;

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatRequestBody {
  messages?: unknown;
}

function jsonError(status: number, error: string, details?: string) {
  return Response.json(
    {
      error,
      ...(details ? { details } : {}),
    },
    { status }
  );
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string"
  );
}

function normalizeMessages(messages: unknown): ChatMessage[] | null {
  if (!Array.isArray(messages)) {
    return null;
  }

  if (!messages.every(isChatMessage)) {
    return null;
  }

  return messages
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }))
    .filter((message) => message.content.length > 0);
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return jsonError(
      500,
      "Missing GEMINI_API_KEY environment variable.",
      "Add GEMINI_API_KEY to .env.local and restart the server."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return jsonError(400, "Invalid JSON request body.");
  }

  const messages = normalizeMessages(body.messages);
  if (!messages) {
    return jsonError(
      400,
      "Invalid messages payload.",
      "Expected { messages: { role: 'user' | 'assistant', content: string }[] }."
    );
  }
  if (messages.length === 0) {
    return jsonError(400, "At least one non-empty message is required.");
  }

  try {
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 1024,
      },
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text ?? "";
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Gemini streaming error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ text: "\n\nSorry, I ran into a streaming issue. Please try again." })}\n\n`
            )
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Gemini chat route error:", error);
    if (error instanceof Error) {
      return jsonError(500, error.message);
    }
    return jsonError(500, "Unexpected server error.");
  }
}

