"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/portfolio/ScrollReveal";
import type { ConnectData } from "@/components/portfolio/portfolio-data";
import Silk from "./Silk";

interface ConnectSectionProps {
  connect: ConnectData;
}

const getHoverGlow = (title: string) => {
  switch (title.toLowerCase()) {
    case 'github':
      return 'rgba(255, 255, 255, 0.12)';
    case 'linkedin':
      return 'rgba(14, 118, 168, 0.22)';
    case 'email':
      return 'rgba(234, 67, 53, 0.22)';
    case 'resume':
      return 'rgba(244, 15, 15, 0.22)';
    default:
      return 'rgba(255, 255, 255, 0.08)';
  }
};

const getIconStyles = (title: string) => {
  switch (title.toLowerCase()) {
    case 'github':
      return {
        bgClass: 'bg-[#181717] border border-white/10',
        textClass: 'text-white'
      };
    case 'linkedin':
      return {
        bgClass: 'bg-[#0a66c2]',
        textClass: 'text-white'
      };
    case 'email':
      return {
        bgClass: 'bg-[#ea4335]',
        textClass: 'text-white'
      };
    case 'resume':
      return {
        bgClass: 'bg-[#f40f0f]',
        textClass: 'text-white'
      };
    default:
      return {
        bgClass: 'bg-gradient-to-br from-gold to-copper',
        textClass: 'text-amber-950'
      };
  }
};

const getGridClasses = (title: string) => {
  if (title.toLowerCase() === 'github') {
    return 'md:col-span-2 lg:col-span-2 h-full';
  }
  return 'col-span-1 h-full';
};

const getIcon = (title: string) => {
  switch (title.toLowerCase()) {
    case 'github':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.547-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
        </svg>
      );
    case 'email':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      );
    case 'resume':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        </svg>
      );
    default:
      return null;
  }
};

export function ConnectSection({ connect }: ConnectSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.02 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="connect"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,var(--color-night-1),#030811)] px-6 py-24 sm:px-10"
    >
      {/* Background Silk Layer */}
      <div className="absolute inset-0 -z-10 opacity-[0.18] pointer-events-none">
        <Silk
          speed={8.5}
          scale={1.0}
          color="#e8e8e8"
          noiseIntensity={0.3}
          rotation={0.0}
          frameloop={isInView ? "always" : "demand"}
        />
      </div>

      {/* Scrim Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#030811]/40 via-transparent to-[#030811]/60 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.32em] text-sky-100/70 uppercase">
            {connect.eyebrow}
          </p>
          <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {connect.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
            {connect.description}
          </p>
        </ScrollReveal>

        <div className="mt-14 grid grid-flow-dense gap-5 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {connect.links.map((item, index) => (
            <ScrollReveal
              key={item.title}
              delay={index * 0.08}
              className={getGridClasses(item.title)}
            >
              <motion.a
                href={item.href}
                target={item.href.startsWith("http") || item.href.endsWith(".pdf") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http") || item.href.endsWith(".pdf")
                    ? "noopener noreferrer"
                    : undefined
                }
                whileHover={{
                  y: -6,
                  scale: 1.015,
                  boxShadow: `0 20px 40px ${getHoverGlow(item.title)}`,
                  borderColor: "rgba(255, 255, 255, 0.25)",
                }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="group flex h-full flex-col justify-between rounded-[34px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_60px_rgba(2,8,23,0.24)] backdrop-blur"
              >
                <div>
                  <div className="flex items-center gap-3">
                    {(() => {
                      const styles = getIconStyles(item.title);
                      return (
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.bgClass} ${styles.textClass} shadow-md`}>
                          {getIcon(item.title)}
                        </div>
                      );
                    })()}
                    <p className="text-xs tracking-[0.28em] text-slate-400 uppercase font-mono">
                      {item.title}
                    </p>
                  </div>
                  <h3 className="font-display mt-5 text-3xl font-semibold text-white">
                    {item.label}
                  </h3>
                  <p className="mt-4 text-sm leading-8 text-slate-300">
                    {item.description}
                  </p>
                </div>
                <span className="mt-8 text-sm font-semibold tracking-[0.2em] text-amber-200 uppercase">
                  open path
                </span>
              </motion.a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
