"use client";

import { useEffect, useRef } from "react";
import { StarField } from "@/components/portfolio/StarField";
import type { HeroData } from "@/components/portfolio/portfolio-data";

interface HeroSectionProps {
  hero: HeroData;
}

/* Animated floating firefly / particle layer */
function ParticleLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, raf = 0;

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      alpha: number;
      phase: number;
      speed: number;
      color: string;
    };

    const COLORS = [
      "rgba(251,191,36,",   // amber
      "rgba(167,139,250,",  // violet
      "rgba(94,234,212,",   // teal
      "rgba(255,255,255,",  // white
    ];

    let particles: Particle[] = [];

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    };

    const buildParticles = () => {
      particles = Array.from({ length: 55 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1.2 + Math.random() * 2.8,
        alpha: 0.15 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        const pulse = 0.5 + 0.5 * Math.sin(t * 0.001 * p.speed + p.phase);
        const a = p.alpha * pulse;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${a.toFixed(3)})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `${p.color}0.6)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}

export function HeroSection({ hero }: HeroSectionProps) {
  const [firstName, ...rest] = hero.name.split(" ");
  const lastName = rest.join(" ");

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >

      {/* ── Deep aurora / nebula base gradient ── */}
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#050d1a_0%,#060e1e_30%,#091426_55%,#060c1a_100%)]" />

      {/* ── Animated aurora blobs (CSS keyframes) ── */}
      <div className="aurora-blob aurora-blob-1 absolute" aria-hidden="true" />
      <div className="aurora-blob aurora-blob-2 absolute" aria-hidden="true" />
      <div className="aurora-blob aurora-blob-3 absolute" aria-hidden="true" />

      {/* ── Star canvas ── */}
      <StarField className="absolute inset-0 h-full w-full" />

      {/* ── Floating firefly particles ── */}
      <ParticleLayer />



      {/* ── Warm glow beneath name ── */}
      <div
        className="absolute bottom-[-8%] left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at 50% 68%, rgba(255,130,54,0.18) 0%, rgba(139,92,246,0.06) 48%, transparent 72%)" }}
        aria-hidden="true"
      />

      {/* ── Bottom fade to next section ── */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent,rgba(4,9,20,0.92)_45%,rgba(4,9,20,1))]" />

      {/* ── Name ── */}
      <div className="relative z-10 flex flex-col items-center select-none">
        <h1
          className="text-center font-display font-black leading-[1.0] tracking-tight"
          style={{ filter: "drop-shadow(0 0 52px rgba(255,130,54,0.35))" }}
        >
          <span
            className="block text-[clamp(4rem,15vw,12rem)]"
            style={{ color: '#ff8236' }}
          >
            {firstName}
          </span>
          <span className="block text-[clamp(4rem,15vw,12rem)] text-white">
            {lastName}
          </span>
        </h1>

        <p className="mt-7 text-center text-[0.65rem] font-medium tracking-[0.4em] text-white/30 uppercase">
          {hero.eyebrow}
        </p>
      </div>

      {/* ── Scroll cue ── */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] tracking-[0.28em] text-white/28 uppercase transition-opacity hover:text-white/60"
      >
        <span>scroll</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-bounce">
          <path d="M8 2v10M3 8l5 5 5-5" stroke="rgba(255,130,54,0.65)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
