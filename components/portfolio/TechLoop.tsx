import { FaJava } from "react-icons/fa6";
import type { LogoItem } from "./LogoLoop";
import type { IconType } from "react-icons";
import LogoLoop from "./LogoLoop";
import {
//   SiJava,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiExpress,
  SiFastapi,
  SiMysql,
  SiPostgresql,
  SiSqlite,
  SiRedis,
  SiGit,
  SiGithub,
//   SiVisualstudiocode,
  SiPostman,
  SiCelery,
  SiFramer,
  SiVite,
} from "react-icons/si";

/*
 * Maps a skill label (as it appears in portfolio-data.ts) to a react-icons
 * component + the brand color it should render in. Anything not listed here
 * falls back to a plain text pill so an unrecognized skill never breaks the
 * loop or renders blank.
 */
const ICON_MAP: Record<string, { icon: IconType; color: string }> = {
  "Java": { icon: FaJava, color: "#E76F00" },
  "Python": { icon: SiPython, color: "#3776AB" },
  "JavaScript": { icon: SiJavascript, color: "#F7DF1E" },
  "TypeScript": { icon: SiTypescript, color: "#3178C6" },
  "React": { icon: SiReact, color: "#61DAFB" },
  "Next.js": { icon: SiNextdotjs, color: "#FFFFFF" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#38BDF8" },
  "HTML5": { icon: SiHtml5, color: "#E34F26" },
  "CSS3": { icon: SiCss, color: "#1572B6" },
  "Node.js": { icon: SiNodedotjs, color: "#5FA04E" },
  "Express.js": { icon: SiExpress, color: "#FFFFFF" },
  "FastAPI": { icon: SiFastapi, color: "#009688" },
  "MySQL": { icon: SiMysql, color: "#4479A1" },
  "PostgreSQL": { icon: SiPostgresql, color: "#4169E1" },
  "SQLite": { icon: SiSqlite, color: "#003B57" },
  "Redis": { icon: SiRedis, color: "#FF4438" },
  "Git": { icon: SiGit, color: "#F05032" },
  "GitHub": { icon: SiGithub, color: "#FFFFFF" },
//   "VS Code": { icon: SiVisualstudiocode, color: "#007ACC" },
  "Postman": { icon: SiPostman, color: "#FF6C37" },
  "Celery": { icon: SiCelery, color: "#37814A" },
  "Framer Motion": { icon: SiFramer, color: "#FFFFFF" },
  "Vite": { icon: SiVite, color: "#646CFF" },
};

interface TechLoopProps {
  skills: string[];
}

export function TechLoop({ skills }: TechLoopProps) {
  const logos: LogoItem[] = skills.map((skill) => ({
    node: <span data-skill-name={skill} />,
    title: skill,
  }));

  return (
    <div className="w-full py-4">
      <LogoLoop
        logos={logos}
        speed={45}
        direction="left"
        logoHeight={80}
        gap={48}
        fadeOut
        fadeOutColor="#F5E6C8"
        scaleOnHover
        ariaLabel="Tech stack"
        renderItem={(item) => {
          const skillName = (item as { title?: string }).title ?? "";
          const entry = ICON_MAP[skillName];

          return (
            <div className="flex flex-col items-center gap-2 px-1">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  background: "rgba(44,26,14,0.06)",
                  border: "1px solid rgba(139,94,60,0.25)",
                }}
              >
                {entry ? (
                  <entry.icon className="h-7 w-7" style={{ color: entry.color === "#FFFFFF" ? "#2C1A0E" : entry.color } as React.CSSProperties} />
                ) : (
                  <span className="text-xs font-bold" style={{ color: "#8B5E3C" }}>
                    {skillName.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] font-bold tracking-[0.1em] uppercase whitespace-nowrap"
                style={{ color: "#7A6555" }}
              >
                {skillName}
              </span>
            </div>
          );
        }}
      />
    </div>
  );
}