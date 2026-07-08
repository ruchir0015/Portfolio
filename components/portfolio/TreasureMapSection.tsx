"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";

import { ScrollReveal } from "@/components/portfolio/ScrollReveal";
import type {
  ExperienceData,
  ExperienceStop,
} from "@/components/portfolio/portfolio-data";

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 720;

function buildPath(stops: ExperienceStop[]) {
  if (stops.length === 0) return "";
  const [first, ...rest] = stops;
  let path = `M ${(first.x / 100) * SVG_WIDTH} ${(first.y / 100) * SVG_HEIGHT}`;
  for (let i = 0; i < rest.length; i++) {
    const prev = stops[i];
    const curr = rest[i];
    const px = (prev.x / 100) * SVG_WIDTH;
    const py = (prev.y / 100) * SVG_HEIGHT;
    const cx2 = (curr.x / 100) * SVG_WIDTH;
    const cy2 = (curr.y / 100) * SVG_HEIGHT;
    const cpx = (px + cx2) / 2;
    path += ` C ${cpx} ${py}, ${cpx} ${cy2}, ${cx2} ${cy2}`;
  }
  return path;
}

function ShipIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="h-12 w-12 drop-shadow-[0_0_14px_rgba(255,184,150,0.55)]"
      aria-hidden="true"
    >
      <ellipse cx="20" cy="27" rx="9" ry="3.2" fill="#0F2A3A" opacity="0.7" />
      <path d="M10 23 C12 27 15 30 20 30 C25 30 28 27 30 23 Z" fill="#5C4A3A" />
      <path
        d="M11 23.5 C13 26 16 27.5 20 27.5 C24 27.5 27 26 29 23.5"
        stroke="#D4B896"
        strokeWidth="0.7"
        fill="none"
        opacity="0.7"
      />
      <rect x="19" y="11.5" width="2" height="11.5" rx="0.7" fill="#3A2A1A" />
      <path d="M21 13 L28 17 L21 19 Z" fill="#F5E6D0" />
      <path d="M19 11.5 L15 11 L19 9.3 Z" fill="#C0392B" />
    </svg>
  );
}

interface TreasureMapSectionProps {
  experience: ExperienceData;
}

export function TreasureMapSection({ experience }: TreasureMapSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 35%"],
  });
  const pathId = "journey-path";

  const [shipPos, setShipPos] = useState(() => {
    const first = experience.stops[0];
    return {
      x: (first.x / 100) * SVG_WIDTH,
      y: (first.y / 100) * SVG_HEIGHT,
      angle: -28,
    };
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const path = document.getElementById(pathId) as SVGPathElement | null;
    if (!path) return;
    const total = path.getTotalLength();
    const progress = Math.min(Math.max(latest, 0), 1);
    const pt = path.getPointAtLength(progress * total);
    const ahead = path.getPointAtLength(Math.min(progress + 0.01, 1) * total);
    setShipPos({
      x: pt.x,
      y: pt.y,
      angle: Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * (180 / Math.PI),
    });
  });

  const svgPath = buildPath(experience.stops);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="paper-texture relative isolate overflow-hidden px-6 py-24 text-slate-900 sm:px-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.26),transparent_24%)]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.32em] text-amber-950/60 uppercase">
            {experience.eyebrow}
          </p>
          <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
            {experience.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-800/78 sm:text-lg">
            {experience.description}
          </p>
        </ScrollReveal>

        {/* Parchment map */}
        <div className="relative mt-14 overflow-hidden rounded-[38px] border border-black/10 bg-[linear-gradient(180deg,rgba(247,236,213,0.92),rgba(212,184,150,0.96))] p-5 shadow-[0_30px_70px_rgba(76,52,24,0.14)] sm:p-8">

          {/* Compass rose */}
          <div className="absolute right-8 top-8 h-24 w-24 rounded-full border border-black/10 bg-[radial-gradient(circle,rgba(255,255,255,0.34),transparent_66%)]" />
          <svg className="absolute right-8 top-8 h-24 w-24 opacity-40" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#8D6E42" strokeWidth="2.5" />
            <path d="M50 6v88M6 50h88M18 18l64 64M82 18L18 82" stroke="#8D6E42" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="6" fill="#8D6E42" />
            <path d="M50 10 L54 50 L50 47 L46 50Z" fill="#8D6E42" />
            <path d="M50 90 L54 50 L50 53 L46 50Z" fill="#C4A882" />
            <text x="50" y="4" textAnchor="middle" fontSize="7" fill="#8D6E42" fontWeight="bold">N</text>
            <text x="50" y="99" textAnchor="middle" fontSize="7" fill="#8D6E42">S</text>
            <text x="2" y="53" textAnchor="middle" fontSize="7" fill="#8D6E42">W</text>
            <text x="98" y="53" textAnchor="middle" fontSize="7" fill="#8D6E42">E</text>
          </svg>

          {/* SVG path + boat */}
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {/* Dashed route */}
            <path
              id={pathId}
              d={svgPath}
              fill="none"
              stroke="#C4A882"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="10 18"
              opacity="0.85"
            />
            {/* Compass ring decoration */}
            <g opacity="0.45">
              <circle cx="885" cy="150" r="58" fill="none" stroke="#8D6E42" strokeWidth="4" />
              <path d="M885 94v112M829 150h112M847 112l76 76M923 112l-76 76" stroke="#8D6E42" strokeWidth="2.5" />
            </g>
            {/* Wave decorations */}
            <path d="M120 132c18-18 44-18 62 0M744 598c18-18 44-18 62 0M780 618c18-18 44-18 62 0" fill="none" stroke="#8D6E42" strokeWidth="3" opacity="0.5" />
            <path d="M182 578c10-20 24-34 42-42M186 596c8-12 22-24 40-32" fill="none" stroke="#497A62" strokeWidth="5" strokeLinecap="round" opacity="0.45" />
          </svg>

          {/* Boat icon following path */}
          <div
            className="absolute z-20 pointer-events-none"
            style={{
              left: `${(shipPos.x / SVG_WIDTH) * 100}%`,
              top: `${(shipPos.y / SVG_HEIGHT) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${shipPos.angle}deg)`,
            }}
          >
            <ShipIcon />
          </div>

          {/* Stop cards – absolutely positioned on the map */}
          <div className="relative min-h-[720px]">
            {experience.stops.map((stop, index) => (
              <motion.article
                key={stop.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true, margin: "-100px" }}
                className="absolute w-[240px] max-w-[68vw] rounded-[26px] border border-black/10 bg-[rgba(255,248,236,0.84)] p-4 shadow-[0_18px_40px_rgba(76,52,24,0.12)] backdrop-blur"
                style={{
                  left: `${stop.x}%`,
                  top: `${stop.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-[rgba(132,96,58,0.1)] font-display text-lg font-semibold">
                    {stop.badge}
                  </div>
                  <div className="space-y-1">
                    <p className="font-display text-2xl font-semibold leading-none">
                      {stop.company}
                    </p>
                    <p className="text-sm font-medium text-slate-900/80">
                      {stop.role}
                    </p>
                    <p className="text-xs tracking-[0.22em] text-slate-700/55 uppercase">
                      {stop.years}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-800/78">
                  {stop.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stop.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-black/10 bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-slate-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
