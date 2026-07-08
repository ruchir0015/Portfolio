"use client";

import { useMemo } from "react";
import { ScrollReveal } from "@/components/portfolio/ScrollReveal";
import type { ProjectsData } from "@/components/portfolio/portfolio-data";
import InfiniteMenu from "@/components/portfolio/InfiniteMenu";
import { projectAccentImage } from "@/components/portfolio/projectImage";

interface ProjectsSectionProps {
  projects: ProjectsData;
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const menuItems = useMemo(
    () =>
      projects.items.map((project) => ({
        image: projectAccentImage(project.accent),
        link: "#",
        title: project.title,
        description: project.summary,
      })),
    [projects.items]
  );

  return (
    <section
      id="projects"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,var(--color-night-2),var(--color-night-1))] px-6 py-24 sm:px-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(74,153,255,0.14),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.14),transparent_18%)]" />

      <div className="relative mx-auto max-w-7xl">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.32em] text-sky-100/70 uppercase">
            {projects.eyebrow}
          </p>
          <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {projects.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
            {projects.description}
          </p>
        </ScrollReveal>

        <div className="relative mt-14 h-[650px] w-full overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.02]">
          <InfiniteMenu items={menuItems} />
        </div>
      </div>
    </section>
  );
}