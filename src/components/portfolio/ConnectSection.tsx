"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/portfolio/ScrollReveal";
import type { ConnectData } from "@/components/portfolio/portfolio-data";
import Silk from "./Silk";

interface ConnectSectionProps {
  connect: ConnectData;
}

export function ConnectSection({ connect }: ConnectSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
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

      setStatus("success");
      setStatusMessage("Your message has been sent successfully! I'll get back to you as soon as possible.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
      setStatusMessage(
        "Could not deliver directly via server. You can also send directly to rj863093701@gmail.com."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoFallbackHref = `mailto:rj863093701@gmail.com?subject=${encodeURIComponent(
    subject || "Portfolio Inquiry"
  )}&body=${encodeURIComponent(
    `Hi Ruchir,\n\n${message}\n\nFrom: ${name || "Visitor"} (${email || "No email provided"})`
  )}`;

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
            Have a role, project, or idea in mind? I'd love to hear from you.
          </p>
        </ScrollReveal>

        {/* Contact Layout Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">

          {/* ── LEFT: Get in touch Card ── */}
          <ScrollReveal
            direction="right"
            className="lg:col-span-5 h-full"
          >
            <div className="h-full rounded-[24px] border border-white/10 bg-[#0d1629]/90 p-7 sm:p-9 text-white shadow-[0_24px_60px_rgba(2,8,23,0.35)] backdrop-blur-md flex flex-col justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Get in touch
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
                  I'm open to software engineering roles, internships, freelance projects, and product collaborations.
                </p>

                {/* Contact List */}
                <div className="mt-8 space-y-4">
                  {/* Email */}
                  <a
                    href="mailto:rj863093701@gmail.com"
                    className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 transition hover:border-white/20 hover:bg-white/[0.06]"
                    title="Send Email"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#162544] text-sky-400 group-hover:scale-105 transition-transform">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Email</p>
                      <p className="truncate text-sm font-medium text-slate-100 sm:text-base group-hover:text-sky-300 transition-colors">
                        rj863093701@gmail.com
                      </p>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#162544] text-sky-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Location</p>
                      <p className="text-sm font-medium text-slate-100 sm:text-base">
                        Greater Noida, Uttar Pradesh, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links Row */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
                {/* GitHub */}
                <a
                  href="https://github.com/ruchir0015"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.547-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/ruchir-jain-75419b311?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>

                {/* Resume */}
                <a
                  href="/Ruchir_Jain-Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download Resume"
                  className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-xs font-semibold text-amber-200 hover:bg-amber-400/20 transition-all hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Resume
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* ── RIGHT: Contact Form Card ── */}
          <ScrollReveal
            direction="left"
            delay={0.1}
            className="lg:col-span-7 h-full"
          >
            <div className="h-full rounded-[24px] border border-white/10 bg-white/[0.03] p-7 sm:p-9 shadow-[0_24px_60px_rgba(2,8,23,0.35)] backdrop-blur-md flex flex-col justify-between">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#091122]/70 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#091122]/70 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    placeholder="What's this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#091122]/70 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Tell me a bit more..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#091122]/70 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-3.5 px-6 shadow-[0_12px_28px_rgba(37,99,235,0.35)] transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>

              {/* Feedback States */}
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
                      <a
                        href={mailtoFallbackHref}
                        className="mt-2 inline-block text-xs underline text-emerald-200/80 hover:text-emerald-100"
                      >
                        Also want to open in your default mail app? Click here
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
                      <p>{statusMessage}</p>
                      <a
                        href={mailtoFallbackHref}
                        className="mt-2 inline-block rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-100 hover:bg-amber-500/30 transition"
                      >
                        Click here to send via your Mail App
                      </a>
                    </motion.div>
                  )}

                  {status === "idle" && (
                    <p className="text-center text-xs text-slate-400">
                      I'll get back to you as soon as possible.
                    </p>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
