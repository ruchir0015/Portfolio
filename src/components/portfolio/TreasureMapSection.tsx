import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

import { ScrollReveal } from "@/components/portfolio/ScrollReveal";
import type {
  ExperienceData,
  ExperienceStop,
} from "@/components/portfolio/portfolio-data";

// SVG canvas dimensions (unitless, treated as viewBox units)
const SVG_W = 100;
const SVG_H = 100;
const START_Y = 8;
const END_Y = 92;

/* ─── Ship SVG ─────────────────────────────────────────────── */
function ShipIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="h-12 w-12 drop-shadow-[0_0_18px_rgba(255,184,100,0.65)]"
      aria-hidden="true"
    >
      {/* Shadow under hull */}
      <ellipse cx="20" cy="27.5" rx="10" ry="3.5" fill="#0F2A3A" opacity="0.55" />
      {/* Hull */}
      <path d="M9 22 C11 27 15 30.5 20 30.5 C25 30.5 29 27 31 22 Z" fill="#5C4A3A" />
      {/* Hull plank line */}
      <path
        d="M10.5 23.5 C13 26.5 16.5 28 20 28 C23.5 28 27 26.5 29.5 23.5"
        stroke="#D4B896"
        strokeWidth="0.8"
        fill="none"
        opacity="0.8"
      />
      {/* Second plank */}
      <path
        d="M12 21.5 C14.5 24 17 25.5 20 25.5 C23 25.5 25.5 24 28 21.5"
        stroke="#C4A882"
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />
      {/* Mast */}
      <rect x="19.2" y="10" width="2" height="12.5" rx="0.8" fill="#3A2A1A" />
      {/* Main sail */}
      <path d="M21 11.5 L29.5 16.5 L21 20 Z" fill="#F5E6D0" opacity="0.95" />
      {/* Sail shading */}
      <path d="M21 11.5 L29.5 16.5 L25 18.5 Z" fill="#E8D5B0" opacity="0.5" />
      {/* Flag */}
      <path d="M19.2 10 L14.5 9.5 L19.2 7.5 Z" fill="#C0392B" />
      {/* Crow's nest */}
      <rect x="17.5" y="12.5" width="3.5" height="2" rx="0.5" fill="#4A3525" />
    </svg>
  );
}

/* ─── Compass Rose ──────────────────────────────────────────── */
function CompassRose({ x, y, size = 14 }: { x: number; y: number; size?: number }) {
  const s = size;
  return (
    <g transform={`translate(${x},${y})`} opacity="0.55">
      <circle cx="0" cy="0" r={s * 0.95} fill="none" stroke="#8D6E42" strokeWidth="0.8" />
      <circle cx="0" cy="0" r={s * 0.65} fill="none" stroke="#8D6E42" strokeWidth="0.4" />
      <circle cx="0" cy="0" r={1.2} fill="#8D6E42" />
      {/* Cardinal lines */}
      <line x1="0" y1={-s * 0.95} x2="0" y2={s * 0.95} stroke="#8D6E42" strokeWidth="0.5" />
      <line x1={-s * 0.95} y1="0" x2={s * 0.95} y2="0" stroke="#8D6E42" strokeWidth="0.5" />
      {/* Diagonal lines */}
      <line x1={-s * 0.67} y1={-s * 0.67} x2={s * 0.67} y2={s * 0.67} stroke="#8D6E42" strokeWidth="0.3" />
      <line x1={s * 0.67} y1={-s * 0.67} x2={-s * 0.67} y2={s * 0.67} stroke="#8D6E42" strokeWidth="0.3" />
      {/* N arrow (dark) */}
      <polygon points={`0,${-s * 0.9} ${s * 0.25},0 0,${-s * 0.3}`} fill="#8D6E42" />
      {/* S arrow (light) */}
      <polygon points={`0,${s * 0.9} ${s * 0.25},0 0,${s * 0.3}`} fill="#C4A882" />
      {/* Labels */}
      <text x="0" y={-s - 1.5} textAnchor="middle" fontSize="4" fill="#8D6E42" fontWeight="bold">N</text>
      <text x="0" y={s + 4.5} textAnchor="middle" fontSize="4" fill="#8D6E42">S</text>
      <text x={-s - 2} y="1.5" textAnchor="middle" fontSize="4" fill="#8D6E42">W</text>
      <text x={s + 2} y="1.5" textAnchor="middle" fontSize="4" fill="#8D6E42">E</text>
    </g>
  );
}

