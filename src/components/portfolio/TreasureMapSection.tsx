import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useRef } from "react";
import { ScrollReveal } from "@/components/portfolio/ScrollReveal";
import type { ExperienceData } from "@/components/portfolio/portfolio-data";

/* ─── Lightweight ship icon ─────────────────────────────────── */
function ShipIcon() {
  return (
    <svg viewBox="0 0 36 36" className="h-9 w-9" aria-hidden="true">
      <ellipse cx="18" cy="25" rx="9" ry="3" fill="#3A2A1A" opacity="0.35" />
      <path d="M9 21 C11 25 14.5 27.5 18 27.5 C21.5 27.5 25 25 27 21 Z" fill="#5C4A3A" />
      <path d="M10 22 C12.5 24.5 15 26 18 26 C21 26 23.5 24.5 26 22" stroke="#C4A882" strokeWidth="0.7" fill="none" />
      <rect x="17.2" y="10" width="1.8" height="11" rx="0.6" fill="#3A2A1A" />
      <path d="M19 11 L26 15.5 L19 18 Z" fill="#F5E6D0" />
      <path d="M17.2 10 L13.5 9.5 L17.2 8 Z" fill="#C0392B" />
    </svg>
  );
}

interface TreasureMapSectionProps {
  experience: ExperienceData;
}

