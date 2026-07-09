"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";

import { ScrollReveal } from "@/components/portfolio/ScrollReveal";
import type {
  ExperienceData,
  ExperienceStop,
} from "@/components/portfolio/portfolio-data";

const SVG_WIDTH = 100;
const SVG_HEIGHT = 100;
const START_Y = 10;
const END_Y = 90;

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

  // Sort stops by badge value (descending level: e.g. Lv. 26 then Lv. 24)
  const sortedStops = [...experience.stops].sort(
    (a, b) => Number(b.badge) - Number(a.badge)
  );

  const totalStops = sortedStops.length;
  const stepY = totalStops > 0 ? (END_Y - START_Y) / (totalStops + 1) : 0;

  // Construct dynamic timeline coordinates
  const dynamicNodes = sortedStops.map((stop, idx) => {
    const x = idx % 2 === 0 ? 70 : 30;
    const y = START_Y + (idx + 1) * stepY;
    const isCurrent = stop.years.toLowerCase().includes("present") && idx === 0;
    return {
      id: stop.id,
      x,
      y,
      label: stop.company,
      role: stop.role,
      years: stop.years,
      badge: stop.badge,
      letter: stop.company.charAt(0),
      isCurrent,
      stopData: stop,
    };
  });

  const [shipPos, setShipPos] = useState({
    x: 50,
    y: 0,
    angle: 90,
  });

  const [hoveredStopId, setHoveredStopId] = useState<string | null>(null);

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

  // Calculate dynamic cubic bezier curves linking timeline nodes
  const buildTimelinePath = () => {
    let path = `M 50 0 L 50 ${START_Y}`;
    let prevX = 50;
    let prevY = START_Y;

    dynamicNodes.forEach((node) => {
      const cpY1 = prevY + (node.y - prevY) / 3;
      const cpY2 = prevY + 2 * (node.y - prevY) / 3;
      path += ` C ${prevX} ${cpY1}, ${node.x} ${cpY2}, ${node.x} ${node.y}`;
      prevX = node.x;
      prevY = node.y;
    });

    const cpY1 = prevY + (END_Y - prevY) / 3;
    const cpY2 = prevY + 2 * (END_Y - prevY) / 3;
    path += ` C ${prevX} ${cpY1}, 50 ${cpY2}, 50 ${END_Y}`;
    return path;
  };

  const handleNodeClick = (id: string) => {
    setHoveredStopId(id);
    const element = document.getElementById(`card-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const svgPath = buildTimelinePath();

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
          <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-6xl text-[#3A2A1A]">
            {experience.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-800/78 sm:text-lg">
            {experience.description}
          </p>
        </ScrollReveal>

        {/* Outer Parchment Container */}
        <div className="relative mt-14 overflow-hidden rounded-[38px] border border-black/10 bg-[linear-gradient(180deg,rgba(247,236,213,0.92),rgba(212,184,150,0.96))] p-6 shadow-[0_30px_70px_rgba(76,52,24,0.14)] sm:p-10">
          
          {/* Compass rose decoration */}
          <div className="absolute right-8 top-8 h-24 w-24 rounded-full border border-black/10 bg-[radial-gradient(circle,rgba(255,255,255,0.34),transparent_66%)] pointer-events-none" />
          <svg className="absolute right-8 top-8 h-24 w-24 opacity-40 pointer-events-none" viewBox="0 0 100 100" aria-hidden="true">
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

          {/* 2-Column Responsive Layout */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Timeline Column (Hidden on mobile for visual cleanliness) */}
            <div className="hidden lg:block lg:col-span-5 relative min-h-[600px] border-r border-black/5 pr-4">
              <h3 className="font-display text-lg font-bold text-[#5C4A3A] tracking-wider mb-6 text-center border-b border-black/5 pb-2">
                CAMPSITES ALONG THE TRAIL
              </h3>

              <div className="relative h-[560px] w-full">
                {/* SVG path mapping */}
                <svg
                  viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full pointer-events-none"
                  aria-hidden="true"
                >
                  <path
                    id={pathId}
                    d={svgPath}
                    fill="none"
                    stroke="#8D6E42"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="8 8"
                    opacity="0.55"
                  />
                  {/* Compass ring decoration */}
                  <g opacity="0.3">
                    <ellipse cx="15" cy="83.3" rx="30" ry="5" fill="none" stroke="#8D6E42" strokeWidth="2" />
                    <path d="M15 78.3v10M0 83.3h30" stroke="#8D6E42" strokeWidth="1" />
                  </g>
                </svg>

                {/* Animated Boat following scroll progress */}
                <div
                  className="absolute z-20 pointer-events-none transition-all duration-75"
                  style={{
                    left: `${shipPos.x}%`,
                    top: `${shipPos.y}%`,
                    transform: `translate(-50%, -50%) rotate(${shipPos.angle}deg)`,
                  }}
                >
                  <ShipIcon />
                </div>

                {/* Interactive Node Markers */}
                {/* What's next? Node */}
                <div
                  className="absolute"
                  style={{
                    left: "50%",
                    top: `${START_Y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-slate-600 bg-slate-800 text-slate-300 font-bold text-lg shadow-md cursor-help relative group"
                    title="What's next?"
                  >
                    ?
                    <span className="absolute bottom-12 left-1/2 -translate-x-1/2 scale-0 rounded bg-slate-900 px-3 py-1.5 text-xs text-white group-hover:scale-100 transition-all duration-150 whitespace-nowrap z-30 font-mono">
                      What's next? (Future)
                    </span>
                  </motion.button>
                </div>

                {/* Dynamic Stop Nodes */}
                {dynamicNodes.map((node) => (
                  <div
                    key={node.id}
                    className="absolute"
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <motion.button
                      onClick={() => handleNodeClick(node.id)}
                      onMouseEnter={() => setHoveredStopId(node.id)}
                      onMouseLeave={() => setHoveredStopId(null)}
                      whileHover={{ scale: 1.15 }}
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300 relative group font-display text-lg font-bold ${
                        node.isCurrent
                          ? "bg-[#1A7A6D] text-white border-[#2ec4b6]"
                          : "bg-[#5C4A3A] text-[#FFF8F0] border-[#8B6F47]"
                      } ${hoveredStopId === node.id ? "ring-4 ring-amber-500/30 scale-110" : ""}`}
                    >
                      {node.letter}

                      {/* Pulse green highlight for current node */}
                      {node.isCurrent && (
                        <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-emerald-500 border border-white"></span>
                        </span>
                      )}

                      {/* Tooltip Overlay */}
                      <span className="absolute bottom-14 left-1/2 -translate-x-1/2 scale-0 rounded-2xl bg-amber-950 px-4 py-2.5 text-xs text-slate-100 group-hover:scale-100 transition-all duration-200 shadow-xl whitespace-nowrap z-30 border border-amber-500/25">
                        <div className="font-bold text-amber-300 font-display text-sm">{node.label}</div>
                        <div className="text-slate-300 text-xs mt-0.5">{node.role}</div>
                        <div className="text-slate-400 font-mono text-[10px] tracking-wider mt-1">{node.years} ({node.badge})</div>
                      </span>
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Detailed Cards Column */}
            <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
              {sortedStops.map((stop, index) => {
                const isCurrent = stop.years.toLowerCase().includes("present") && index === 0;
                const isHovered = hoveredStopId === stop.id;

                return (
                  <motion.article
                    key={stop.id}
                    id={`card-${stop.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    onMouseEnter={() => setHoveredStopId(stop.id)}
                    onMouseLeave={() => setHoveredStopId(null)}
                    className={`rounded-[32px] border bg-[#FDF9ED]/90 p-6 md:p-8 backdrop-blur transition-all duration-300 shadow-[0_12px_40px_rgba(76,52,24,0.06)] ${
                      isHovered
                        ? isCurrent
                          ? "border-[#1A7A6D] scale-[1.015] ring-2 ring-[#1A7A6D]/20 shadow-[0_20px_50px_rgba(26,122,109,0.14)]"
                          : "border-[#8B6F47] scale-[1.015] ring-2 ring-[#8B6F47]/20 shadow-[0_20px_50px_rgba(139,111,71,0.14)]"
                        : "border-black/10"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Alphabet Badge Icon */}
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-xl font-bold font-display shadow-md transition-transform duration-300 ${
                            isHovered ? "scale-110" : ""
                          } ${
                            isCurrent
                              ? "bg-[#1A7A6D] text-white border-[#2ec4b6]/30"
                              : "bg-[#5C4A3A] text-[#FFF8F0] border-[#8B6F47]/30"
                          }`}
                        >
                          {stop.company.charAt(0)}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-2xl font-bold text-[#3A2A1A] leading-tight">
                              {stop.company}
                            </h3>
                            {isCurrent ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200 uppercase tracking-wider font-mono">
                                Active Quest
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-amber-100/80 px-2.5 py-0.5 text-xs font-semibold text-amber-900 border border-amber-200 uppercase tracking-wider font-mono">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-slate-800 mt-1">
                            {stop.role}
                          </p>
                          <p className="text-xs text-slate-500 font-mono tracking-wider mt-0.5">
                            {stop.years}
                          </p>
                        </div>
                      </div>

                      {/* Level Badge */}
                      <div className="self-start font-mono text-sm font-bold text-amber-950 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 whitespace-nowrap">
                        Lv. {stop.badge}
                      </div>
                    </div>

                    {/* Paragraph description */}
                    <p className="mt-5 text-sm leading-8 text-slate-700/90 border-t border-black/5 pt-4">
                      {stop.description}
                    </p>

                    {/* Tech stack tags */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {stop.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-amber-900/10 bg-amber-950/[0.03] px-3.5 py-1.5 text-xs font-medium text-slate-800 font-mono shadow-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.article>
                );
              })}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
