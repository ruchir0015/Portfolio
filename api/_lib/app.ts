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
One-line pitch: A CS student and developer building full-stack products with a focus on interactive UI, AI applications, and system design.
Currently open to: internship opportunities
Best contact: rj863093701@gmail.com (responds within 1 day)
Resume: /Ruchir_Jain-Resume.pdf

=== EDUCATION ===
- ITS Engineering College, Greater Noida (AKTU)
  Degree: B.Tech, Computer Science & Engineering
  Years: 2024 – 2028 (Currently in 2nd Year)
  CGPA: 7.0 / 10
  Focus: Data Structures & Algorithms, OOP, API Design, Database Management, System Design

=== WORK EXPERIENCE ===
- Privault.AI (privault-theta.vercel.app)
  Role: Software Development Intern
  Duration: 15 Jun 2026 – 31 Jul 2026
  Description: Built and shipped the company's official website using React, TypeScript, and Tailwind CSS. Developed frontend modules for Consent Management, Data Discovery & Classification, and the Compliance Dashboard for DPDP compliance. Built and optimized scroll-driven 3D animations and component libraries.
  Tech: React, TypeScript, Vite, Tailwind CSS, Three.js, GSAP

=== SKILLS ===
Languages: C, Java, Python, JavaScript, TypeScript, SQL, Dart, HTML5, CSS3
Frontend: React 19, Next.js, Flutter, Vite, Tailwind CSS, Framer Motion, Three.js, GSAP
Backend: FastAPI, Flask, Node.js, Express.js, REST APIs, SQLAlchemy
AI / ML: PyTorch, YOLOv8, OpenCV, LSTM
Databases & Cloud: MySQL, PostgreSQL, SQLite, MongoDB, Supabase, Redis, Docker, AWS
Tools: Git, GitHub, Postman, VS Code, Figma, WebRTC

=== PROJECTS ===
1. Pravaah AI – Crowd & Traffic Command Platform
   URL: https://github.com/ruchir0015/PravaahAI
   Description: Real-time crowd & traffic management command platform built for the TechTrix hackathon. Converts multi-camera video feeds and venue floorplans into live green/yellow/red density heatmaps with YOLOv8 & OpenCV. Uses a 2-layer PyTorch LSTM trained on ShanghaiTech data to forecast zone congestion 3-5 cycles ahead. Features a Flask REST/MJPEG backend, React dashboard with operator approval and Telegram field alerts, and a QR-accessible attendee mobile app with live GPS and dynamic rerouting.
   Tech: Python, PyTorch, YOLOv8, OpenCV, Flask, React

2. Listen Together
   URL: https://github.com/ruchir0015/Listen-Together
   Description: A private, real-time synchronized music experience designed for two people to listen, share, and vibe together wherever they are. Built with Flutter and Dart, featuring WebRTC Data Channels for direct peer-to-peer high-fidelity audio streaming, Supabase Realtime for instant playback synchronization (play, pause, seek), collaborative playlists, and offline local cache.
   Tech: Flutter, Dart, Supabase, WebRTC, just_audio

3. Personal Portfolio (this site)
   URL: https://portfolio-git-main-ruchir15.vercel.app
   Description: An Indiana Jones / Tomb Raider inspired adventure portfolio with a parchment theme, 3D interactive elements (Lanyard, Infinite Menu), scroll-driven animations, and an AI Voice Chatbot assistant.
   Tech: React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Three.js / R3F, Express, Gemini API

4. Privault
   URL: https://privault-theta.vercel.app/
   Description: AI-powered data privacy and DPDP compliance platform. Ruchir contributed to front-end development, scroll-driven 3D animations, and the design system component library.
   Tech: React, TypeScript, Vite, Tailwind CSS, Three.js, GSAP

5. Urban Guardian
   URL: https://github.com/ruchir0015/Urban-Guardian
   Description: AI-powered personal safety app with dynamic safety heatmaps, SOS tools, safe route planning, and women's safety features using Google Maps API.
   Tech: React, Node.js, FastAPI, Google Maps API

6. Recipe Recommendation API
   Description: Backend API for recipe recommendations with an adaptable SQLAlchemy relational schema.
   Tech: FastAPI, SQLAlchemy, Python, PostgreSQL / SQLite

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

// Contact Form Endpoint
app.post('/api/contact', async (req: express.Request, res: express.Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required.' });
    return;
  }

  // Primary: Formspree (xqppdlyr)
  try {
    const fsResponse = await fetch('https://formspree.io/f/xqppdlyr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        subject: subject ? `[Portfolio] ${subject}` : `New message from ${name}`,
        message,
      }),
    });

    const fsData = await fsResponse.json();
    if (fsData.ok) {
      res.json({ success: true, delivered: true, message: 'Message sent via Formspree.' });
      return;
    }
  } catch (err: any) {
    console.error('Formspree server error:', err);
  }

  // Fallback: If RESEND_API_KEY is configured
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: ['rj863093701@gmail.com'],
          reply_to: email,
          subject: subject ? `[Portfolio] ${subject}` : `New message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || 'No subject'}\n\nMessage:\n${message}`,
        }),
      });

      if (response.ok) {
        res.json({ success: true, delivered: true, message: 'Message sent directly to inbox.' });
        return;
      }
      const errText = await response.text();
      console.error('Resend error:', errText);
    } catch (err: any) {
      console.error('Resend error:', err);
    }
  }

  // If WEB3FORMS_ACCESS_KEY is configured
  const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (web3formsKey) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: web3formsKey,
          name,
          email,
          subject: subject ? `[Portfolio] ${subject}` : `New message from ${name}`,
          message,
        }),
      });

      const data = await response.json();
      res.json({ ...data, delivered: data.success === true });
      return;
    } catch (err: any) {
      console.error('Web3Forms error:', err);
    }
  }

  // Log inquiry to console
  console.log(`[Contact Submission] From: ${name} <${email}> | Subject: ${subject}\nMessage:\n${message}`);

  res.json({
    success: true,
    delivered: false,
    message: 'Message logged. (Configure WEB3FORMS_ACCESS_KEY or RESEND_API_KEY in Vercel to receive emails directly in your inbox).',
  });
});

export default app;
