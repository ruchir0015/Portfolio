# 🎒 Adventurer's Log: Ruchir Jain's Interactive Portfolio

> *"Every stop, a story. Every role, a relic. Welcome to the digital quest log."*

An immersive, RPG/Indiana Jones-inspired developer portfolio built for the modern web. This project combines classic adventure aesthetic (parchment texture, gold accents, old maps) with cutting-edge front-end technologies like 3D interactive physics and conversational AI.

Live Deployment: [Venture Forth](https://portfolio-git-main-ruchir15.vercel.app)

---

## 🗺️ Key Artifacts & Features

### 1. The Hero Compass (Hero Section)
* **Nebula & Aurora Blends:** Beautiful, layered CSS-animated glowing backdrops.
* **Firefly Layer:** A lightweight HTML5 canvas particle layer that floats and sways based on mathematical wave functions.
* **Adventure Callouts:** Quick links to *"Venture Forth"* (About Dossier) or *"See the Quest Log"* (Experience Timeline).

### 2. The Explorer Badge (Interactive Lanyard)
* **Desktop (3D Physics):** A fully interactive 3D ID card hanging from a physical lanyard string. Powered by `@react-three/fiber`, `@react-three/drei`, and `@react-three/rapier` physics. Drag the badge to watch it swing, collide, and spin!
* **Mobile (Performance Optimized):** A custom-designed, lightweight, pure 2D HTML/CSS 3D flip card. Emulates the appearance of the metal clip, strap, and badge texture while preserving smooth 60fps animations.
* **Double-Sided Design:** Click or tap to flip between the front card (`/second.jpeg`) and back card (`/first.png`).

### 3. The Treasure Map (Experience Timeline)
* An interactive map charting prior expeditions and roles.
* Interactive coordinate nodes showing:
  * **Privault (Software Development Intern):** Contributing to AI-powered data privacy solutions, scroll-driven 3D web animations (Three.js/GSAP), and design systems.
  * **ITS Engineering College (B.Tech CSE):** Learning core CS foundations (DSA, databases, programming paradigms).

### 4. Legendary Builds (Projects Inventory)
An inventory of conquered codebases categorized by RPG item rarity:
* 🛡️ **Personal Portfolio** (Equipped) — Vite + React + Framer Motion + Gemini AI
* 🌌 **Privault** (Mythic) — Compliance Platform + GSAP + 3D
* 🚨 **Urban Guardian** (Legendary) — AI-powered route safety and SOS heatmap application
* 🛒 **NeuroCart** (Epic) — AI conversational shopping assistant
* 🍳 **Recipe Recommendation API** (Rare) — Python + FastAPI + PostgreSQL

### 5. The Campfire Companion (Conversational AI Chatbot)
* A fully integrated chat assistant that resides in the portfolio.
* Powered by the **Google Gen AI SDK (Gemini)** via a local Express server.
* Answers questions about Ruchir's skills, experience, projects, and personality using specialized system prompts.

---

## 🛠️ The Tech Forge

### Frontend
* **Core:** React 19, TypeScript, Vite 6
* **Styling:** Tailwind CSS v4, Vanilla CSS transitions
* **3D & Physics:** `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier` (physics), `meshline` (lanyard rope geometry)
* **Animation:** Framer Motion, GSAP, Custom Canvas Renderers

### Backend
* **Server:** Express.js, Tsx (TypeScript runner)
* **AI integration:** `@google/genai` (Official Gemini API)
* **Deployment Support:** Vercel config with API routing

---

## 🔑 Setup & Local Run

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A Google Gemini API Key (for the conversational chatbot)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ruchir0015/Portfolio_sample.git
   cd Portfolio_sample/portfolio
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the `portfolio` root directory:
   ```env
   PORT=5000
   VITE_API_URL=http://localhost:5000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch the Development Server:**
   This command starts the Vite frontend server and the Express backend server concurrently:
   ```bash
   npm run dev
   ```
   * Frontend will be live at: [http://localhost:5173](http://localhost:5173)
   * Backend API server will be live at: [http://localhost:5000](http://localhost:5000)

---

## 📁 Repository Structure

```
portfolio/
├── api/                  # Serverless function handlers for deployment (e.g., Vercel)
├── public/               # Static assets (images, fonts, resume, 3D GLB models)
├── src/
│   ├── components/
│   │   ├── chatbot/      # AI Portfolio chatbot components
│   │   └── portfolio/    # RPG themed portfolio pages/sections
│   │       ├── Lanyard.tsx      # Dual desktop-3D / mobile-CSS badge component
│   │       ├── portfolio-data.ts# Game database / portfolio profile details
│   │       └── ...
│   ├── lib/              # Utility helpers
│   ├── App.tsx           # Application structure
│   ├── index.css         # Custom canvas keyframe rules and theme variables
│   └── main.tsx          # React application entrypoint
├── server.ts             # Express chatbot server running Gemini Pro
├── vite.config.ts        # Vite environment & plugin configs
└── tsconfig.json         # TypeScript rules configuration
```

---

## 📜 Quest License

This quest log is open source and available under the MIT License. Feel free to use the structure or components to forge your own digital adventure!
