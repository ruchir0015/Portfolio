"use client";

import { ScrollReveal } from "@/components/portfolio/ScrollReveal";
import type { AboutData } from "@/components/portfolio/portfolio-data";
import Lanyard from "./Lanyard";
import { TechLoop } from "./TechLoop";

/* ─── palette ─────────────────────────────────────────────────────────── */
const C = {
  ink:        "#2C1A0E",   // dark warm brown — main text
  inkLight:   "#4A3728",   // medium brown
  inkFaint:   "#7A6555",   // muted brown
  parchment:  "#F5E6C8",   // lightest parchment
  sand:       "#E8D5A8",   // mid parchment
  gold:       "#B8860B",   // muted antique gold
  goldLight:  "#D4A843",   // lighter gold for accents
  copper:     "#8B5E3C",   // warm copper
  cream:      "#FBF3E2",   // near-white warm
  border:     "rgba(139,94,60,0.25)",  // subtle warm border
  borderGold: "rgba(184,134,11,0.35)", // gold tint border
  shadow:     "rgba(44,26,14,0.18)",   // warm shadow
  shadowDeep: "rgba(44,26,14,0.38)",
};

/* ─── small connect icon button ──────────────────────────────────────── */
function ConnectButton({
  href,
  label,
  icon,
  iconColor,
  download,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  iconColor: string;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      download={download}
      title={label}
      className="group flex flex-col items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5"
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200"
        style={{
          background: C.parchment,
          border: `1px solid ${C.border}`,
          color: iconColor,
          boxShadow: `0 2px 8px ${C.shadow}`,
        }}
      >
        {icon}
      </div>
      <span
        className="text-[9px] tracking-[0.22em] uppercase"
        style={{ color: C.inkFaint }}
      >
        {label}
      </span>
    </a>
  );
}

/* ─── main section ───────────────────────────────────────────────────── */
interface CharacterSheetSectionProps {
  about: AboutData;
}

export function CharacterSheetSection({ about }: CharacterSheetSectionProps) {
  return (
    <section
      id="about"
      className="paper-texture relative isolate overflow-hidden px-6 py-24 sm:px-10"
    >
      {/* very subtle top highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.22),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl">

        {/* section eyebrow */}
        <ScrollReveal>
          <p
            className="mb-16 text-center text-[0.6rem] tracking-[0.44em] uppercase"
            style={{ color: C.inkFaint }}
          >
            {about.eyebrow} · field dossier
          </p>
        </ScrollReveal>

        {/* two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 lg:items-start">

          {/* ── LEFT: 3D Lanyard ── */}
          <ScrollReveal
            direction="right"
            className="lg:col-span-4 xl:col-span-5 w-full max-w-[420px] xl:max-w-[480px] mx-auto flex flex-col items-center"
          >
            <div className="h-[600px] md:h-[700px] xl:h-[750px] w-full flex items-center justify-center">
              <Lanyard
                position={[0, 0, 12]} /* Even closer camera (12 instead of 14) makes it very large and prominent */
                gravity={[0, -40, 0]}
                frontImage="/second.jpeg"
                backImage="/first.png"
                imageFit="cover"
              />
            </div>
          </ScrollReveal>

          {/* ── RIGHT: single profile card ── */}
          <ScrollReveal direction="left" delay={0.1} className="lg:col-span-8 xl:col-span-7 w-full">
            <div
              className="rounded-[28px] p-7 sm:p-9"
              style={{
                background: "rgba(251,243,226,0.82)",
                border: `1px solid ${C.borderGold}`,
                boxShadow: `0 2px 0 rgba(255,255,255,0.7) inset, 0 24px 60px ${C.shadow}`,
              }}
            >

              {/* ── Header ── */}
              <div className="mb-7 pb-6" style={{ borderBottom: `1px solid ${C.border}` }}>
                <p
                  className="mb-2 text-[0.6rem] tracking-[0.4em] uppercase"
                  style={{ color: C.gold }}
                >
                  About Me
                </p>
                <h2
                  className="font-display text-3xl leading-tight sm:text-4xl"
                  style={{ color: C.ink }}
                >
                  {about.title}
                </h2>
              </div>

              {/* ── Intro paragraph ── */}
              <p
                className="mb-7 text-[15px] leading-8"
                style={{ color: C.inkLight }}
              >
                {about.summary}
              </p>

              {/* ── Field notes grid ── */}
              <div
                className="mb-7 grid gap-3 sm:grid-cols-2"
              >
                {about.stats.map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl px-4 py-3"
                    style={{
                      background: "rgba(184,134,11,0.06)",
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <p
                      className="mb-1 text-[9px] tracking-[0.3em] uppercase"
                      style={{ color: C.gold }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-sm font-semibold leading-snug"
                      style={{ color: C.ink }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── Connect ── */}
              <div>
                <p
                  className="mb-4 text-[0.6rem] tracking-[0.38em] uppercase"
                  style={{ color: C.gold }}
                >
                  Connect
                </p>
                <div className="flex flex-wrap items-end gap-4">
                  {/* GitHub — #24292e black */}
                  <ConnectButton
                    href="https://github.com/ruchir0015"
                    label="GitHub"
                    iconColor="#24292e"
                    icon={
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.547-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    }
                  />

                  {/* LinkedIn — #0A66C2 blue */}
                  <ConnectButton
                    href="https://www.linkedin.com/in/ruchir-jain-75419b311?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                    label="LinkedIn"
                    iconColor="#0A66C2"
                    icon={
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    }
                  />

                  {/* Email — #EA4335 Gmail red */}
                  <ConnectButton
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=rj863093701@gmail.com&su=Portfolio%20Inquiry"
                    label="Email"
                    iconColor="#EA4335"
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    }
                  />

                  {/* Resume */}
                  <a
                    href="/final_Ruchir_resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105"
                    style={{
                      background: `linear-gradient(135deg, ${C.gold} 0%, ${C.copper} 100%)`,
                      color: C.cream,
                      boxShadow: `0 4px 14px rgba(184,134,11,0.32)`,
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Resume
                  </a>
                </div>
              </div>

              {/* ── Signature accent ── */}
              <div className="mt-8 flex justify-end">
                <span className="borel-regular text-2xl text-copper/85 select-none rotate-[-2deg]">
                  ~ Ruchir Jain
                </span>
              </div>

            </div>
          </ScrollReveal>
        </div>

        {/* Tech stack loop — positioned prominently below the lanyard and charactersheet card */}
        <ScrollReveal
          direction="up"
          delay={0.2}
          className="mt-16 w-full"
        >
          <div className="w-full flex flex-col items-center">
            <p
              className="mb-4 text-center text-[0.7rem] tracking-[0.44em] uppercase font-bold"
              style={{ color: C.gold }}
            >
              Tech Stack
            </p>
            <TechLoop skills={about.skills} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}