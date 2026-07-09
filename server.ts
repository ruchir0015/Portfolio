import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load env variables from .env.local
dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are Ruchir Jain's personal assistant on their portfolio website.
Answer questions about their background, projects, and experience.
Keep answers concise and friendly. Here's what you know:
- Currently: Software Development Intern at KYQA, B.Tech Computer Science & Engineering student (2nd Year) at ITS Engineering College.
- Projects:
  1. Personal Portfolio: Interactive Indiana Jones/Tomb Raider inspired theme built with React, Vite, TypeScript, Tailwind, Framer Motion, 3D interactive features, and AI Voice Chatbot.
  2. Urban Guardian: AI-powered personal safety app with dynamic safety heatmaps, SOS tools, safe route planning, and women's safety features.
  3. NeuroCart: Conversational AI shopping assistant that helps users discover products intelligently.
  4. Recipe Recommendation: Backend API built using FastAPI, SQLAlchemy, PostgreSQL, and Python.
- Skills: Java, Python, JavaScript, TypeScript, SQL, React, Next.js, Tailwind CSS, HTML5, CSS3, Node.js, Express.js, FastAPI, REST APIs, MySQL, PostgreSQL, SQLite, Redis, Git, GitHub, VS Code, Postman, Celery, Framer Motion, Vite.
- Contact: ruchirjain@example.com
If you don't know something, say so - don't make things up.`;

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

function isChatMessage(value: any): value is ChatMessage {
  if (!value || typeof value !== 'object') {
    return false;
  }
  return (
    (value.role === 'user' || value.role === 'assistant') &&
    typeof value.content === 'string'
  );
}

function normalizeMessages(messages: any): ChatMessage[] | null {
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

// Chat API Endpoint
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY env variable.");
    res.status(500).json({
      error: "Missing GEMINI_API_KEY environment variable.",
      details: "Add GEMINI_API_KEY to .env.local and restart the server."
    });
    return;
  }

  const messages = normalizeMessages(req.body.messages);
  if (!messages) {
    res.status(400).json({
      error: "Invalid messages payload.",
      details: "Expected { messages: { role: 'user' | 'assistant', content: string }[] }."
    });
    return;
  }
  if (messages.length === 0) {
    res.status(400).json({ error: "At least one non-empty message is required." });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
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

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of responseStream) {
      const text = chunk.text ?? "";
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    console.error("Gemini chat route error:", error);
    res.status(500).json({ error: error.message || "Unexpected server error." });
  }
});

// TTS API Endpoints
const ttsHandler = async (req: express.Request, res: express.Response) => {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: "Text field is required" });
    return;
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!voiceId || !apiKey) {
    console.error("Missing ElevenLabs API keys.");
    res.status(500).json({ error: "Missing ElevenLabs environment variables." });
    return;
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("ElevenLabs error:", errText);
      res.status(response.status).json({ error: "TTS service error", details: errText });
      return;
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (error: any) {
    console.error("TTS handler error:", error);
    res.status(500).json({ error: error.message });
  }
};

app.post('/api/tts', ttsHandler);
app.post('/api/chat/tts', ttsHandler);

const PORT = process.env.PORT || 3001;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[API] Server is running on http://localhost:${PORT}`);
  });
}

export default app;

