"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/portfolio/ScrollReveal";
import type { ConnectData } from "@/components/portfolio/portfolio-data";
import Silk from "./Silk";
import PixelCard from "./PixelCard";

interface ConnectSectionProps {
  connect: ConnectData;
}

const getHoverGlow = (title: string) => {
  switch (title.toLowerCase()) {
    case "github":
      return "rgba(255, 255, 255, 0.14)";
    case "linkedin":
      return "rgba(14, 118, 168, 0.25)";
    case "resume":
      return "rgba(244, 15, 15, 0.25)";
    default:
      return "rgba(255, 255, 255, 0.08)";
  }
};

const getIconStyles = (title: string) => {
  switch (title.toLowerCase()) {
    case "github":
      return {
        bgClass: "bg-[#181717] border border-white/10",
        textClass: "text-white",
      };
    case "linkedin":
      return {
        bgClass: "bg-[#0a66c2]",
        textClass: "text-white",
      };
    case "resume":
      return {
        bgClass: "bg-[#f40f0f]",
        textClass: "text-white",
      };
    default:
      return {
        bgClass: "bg-gradient-to-br from-gold to-copper",
        textClass: "text-amber-950",
      };
  }
};

const getIcon = (title: string) => {
  switch (title.toLowerCase()) {
    case "github":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.547-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "resume":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
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

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "notice" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || "Portfolio Inquiry",
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to send message directly right now.");
      }

      const data = await response.json().catch(() => ({}));
      if (data.delivered) {
        setStatus("success");
        setStatusMessage("Your message has been sent directly to Ruchir's inbox!");
      } else {
        setStatus("notice");
        setStatusMessage("Message recorded! To guarantee instant delivery, click below to open in your mail app:");
      }

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
      setStatusMessage("Could not connect to server. You can send directly via your mail app below:");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoFallbackHref = `mailto:rj863093701@gmail.com?subject=${encodeURIComponent(
    subject || "Portfolio Inquiry"
  )}&body=${encodeURIComponent(
    `Hi Ruchir,\n\n${message}\n\nFrom: ${name || "Visitor"} (${email || "No email provided"})`
  )}`;

  // Filter out mail from the links array since the right side is the interactive mail form
  const bigBoxLinks = connect.links.filter((link) => link.title.toLowerCase() !== "email");

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
        {/* Section Header */}
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.32em] text-sky-100/70 uppercase">
            {connect.eyebrow}
          </p>
          <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Let's build something together
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
            Establish a link, recruit for a party, or send a direct transmission.
          </p>
        </ScrollReveal>

        {/* Two-Column Grid: Big Box Links on Left, PixelCard Form on Right */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">

          {/* ── LEFT: Big Box Button Links (GitHub, LinkedIn, Resume) ── */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            {bigBoxLinks.map((item, index) => {
              const styles = getIconStyles(item.title);
              const isExternal = item.href.startsWith("http") || item.href.endsWith(".pdf");

              return (
                <ScrollReveal
                  key={item.title}
                  delay={index * 0.08}
                  direction="right"
                  className="flex-1"
                >
                  <motion.a
                    href={item.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    whileHover={{
                      y: -4,
                      scale: 1.015,
                      boxShadow: `0 20px 40px ${getHoverGlow(item.title)}`,
                      borderColor: "rgba(255, 255, 255, 0.25)",
                    }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="group flex h-full flex-col justify-between rounded-[26px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_60px_rgba(2,8,23,0.24)] backdrop-blur transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles.bgClass} ${styles.textClass} shadow-md group-hover:scale-105 transition-transform`}
                        >
                          {getIcon(item.title)}
                        </div>
                        <p className="text-xs tracking-[0.28em] text-slate-400 uppercase font-mono">
                          {item.title}
                        </p>
                      </div>

                      <h3 className="font-display mt-4 text-2xl font-semibold text-white">
                        {item.label}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {item.description}
                      </p>
                    </div>

                    <span className="mt-5 text-xs font-semibold tracking-[0.2em] text-amber-200 uppercase flex items-center gap-1.5 group-hover:text-amber-100">
                      open path{" "}
                      <span className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5">
                        ↗
                      </span>
                    </span>
                  </motion.a>
                </ScrollReveal>
              );
            })}
          </div>

            {/* ── RIGHT: PixelCard Contact Input Box (Black & White) ── */}
            <ScrollReveal
              direction="left"
              delay={0.12}
              className="lg:col-span-7 flex flex-col"
            >
              <PixelCard
                variant="default"
                colors={["#ffffff", "#f4f4f5", "#e4e4e7", "#d4d4d8", "#a1a1aa", "#71717a", "#27272a"]}
                glowColor="#ffffff"
                gap={9}
                pixelSize={2.5}
                speed={24}
                spotlight={0.35}
                glow={0.35}
                opacity={0.55}
                fade={0.45}
                trigger="hover"
                radius={28}
                theme="dark"
                noFocus={true}
                className="h-full w-full border border-white/15 bg-zinc-950/90 p-7 sm:p-9 shadow-[0_24px_60px_rgba(0,0,0,0.85)] backdrop-blur-md"
              >
                <div className="w-full flex flex-col justify-between h-full select-text">
                  <div>
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className="inline-flex h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
                      <p className="text-xs uppercase font-mono tracking-widest text-zinc-300 font-semibold">
                        Direct Transmission
                      </p>
                    </div>
                    <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      Get in touch
                    </h3>
                    <p className="mt-1.5 text-sm text-zinc-400">
                      Send a message straight to my inbox for roles, projects, or collaborations.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Name & Email */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5 font-mono"
                        >
                          Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-xl border border-white/15 bg-zinc-900/90 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-inner focus:border-white focus:outline-none focus:ring-1 focus:ring-white/30 transition"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5 font-mono"
                        >
                          Email
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-white/15 bg-zinc-900/90 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-inner focus:border-white focus:outline-none focus:ring-1 focus:ring-white/30 transition"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5 font-mono"
                      >
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        placeholder="What's this about?"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-zinc-900/90 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-inner focus:border-white focus:outline-none focus:ring-1 focus:ring-white/30 transition"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5 font-mono"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        placeholder="Tell me a bit more..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full resize-none rounded-xl border border-white/15 bg-zinc-900/90 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-inner focus:border-white focus:outline-none focus:ring-1 focus:ring-white/30 transition"
                      />
                    </div>

                    {/* Submit Button (Black & White) */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold py-3.5 px-6 shadow-[0_12px_28px_rgba(255,255,255,0.12)] transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-zinc-950" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5 text-zinc-950">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                          </svg>
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Status Feedback */}
                  <div className="mt-4">
                    <AnimatePresence mode="wait">
                      {status === "success" && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center text-sm text-emerald-300"
                        >
                          <p className="font-semibold">✓ {statusMessage}</p>
                        </motion.div>
                      )}

                      {status === "notice" && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="rounded-xl border border-white/20 bg-zinc-900/90 p-3.5 text-center text-sm text-zinc-200"
                        >
                          <p className="font-medium text-white mb-2.5">{statusMessage}</p>
                          <a
                            href={mailtoFallbackHref}
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            Open in Gmail / Mail App
                          </a>
                        </motion.div>
                      )}

                      {status === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-center text-sm text-amber-200"
                        >
                          <p className="mb-2">{statusMessage}</p>
                          <a
                            href={mailtoFallbackHref}
                            className="inline-block rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition"
                          >
                            Send via Mail App
                          </a>
                        </motion.div>
                      )}

                      {status === "idle" && (
                        <p className="text-center text-xs text-zinc-400">
                          I'll get back to you as soon as possible.
                        </p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </PixelCard>
            </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