export function TreasureMapSection({ experience }: TreasureMapSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  // Sorted: highest badge (most recent) first
  const sortedStops = [...experience.stops].sort(
    (a, b) => Number(b.badge) - Number(a.badge)
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 30%"],
  });

  /* ── KEY FIX: direct DOM mutation — zero React re-renders ── */
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const line = lineRef.current;
    const ship = shipRef.current;
    const trail = trailRef.current;
    if (!line || !ship || !trail) return;

    const p = Math.min(Math.max(latest, 0), 1);
    const lineH = line.offsetHeight;
    const shipY = p * lineH;

    // Move ship (translateX centers the absolutely-positioned element)
    ship.style.transform = `translateX(-50%) translateY(${shipY}px)`;

    // Grow the "ink trail" behind the ship
    trail.style.height = `${p * 100}%`;
  });

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="paper-texture relative isolate overflow-hidden px-6 py-24 sm:px-10"
    >
      {/* Subtle radial highlight */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(255,255,255,0.28),transparent)]" />

      <div className="relative mx-auto max-w-5xl">

        {/* ── Header ── */}
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs tracking-[0.3em] text-amber-950/55 uppercase font-mono">
            {experience.eyebrow}
          </p>
          <h2 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl text-[#3A2A1A]">
            {experience.title}
          </h2>
          <p className="mt-4 text-base leading-8 text-[#5C4A3A]/70">
            {experience.description}
          </p>
        </ScrollReveal>

        {/* ── Timeline container ── */}
        <div className="relative mt-16">

          {/* Vertical line: left-edge on mobile, centered on sm+ */}
          <div
            ref={lineRef}
            className="absolute top-0 bottom-0 w-px left-5 sm:left-1/2 sm:-translate-x-1/2"
            style={{ background: "rgba(139,110,71,0.18)" }}
          >
            {/* Ink trail that grows with scroll */}
            <div
              ref={trailRef}
              className="absolute top-0 left-0 w-full"
              style={{
                height: "0%",
                background: "linear-gradient(to bottom, #8D6E42, #C4A07A)",
                transition: "height 60ms linear",
              }}
            />
          </div>

          {/* Ship: follows left line on mobile, center on sm+ */}
          <div
            ref={shipRef}
            className="pointer-events-none absolute z-20 top-0 left-5 sm:left-1/2"
            style={{ transform: "translateX(-50%) translateY(0px)" }}
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-[#8D6E42]/60 bg-[#FDF9ED] shadow-lg">
              <ShipIcon />
            </div>
          </div>

          {/* ── Cards ── */}
          <div className="flex flex-col gap-8 sm:gap-16 pb-8 pt-4">
            {sortedStops.map((stop, index) => {
              const isCurrent = stop.years.toLowerCase().includes("present");
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={stop.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-60px" }}
                  className={`relative flex items-start
                    pl-14 sm:pl-0
                    ${isLeft ? "sm:flex-row" : "sm:flex-row-reverse"}
                  `}
                >
                  {/* Card: full-width on mobile, 44% on sm+ */}
                  <div className="w-full sm:w-[44%]">
                    <article
                      className={`rounded-3xl border bg-[#FDF9ED]/95 p-5 sm:p-6
                        shadow-[0_8px_32px_rgba(76,52,24,0.08)]
                        hover:shadow-[0_16px_48px_rgba(76,52,24,0.14)]
                        transition-shadow duration-300
                        ${isCurrent ? "border-[#1A7A6D]/40" : "border-black/10"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-base font-bold font-display ${isCurrent ? "bg-[#1A7A6D] text-white" : "bg-[#5C4A3A] text-[#FFF8F0]"}`}>
                            {stop.company.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-display font-bold text-[#3A2A1A] leading-tight text-sm sm:text-base">
                              {stop.company}
                            </h3>
                            <p className="text-xs text-[#5C4A3A]/70 font-semibold mt-0.5">
                              {stop.role}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-lg border border-amber-500/25 bg-amber-400/10 px-2 py-1 text-xs font-bold font-mono text-amber-950">
                          Lv.{stop.badge}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest font-mono uppercase ${isCurrent ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-amber-100 text-amber-800 border border-amber-200"}`}>
                          {isCurrent ? "⚔ Active" : "✓ Done"}
                        </span>
                        <span className="text-[11px] text-[#5C4A3A]/50 font-mono">
                          {stop.years}
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-[#3A2A1A]/65 border-t border-black/5 pt-4">
                        {stop.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {stop.stack.map((item) => (
                          <span key={item} className="rounded-full border border-amber-900/10 bg-amber-950/[0.04] px-3 py-1 text-xs font-mono text-[#5C4A3A]">
                            {item}
                          </span>
                        ))}
                      </div>
                    </article>
                  </div>

                  {/* Connector dot */}
                  {/* Mobile: absolute over left line. sm+: in 12% center gap */}
                  <div className="absolute left-5 top-5 z-10 -translate-x-1/2
                    sm:relative sm:left-auto sm:top-auto sm:translate-x-0
                    sm:flex sm:w-[12%] sm:shrink-0 sm:justify-center sm:items-center sm:self-center">
                    <div className={`h-3.5 w-3.5 rounded-full border-2 shadow-md ${isCurrent ? "border-[#1A7A6D] bg-[#1A7A6D]" : "border-[#8D6E42] bg-[#FDF9ED]"}`}>
                      {isCurrent && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-40" />}
                    </div>
                  </div>

                  {/* Empty opposite side — desktop only */}
                  <div className="hidden sm:block sm:w-[44%]" />
                </motion.div>
              );
            })}

            {/* What's next */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              viewport={{ once: true, margin: "-60px" }}
              className="relative flex pl-14 sm:pl-0 sm:justify-center"
            >
              <div className="absolute left-5 top-1/2 -translate-x-1/2 -translate-y-1/2
                sm:left-1/2
                z-10 flex h-5 w-5 items-center justify-center rounded-full
                border-2 border-dashed border-[#8D6E42]/50 bg-[#FDF9ED]">
                <span className="text-[10px] font-bold text-[#5C4A3A]">?</span>
              </div>
              <div className="w-full sm:w-auto rounded-2xl border border-dashed border-[#8D6E42]/30 bg-[#FDF9ED]/60 px-6 sm:px-8 py-4 text-center">
                <p className="font-display font-bold text-[#5C4A3A]/60 text-sm">What's next?</p>
                <p className="mt-1 text-xs text-[#5C4A3A]/40 font-mono">The map has not been drawn yet — this story continues…</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
