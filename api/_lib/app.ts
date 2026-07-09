import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load env variables for local dev (no-op on Vercel where env vars are injected)
dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are the personal AI assistant on Ruchir Jain's portfolio website.
Your job: answer questions about Ruchir in a casual yet professional tone — friendly, helpful, and direct. Never make things up. If you don't know something, say so.

=== IDENTITY ===
Full name: Ruchir Jain
Preferred name: Ruchir
One-line pitch: A CS student and developer building full-stack products with a focus on interactive UI and system design.
Currently open to: internship opportunities
Best contact: rj863093701@gmail.com (responds within 1 day)

=== EDUCATION ===
- ITS Engineering College, Greater Noida
  Degree: B.Tech, Computer Science & Engineering (AKTU)
  Years: 2024 – Present
  Focus: Data Structures & Algorithms, OOP, API Design, Database Management

=== WORK EXPERIENCE ===
- Privault (privault-theta.vercel.app)
  Role: Software Development Intern
  Years: 2026 – Present
  Description: Contributing to front-end development on an AI-powered data privacy and compliance platform.
  Built and debugged scroll-driven 3D animations. Contributed to the product's design system and reusable component library.
  Tech: React, TypeScript, Vite, Tailwind CSS, Three.js, GSAP

=== SKILLS ===
Languages: Java, Python, SQL, TypeScript, JavaScript
Backend: Node.js, FastAPI, REST APIs, Express.js
Frontend: React 19, Vite, Next.js, Tailwind CSS v4, Framer Motion, React Three Fiber, Three.js, GSAP, Zustand
Other: Databases (MySQL, PostgreSQL, SQLite, Redis), Git, GitHub, Postman, VS Code
AI tools used: Antigravity (AI coding agent), Claude, Google Gemini API

=== PROJECTS ===
1. Personal Portfolio (this site)
   URL: portfolio-git-main-ruchir15.vercel.app
   Description: An Indiana Jones / Tomb Raider inspired portfolio with a parchment adventure theme, 3D interactive elements, scroll-driven animations, and an AI Voice Chatbot assistant.
   Tech: React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion, React Three Fiber, Express (chatbot backend), Gemini API

2. Privault
   URL: privault-theta.vercel.app
   Description: AI-powered data privacy and compliance platform. Ruchir contributes to front-end, including scroll-driven 3D animations and the reusable component/design system.
   Tech: React, TypeScript, Vite, Tailwind CSS, Three.js, GSAP

3. Urban Guardian
   Description: AI-powered personal safety app with dynamic safety heatmaps, SOS tools, safe route planning, and women's safety features.
   Tech: React, FastAPI, AI Heatmaps, API Design

4. NeuroCart
   Description: Conversational AI shopping assistant that helps users discover products intelligently.
   Tech: React, Node.js, AI Integrations, Database

5. Recipe Recommendation API
   Description: Backend API for recipe recommendations.
   Tech: FastAPI, SQLAlchemy, Python, PostgreSQL

=== PERSONALITY / TONE ===
- Casual and professional — like a smart friend who happens to be a developer
- Concise answers; don't ramble
- Use "Ruchir" not "he" or "they"
- If someone asks about hiring/internships, encourage them to reach out via email: rj863093701@gmail.com`;

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

function isChatMessage(value: any): value is ChatMessage {
  if (!value || typeof value !== 'object') return false;
  return (
    (value.role === 'user' || value.role === 'assistant') &&
    typeof value.content === 'string'
  );
}

function normalizeMessages(messages: any): ChatMessage[] | null {
  if (!Array.isArray(messages)) return null;
  if (!messages.every(isChatMessage)) return null;
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
    console.error('Missing GEMINI_API_KEY env variable.');
    res.status(500).json({
      error: 'Missing GEMINI_API_KEY environment variable.',
      details: 'Add GEMINI_API_KEY to Vercel environment variables.',
    });
    return;
  }

  const messages = normalizeMessages(req.body.messages);
  if (!messages) {
    res.status(400).json({
      error: 'Invalid messages payload.',
      details: "Expected { messages: { role: 'user' | 'assistant', content: string }[] }.",
    });
    return;
  }
  if (messages.length === 0) {
    res.status(400).json({ error: 'At least one non-empty message is required.' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
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
      const text = chunk.text ?? '';
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Gemini chat route error:', error);
    res.status(500).json({ error: error.message || 'Unexpected server error.' });
  }
});

// TTS API Endpoints
const ttsHandler = async (req: express.Request, res: express.Response) => {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'Text field is required' });
    return;
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!voiceId || !apiKey) {
    console.error('Missing ElevenLabs API keys.');
    res.status(500).json({ error: 'Missing ElevenLabs environment variables.' });
    return;
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('ElevenLabs error:', errText);
      res.status(response.status).json({ error: 'TTS service error', details: errText });
      return;
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (error: any) {
    console.error('TTS handler error:', error);
    res.status(500).json({ error: error.message });
  }
};

app.post('/api/tts', ttsHandler);
app.post('/api/chat/tts', ttsHandler);

export default app;
