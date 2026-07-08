import { ScrollReveal } from "@/components/portfolio/ScrollReveal";
import type { ConnectData } from "@/components/portfolio/portfolio-data";

interface ConnectSectionProps {
  connect: ConnectData;
}

export function ConnectSection({ connect }: ConnectSectionProps) {
  return (
    <section
      id="connect"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,var(--color-night-1),#030811)] px-6 py-24 sm:px-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,184,0,0.08),transparent_24%),radial-gradient(circle_at_100%_40%,rgba(56,189,248,0.1),transparent_22%)]" />

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

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {connect.links.map((item, index) => (
            <ScrollReveal
              key={item.title}
              delay={index * 0.08}
              className="h-full"
            >
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group flex h-full flex-col rounded-[34px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_60px_rgba(2,8,23,0.24)] backdrop-blur transition hover:-translate-y-1 hover:border-white/20"
              >
                <p className="text-xs tracking-[0.28em] text-slate-400 uppercase">
                  {item.title}
                </p>
                <h3 className="font-display mt-3 text-3xl font-semibold text-white">
                  {item.label}
                </h3>
                <p className="mt-4 text-sm leading-8 text-slate-300">
                  {item.description}
                </p>
                <span className="mt-8 text-sm font-semibold tracking-[0.2em] text-amber-200 uppercase">
                  open path
                </span>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