/* ─── Palm Tree ─────────────────────────────────────────────── */
function PalmTree({ x, y, scale = 1, flip = false }: { x: number; y: number; scale?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale})`} opacity="0.45">
      {/* Trunk */}
      <path d="M0,0 C0.5,-1.5 0.3,-3 0,-4.5 C-0.2,-6 0.2,-7.5 0,-9" stroke="#8D6E42" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* Fronds */}
      <path d="M0,-9 C1,-11 4,-11.5 5,-10.5" stroke="#5A7A3A" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      <path d="M0,-9 C-1,-11 -4,-11.5 -5,-10.5" stroke="#5A7A3A" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      <path d="M0,-9 C2,-10 3.5,-12.5 3,-13.5" stroke="#5A7A3A" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      <path d="M0,-9 C-2,-10 -3.5,-12.5 -3,-13.5" stroke="#5A7A3A" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      <path d="M0,-9 C0.5,-12 1,-14.5 0,-15" stroke="#5A7A3A" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      {/* Coconuts */}
      <circle cx="0.5" cy="-9.5" r="0.7" fill="#8D6E42" opacity="0.8"/>
      <circle cx="-0.8" cy="-9.8" r="0.6" fill="#8D6E42" opacity="0.8"/>
    </g>
  );
}

/* ─── Wave decoration ───────────────────────────────────────── */
function WaveGroup({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx},${cy})`} opacity="0.3" stroke="#8D6E42" strokeWidth="0.6" fill="none">
      <path d="M-5,0 C-4,-1.5 -3,-1.5 -2,0 C-1,1.5 0,1.5 1,0 C2,-1.5 3,-1.5 4,0" />
      <path d="M-4,2 C-3,0.5 -2,0.5 -1,2 C0,3.5 1,3.5 2,2 C3,0.5 4,0.5 5,2" />
    </g>
  );
}

