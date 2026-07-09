export interface HeroData {
  eyebrow: string;
  name: string;
  title: string;
  summary: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  questStats: Array<{
    label: string;
    value: string;
  }>;
}

export interface AboutData {
  eyebrow: string;
  title: string;
  codename: string;
  currentQuest: string;
  summary: string;
  detail: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
  skills: string[];
  achievements: Array<{
    title: string;
    value: string;
    description: string;
  }>;
}

export interface ExperienceStop {
  id: string;
  company: string;
  role: string;
  years: string;
  description: string;
  stack: string[];
  badge: string;
  x: number;
  y: number;
}

export interface ExperienceData {
  eyebrow: string;
  title: string;
  description: string;
  stops: ExperienceStop[];
}

export interface ProjectItem {
  title: string;
  summary: string;
  status: string;
  stack: string[];
  accent: string;
}

export interface ProjectsData {
  eyebrow: string;
  title: string;
  description: string;
  items: ProjectItem[];
}

export interface ConnectLink {
  title: string;
  href: string;
  label: string;
  description: string;
}

export interface ConnectData {
  eyebrow: string;
  title: string;
  description: string;
  links: ConnectLink[];
}

export const portfolioData = {
  hero: {
    eyebrow: "a new quest begins",
    name: "Ruchir Jain",
    title: "Backend explorer, AI application builder, and interactive web developer.",
    summary: "I enjoy building interactive web experiences, backend systems, AI-powered applications, and developer tools.",
    primaryCta: {
      label: "venture forth",
      href: "#about",
    },
    secondaryCta: {
      label: "see the quest log",
      href: "#experience",
    },
    questStats: [],
  } satisfies HeroData,
  about: {
    eyebrow: "about",
    title: "Character Sheet",
    codename: "BUILDER",
    currentQuest: "🎓 B.Tech CSE (2nd Year) — ITS Engineering College",
    summary:
      "Hi, I'm Ruchir Jain, a B.Tech Computer Science & Engineering student at ITS Engineering College (AKTU) and a Software Development Intern at KYQA. I enjoy building interactive web experiences, backend systems, AI-powered applications, and developer tools. I like combining storytelling with technology to create memorable products instead of ordinary websites.",
    detail:
      "Curious builder · Loves experimenting with new technologies · Believes software should be both functional and memorable.",
    stats: [
      {
        label: "Education",
        value: "ITS Engg. College (AKTU)",
      },
      {
        label: "Class",
        value: "BUILDER",
      },
      {
        label: "Level",
        value: "Lv. 19",
      },
      {
        label: "Location",
        value: "India",
      },
    ],
    skills: [
      "Java",
      "Python",
      "JavaScript",
      "TypeScript",
      "SQL",
      "React",
      "Next.js",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
      "Node.js",
      "Express.js",
      "FastAPI",
      "REST APIs",
      "MySQL",
      "PostgreSQL",
      "SQLite",
      "Redis",
      "Git",
      "GitHub",
      "VS Code",
      "Postman",
      "Celery",
      "Framer Motion",
      "Vite",
    ],
    achievements: [
      {
        title: "Intern",
        value: "KYQA",
        description: "Software Development Intern contributing to backend development and AI integrations.",
      },
      {
        title: "Active",
        value: "2nd Year CSE Student",
        description: "Pursuing B.Tech Computer Science & Engineering under APJ Abdul Kalam Technical University.",
      },
      {
        title: "Builder",
        value: "Urban Guardian Safety App",
        description: "Developed AI safety app features with SOS tools and women-centric safety heatmaps.",
      },
      {
        title: "Innovator",
        value: "NeuroCart Product Assistant",
        description: "Built a conversational AI assistant to intelligently discover products.",
      },
    ],
  } satisfies AboutData,
  experience: {
    eyebrow: "journey so far",
    title: "Experience",
    description: "Every stop, a story. Every role, a relic.",
    stops: [
      {
        id: "its",
        company: "ITS Engineering College, Greater Noida",
        role: "B.Tech CSE Student (AKTU)",
        years: "2024 — Present",
        description:
          "Studying Computer Science & Engineering. Developing strong foundations in Data Structures & Algorithms, Object-Oriented Programming, API Design, and Database Management.",
        stack: ["Java", "Python", "SQL", "Databases"],
        badge: "17",
        x: 25,
        y: 70,
      },
      {
        id: "kyqa",
        company: "KYQA",
        role: "Software Development Intern",
        years: "2026 — Present",
        description:
          "Working on backend APIs, system designs, and software QA pipelines. Gaining hands-on industry experience building scalable systems and integrating AI technologies.",
        stack: ["TypeScript", "Node.js", "FastAPI", "REST APIs"],
        badge: "19",
        x: 75,
        y: 30,
      },
    ],
  } satisfies ExperienceData,
  projects: {
    eyebrow: "featured builds",
    title: "Projects",
    description: "Legendary encounters conquered, each worth remembering.",
    items: [
      {
        title: "Personal Portfolio",
        summary:
          "Interactive Indiana Jones / Tomb Raider inspired portfolio built using: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, AI Portfolio Assistant, Voice Features, Adventure themed UI.",
        status: "Equipped",
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
        accent: "from-amber-300/70 to-orange-500/70",
      },
      {
        title: "Urban Guardian",
        summary:
          "AI-powered personal safety application featuring: Safe route planning, Dynamic safety heatmaps, SOS features, Women safety focus.",
        status: "Legendary",
        stack: ["AI Heatmaps", "React", "FastAPI", "API Design"],
        accent: "from-rose-300/70 to-fuchsia-500/70",
      },
      {
        title: "NeuroCart",
        summary:
          "AI shopping assistant helping users discover products intelligently.",
        status: "Epic",
        stack: ["React", "Node.js", "AI Integrations", "Database"],
        accent: "from-sky-300/70 to-cyan-500/70",
      },
      {
        title: "Recipe Recommendation",
        summary:
          "Backend API built using: FastAPI, SQLAlchemy, Python.",
        status: "Rare",
        stack: ["FastAPI", "SQLAlchemy", "Python", "PostgreSQL"],
        accent: "from-emerald-300/70 to-teal-500/70",
      },
    ],
  } satisfies ProjectsData,
  connect: {
    eyebrow: "final camp",
    title: "Let's Connect",
    description: "Establish a link, recruit for a party, or share a story.",
    links: [
      {
        title: "Resume",
        href: "/resume.pdf",
        label: "Loot",
        description: "Full adventure log. Grab the record of prior campaigns.",
      },
      {
        title: "LinkedIn",
        href: "https://www.linkedin.com/in/ruchir-jain-75419b311?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        label: "Connect",
        description: "Join the party. Establish a secure professional link.",
      },
      {
        title: "GitHub",
        href: "https://github.com/ruchir0015",
        label: "Code Trail",
        description: "Inspect the repository. Audit the source code artifacts.",
      },
      {
        title: "Email",
        href: "mailto:ruchirjain@example.com?subject=Portfolio%20Inquiry",
        label: "Message",
        description: "Send a raven. Launch a direct transmission.",
      },
    ],
  } satisfies ConnectData,
} as const;
