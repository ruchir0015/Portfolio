const ACCENT_COLORS: Record<string, [string, string]> = {
  "from-amber-300/70 to-orange-500/70": ["#fcd34d", "#f97316"],
  "from-rose-300/70 to-fuchsia-500/70": ["#fda4af", "#d946ef"],
  "from-sky-300/70 to-cyan-500/70": ["#7dd3fc", "#06b6d4"],
  "from-emerald-300/70 to-teal-500/70": ["#6ee7b7", "#14b8a6"],
  "from-blue-300/70 to-indigo-500/70": ["#93c5fd", "#6366f1"],
};

export function projectAccentImage(accent: string): string {
  const [c1, c2] = ACCENT_COLORS[accent] ?? ["#8B5E3C", "#2C1A0E"];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${c1}'/>
        <stop offset='100%' stop-color='${c2}'/>
      </linearGradient>
    </defs>
    <rect width='512' height='512' fill='url(#g)'/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}