/* ─── X marker ──────────────────────────────────────────────── */
function XMarker({ x, y, active }: { x: number; y: number; active?: boolean }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="0" cy="0" r="3.5" fill={active ? "#1A7A6D" : "#5C4A3A"} stroke={active ? "#2ec4b6" : "#8B6F47"} strokeWidth="0.8" />
      <line x1="-1.8" y1="-1.8" x2="1.8" y2="1.8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="1.8" y1="-1.8" x2="-1.8" y2="1.8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

interface TreasureMapSectionProps {
  experience: ExperienceData;
}

export function TreasureMapSection({ experience }: TreasureMapSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pathId = "journey-path";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 30%"],
  });

  // Sorted stops: highest badge (most recent) first
  const sortedStops = [...experience.stops].sort(
    (a, b) => Number(b.badge) - Number(a.badge)
  );

  const totalStops = sortedStops.length;
  const stepY = totalStops > 0 ? (END_Y - START_Y) / (totalStops + 1) : 0;

  // Build node positions alternating left/right
  const dynamicNodes = sortedStops.map((stop, idx) => {
    const x = idx % 2 === 0 ? 72 : 28;
    const y = START_Y + (idx + 1) * stepY;
    const isCurrent = stop.years.toLowerCase().includes("present");
    return {
      id: stop.id,
      x, y,
      label: stop.company,
      role: stop.role,
      years: stop.years,
      badge: stop.badge,
      letter: stop.company.charAt(0),
      isCurrent,
      stopData: stop,
    };
  });

  // Build smooth bezier path through nodes
  const buildTimelinePath = () => {
    let path = `M 50 0 L 50 ${START_Y}`;
    let prevX = 50;
    let prevY = START_Y;

    dynamicNodes.forEach((node) => {
      const cpY1 = prevY + (node.y - prevY) / 2.5;
      const cpY2 = node.y - (node.y - prevY) / 2.5;
      path += ` C ${prevX} ${cpY1}, ${node.x} ${cpY2}, ${node.x} ${node.y}`;
      prevX = node.x;
      prevY = node.y;
    });

    const cpY1 = prevY + (END_Y - prevY) / 2.5;
    const cpY2 = END_Y - (END_Y - prevY) / 2.5;
    path += ` C ${prevX} ${cpY1}, 50 ${cpY2}, 50 ${END_Y}`;
    return path;
  };

  const svgPath = buildTimelinePath();

  const [shipPos, setShipPos] = useState({ x: 50, y: 0, angle: 90 });
  const [hoveredStopId, setHoveredStopId] = useState<string | null>(null);

  // Scroll-driven path follow
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const path = document.getElementById(pathId) as SVGPathElement | null;
    if (!path) return;
    const total = path.getTotalLength();
    const progress = Math.min(Math.max(latest, 0), 1);
    const pt = path.getPointAtLength(progress * total);
    const aheadPt = path.getPointAtLength(Math.min(progress + 0.008, 1) * total);
    setShipPos({
      x: pt.x,
      y: pt.y,
      angle: Math.atan2(aheadPt.y - pt.y, aheadPt.x - pt.x) * (180 / Math.PI),
    });
  });

  // Path draw progress animation
  const pathProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const handleNodeClick = (id: string) => {
    const el = document.getElementById(`card-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    setHoveredStopId(id);
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="paper-texture relative isolate overflow-hidden px-6 py-24 text-slate-900 sm:px-10"
    >
      {/* Top-left radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.3),transparent_32%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">

        {/* ── Header ── */}
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.32em] text-amber-950/60 uppercase">
            {experience.eyebrow}
          </p>
          <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-6xl text-[#3A2A1A]">
            {experience.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-800/75 sm:text-lg">
            {experience.description}
          </p>
        </ScrollReveal>

        {/* ── Main Parchment Container ── */}
        <div className="relative mt-14 overflow-hidden rounded-[42px] border border-black/10 bg-[linear-gradient(155deg,#FBF3E2_0%,#EDD9B2_35%,#D4B896_70%,#C4A07A_100%)] shadow-[0_40px_80px_rgba(76,52,24,0.18),inset_0_1px_0_rgba(255,255,255,0.5)] p-6 sm:p-10">

          {/* Aged paper texture overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Corner decorations */}
          <div className="pointer-events-none absolute inset-0">
            {/* Top-left corner ornament */}
            <svg className="absolute left-5 top-5 h-16 w-16 opacity-30" viewBox="0 0 60 60" aria-hidden="true">
              <path d="M5 5 L25 5 M5 5 L5 25" stroke="#5C4A3A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M5 5 L20 20" stroke="#5C4A3A" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="3 4"/>
              <circle cx="5" cy="5" r="3" fill="#8D6E42"/>
            </svg>
            {/* Bottom-right corner ornament */}
            <svg className="absolute right-5 bottom-5 h-16 w-16 opacity-30 rotate-180" viewBox="0 0 60 60" aria-hidden="true">
              <path d="M5 5 L25 5 M5 5 L5 25" stroke="#5C4A3A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M5 5 L20 20" stroke="#5C4A3A" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="3 4"/>
              <circle cx="5" cy="5" r="3" fill="#8D6E42"/>
            </svg>
          </div>

          {/* ── 2-Column Grid ── */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* ── LEFT: Treasure Map SVG ── */}
            <div className="hidden lg:flex lg:col-span-5 flex-col gap-2 relative min-h-[640px] border-r border-black/8 pr-4">
              <h3 className="font-display text-sm font-bold text-[#5C4A3A] tracking-[0.22em] uppercase mb-4 text-center opacity-75 border-b border-black/8 pb-2">
                ⚓ Chart of the Journey ⚓
              </h3>

              <div className="relative flex-1 w-full min-h-[560px]">
                {/* The SVG map canvas */}
                <svg
                  viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  {/* ── Background Decorations ── */}

                  {/* Ocean wave clusters */}
                  <WaveGroup cx={10} cy={20} />
                  <WaveGroup cx={85} cy={15} />
                  <WaveGroup cx={8} cy={55} />
                  <WaveGroup cx={90} cy={60} />
                  <WaveGroup cx={15} cy={78} />
                  <WaveGroup cx={82} cy={80} />
                  <WaveGroup cx={50} cy={96} />

                  {/* Palm trees */}
                  <PalmTree x={8} y={38} scale={0.6} />
                  <PalmTree x={92} y={42} scale={0.6} flip />
                  <PalmTree x={5} y={72} scale={0.55} />
                  <PalmTree x={94} y={25} scale={0.55} flip />

                  {/* Compass Rose */}
                  <CompassRose x={12} y={88} size={9} />

                  {/* Small island blobs */}
                  <ellipse cx="85" cy="88" rx="6" ry="3.5" fill="#C4A882" opacity="0.35" />
                  <ellipse cx="84" cy="86.5" rx="3" ry="1.8" fill="#8D6E42" opacity="0.2" />

                  {/* Map legend box */}
                  <rect x="72" y="84" width="24" height="12" rx="1.5" fill="none" stroke="#8D6E42" strokeWidth="0.6" opacity="0.4" />
                  <text x="84" y="88.5" textAnchor="middle" fontSize="2.8" fill="#5C4A3A" opacity="0.6" fontWeight="bold">LEGEND</text>
                  <circle cx="74.5" cy="92" r="1.2" fill="#1A7A6D" opacity="0.7" />
                  <text x="77" y="92.8" fontSize="2.2" fill="#5C4A3A" opacity="0.6">Active</text>
                  <circle cx="74.5" cy="95.5" r="1.2" fill="#5C4A3A" opacity="0.7" />
                  <text x="77" y="96.3" fontSize="2.2" fill="#5C4A3A" opacity="0.6">Past</text>

                  {/* ── The Dashed Journey Path ── */}
                  {/* Ghost path (full, dimmed) */}
                  <path
                    d={svgPath}
                    fill="none"
                    stroke="#C4A882"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeDasharray="5 7"
                    opacity="0.35"
                  />
                  {/* Animated path that draws on scroll */}
                  <motion.path
                    id={pathId}
                    d={svgPath}
                    fill="none"
                    stroke="#8D6E42"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeDasharray="5 7"
                    opacity="0.75"
                    style={{
                      pathLength: pathProgress,
                    }}
                  />

                  {/* ── Start marker ── */}
                  <g transform="translate(50,0)">
                    <circle cx="0" cy={START_Y - 1} r="2.5" fill="#8D6E42" opacity="0.6" />
                    <text x="0" y={START_Y + 4.5} textAnchor="middle" fontSize="3" fill="#5C4A3A" opacity="0.7" fontFamily="monospace">START</text>
                  </g>

                  {/* ── End marker (flag) ── */}
                  <g transform={`translate(50,${END_Y + 2})`}>
                    <line x1="0" y1="-3" x2="0" y2="3.5" stroke="#C0392B" strokeWidth="0.8" />
                    <path d="M0,-3 L4,-1.5 L0,0 Z" fill="#C0392B" />
                    <text x="0" y="6.5" textAnchor="middle" fontSize="2.8" fill="#5C4A3A" opacity="0.7" fontFamily="monospace">BEYOND</text>
                  </g>

                  {/* ── "What's next?" Node ── */}
                  <g transform={`translate(50,${START_Y})`} opacity="0.8">
                    <circle cx="0" cy="0" r="3.2" fill="none" stroke="#5C4A3A" strokeWidth="0.8" strokeDasharray="2 2" />
                    <text x="0" y="0.8" textAnchor="middle" fontSize="4.5" fill="#5C4A3A">?</text>
                  </g>

                  {/* ── Dynamic Stop X markers ── */}
                  {dynamicNodes.map((node) => (
                    <XMarker
                      key={node.id}
                      x={node.x}
                      y={node.y}
                      active={node.isCurrent}
                    />
                  ))}
                </svg>

                {/* ── Animated Ship ── */}
                <div
                  className="absolute z-20 pointer-events-none"
                  style={{
                    left: `${shipPos.x}%`,
                    top: `${shipPos.y}%`,
                    transform: `translate(-50%, -50%) rotate(${shipPos.angle}deg)`,
                    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))",
                    transition: "left 80ms linear, top 80ms linear",
                  }}
                >
                  <ShipIcon />
                </div>

                {/* ── Interactive Node Hover Markers ── */}
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
                      whileHover={{ scale: 1.22 }}
                      whileTap={{ scale: 0.94 }}
                      className={`relative group flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-lg font-display text-base font-bold transition-all duration-200 ${
                        node.isCurrent
                          ? "bg-[#1A7A6D] text-white border-[#2ec4b6]"
                          : "bg-[#5C4A3A] text-[#FFF8F0] border-[#8B6F47]"
                      } ${hoveredStopId === node.id ? "ring-4 ring-amber-500/30" : ""}`}
                    >
                      {node.letter}

                      {/* Pulsing ring for current */}
                      {node.isCurrent && (
                        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-25" />
                      )}

                      {/* Tooltip */}
                      <span className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 scale-0 rounded-2xl bg-amber-950 px-4 py-2.5 text-xs text-slate-100 group-hover:scale-100 transition-all duration-200 shadow-2xl whitespace-nowrap z-30 border border-amber-500/25 origin-bottom">
                        <span className="block font-bold text-amber-300 font-display text-sm mb-0.5">{node.label}</span>
                        <span className="block text-slate-300 text-xs">{node.role}</span>
                        <span className="block text-slate-400 font-mono text-[10px] tracking-wider mt-1">{node.years}</span>
                      </span>
                    </motion.button>
                  </div>
                ))}

                {/* "What's next?" interactive node */}
                <div
                  className="absolute"
                  style={{
                    left: "50%",
                    top: `${START_Y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className="group relative flex h-10 w-10 cursor-help items-center justify-center rounded-full border-2 border-dashed border-[#5C4A3A] bg-amber-100 text-[#5C4A3A] text-xl font-bold shadow-md"
                    title="What's next?"
                  >
                    ?
                    <span className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 scale-0 rounded-lg bg-amber-950 px-3 py-1.5 text-xs text-white group-hover:scale-100 transition-all duration-150 whitespace-nowrap z-30 font-mono">
                      What's next? (Future)
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Experience Cards ── */}
            <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
              {sortedStops.map((stop, index) => {
                const isCurrent = stop.years.toLowerCase().includes("present");
                const isHovered = hoveredStopId === stop.id;

                return (
                  <motion.article
                    key={stop.id}
                    id={`card-${stop.id}`}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-80px" }}
                    onMouseEnter={() => setHoveredStopId(stop.id)}
                    onMouseLeave={() => setHoveredStopId(null)}
                    className={`group relative rounded-[32px] border bg-[#FDF9ED]/92 p-6 md:p-8 backdrop-blur transition-all duration-300 shadow-[0_12px_40px_rgba(76,52,24,0.07)] ${
                      isHovered
                        ? isCurrent
                          ? "border-[#1A7A6D] scale-[1.015] shadow-[0_22px_55px_rgba(26,122,109,0.15)] ring-2 ring-[#1A7A6D]/18"
                          : "border-[#8B6F47] scale-[1.015] shadow-[0_22px_55px_rgba(139,111,71,0.15)] ring-2 ring-[#8B6F47]/18"
                        : "border-black/10"
                    }`}
                  >
                    {/* Parchment inner watermark */}
                    <div className="pointer-events-none absolute right-6 bottom-6 opacity-[0.04] text-[80px] leading-none font-display select-none">
                      {stop.company.charAt(0)}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Badge avatar */}
                        <div
                          className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border-2 text-xl font-bold font-display shadow-md transition-all duration-300 ${
                            isHovered ? "scale-110 shadow-lg" : ""
                          } ${
                            isCurrent
                              ? "bg-[#1A7A6D] text-white border-[#2ec4b6]/40"
                              : "bg-[#5C4A3A] text-[#FFF8F0] border-[#8B6F47]/40"
                          }`}
                          style={{ height: "3.25rem", width: "3.25rem" }}
                        >
                          {stop.company.charAt(0)}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-display text-2xl font-bold text-[#3A2A1A] leading-tight">
                              {stop.company}
                            </h3>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono border ${
                                isCurrent
                                  ? "bg-emerald-100/80 text-emerald-800 border-emerald-300"
                                  : "bg-amber-100/80 text-amber-900 border-amber-300"
                              }`}
                            >
                              {isCurrent ? "⚔ Active Quest" : "✓ Completed"}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-700">{stop.role}</p>
                          <p className="text-xs text-slate-400 font-mono tracking-wider mt-0.5">{stop.years}</p>
                        </div>
                      </div>

                      {/* Level badge */}
                      <div className="self-start shrink-0 font-mono text-sm font-bold text-amber-950 bg-amber-400/12 px-3.5 py-1.5 rounded-xl border border-amber-500/22 whitespace-nowrap shadow-sm">
                        Lv. {stop.badge}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-5 text-sm leading-8 text-slate-600/90 border-t border-black/6 pt-4">
                      {stop.description}
                    </p>

                    {/* Tech stack */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {stop.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-amber-900/12 bg-amber-950/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-700 font-mono shadow-sm hover:bg-amber-950/[0.08] transition-colors"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.article>
                );
              })}

              {/* "What's next?" card */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: sortedStops.length * 0.1, ease: "easeOut" }}
                viewport={{ once: true, margin: "-80px" }}
                className="rounded-[32px] border border-dashed border-[#8B6F47]/40 bg-amber-50/30 p-6 md:p-8 flex items-center gap-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#5C4A3A]/50 bg-amber-100 text-[#5C4A3A] text-2xl font-bold font-display">
                  ?
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-[#5C4A3A]/70">What's next?</h3>
                  <p className="mt-1 text-sm text-slate-500/80 font-mono">The map has not been drawn yet — this story continues…</p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
