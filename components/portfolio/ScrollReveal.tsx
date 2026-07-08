"use client";

import { motion } from "framer-motion";

type Direction = "up" | "down" | "left" | "right";

const offsets = {
  up: { y: 44 },
  down: { y: -44 },
  left: { x: -44 },
  right: { x: 44 },
} satisfies Record<Direction, { x?: number; y?: number }>;

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
