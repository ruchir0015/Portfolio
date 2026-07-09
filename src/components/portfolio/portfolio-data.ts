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
  link: string;
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
        value: "Privault",
        description: "Software Development Intern contributing to front-end development, scroll-driven 3D animations and design systems using React, TypeScript, Three.js & GSAP.",
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
        id: "privault",
        company: "Privault",
        role: "Software Development Intern",
        years: "2026 — Present",
        description:
          "Contributing to front-end development on an AI-powered data privacy and compliance platform. Built and debugged scroll-driven 3D animations, and contributed to the product's design system and reusable component library.",
        stack: ["React", "TypeScript", "Vite", "Three.js", "GSAP", "Tailwind CSS"],
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
          "Interactive Indiana Jones / Tomb Raider inspired portfolio built using: React, Vite, TypeScript, Tailwind CSS, Framer Motion, AI Portfolio Assistant, Voice Features, Adventure themed UI.",
        status: "Equipped",
        stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "Framer Motion"],
        accent: "from-amber-300/70 to-orange-500/70",
        link: "https://portfolio-git-main-ruchir15.vercel.app",
      },
      {
        title: "Privault",
        summary:
          "AI-powered data privacy and compliance platform where I contribute to front-end development using React, TypeScript, Vite, Tailwind CSS, Three.js, and GSAP. Built and debugged scroll-driven 3D animations and contributed to the product's design system and reusable component library.",
        status: "Mythic",
        stack: ["React", "TypeScript", "Vite", "Three.js", "GSAP"],
        accent: "from-blue-300/70 to-indigo-500/70",
        link: "https://privault-theta.vercel.app/",
      },
      {
        title: "Urban Guardian",
        summary:
          "AI-powered personal safety application featuring: Safe route planning, Dynamic safety heatmaps, SOS features, Women safety focus.",
        status: "Legendary",
        stack: ["AI Heatmaps", "React", "FastAPI", "API Design"],
        accent: "from-rose-300/70 to-fuchsia-500/70",
        link: "https://github.com/ruchir0015/Urban-Guardian",
      },
      {
        title: "NeuroCart",
        summary:
          "AI shopping assistant helping users discover products intelligently.",
        status: "Epic",
        stack: ["React", "Node.js", "AI Integrations", "Database"],
        accent: "from-sky-300/70 to-cyan-500/70",
        link: "https://github.com/ruchir0015",
      },
      {
        title: "Recipe Recommendation",
        summary:
          "Backend API built using: FastAPI, SQLAlchemy, Python.",
        status: "Rare",
        stack: ["FastAPI", "SQLAlchemy", "Python", "PostgreSQL"],
        accent: "from-emerald-300/70 to-teal-500/70",
        link: "https://github.com/ruchir0015",
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
        href: "/final_Ruchir_resume.pdf",
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
        href: "https://mail.google.com/mail/?view=cm&fs=1&to=rj863093701@gmail.com&su=Portfolio%20Inquiry",
        label: "Message",
        description: "Send a raven. Launch a direct transmission.",
      },
    ],
  } satisfies ConnectData,
} as const;
