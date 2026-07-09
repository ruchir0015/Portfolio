"use client";

import { useEffect, useRef } from "react";

interface StarFieldProps {
  className?: string;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  twinkleOffset: number;
  twinkleSpeed: number;
}

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  trail: TrailPoint[];
}

export function StarField({ className }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let width = 0;
    let height = 0;
    let frameId = 0;
    let isVisible = true;
    let lastTime = performance.now();
    let nextShootingStarAt = lastTime + 1800;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    };

    const buildStars = () => {
      const cols = 20;
      const rows = 15;
      const cellWidth = width / cols;
      const cellHeight = (height * 0.6) / rows;
      const nextStars: Star[] = [];

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          nextStars.push({
            x: col * cellWidth + Math.random() * cellWidth,
            y: row * cellHeight + Math.random() * cellHeight,
            radius: 0.6 + Math.random() * 1.9,
            twinkleOffset: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.8 + Math.random() * 1.2,
          });
        }
      }

      stars = nextStars;
    };

    const spawnShootingStar = () => {
      shootingStars.push({
        x: width * (0.08 + Math.random() * 0.46),
        y: Math.random() * height * 0.22,
        vx: Math.cos(Math.PI * 0.18) * 520,
        vy: Math.sin(Math.PI * 0.18) * 520,
        life: 0,
        maxLife: 0.7 + Math.random() * 0.5,
        trail: [],
      });
      nextShootingStarAt =
        performance.now() + 1500 + Math.random() * 2500;
    };

    const draw = (time: number) => {
      const deltaSeconds = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (!isVisible) {
        frameId = window.requestAnimationFrame(draw);
        return;
      }

      if (time >= nextShootingStarAt) {
        spawnShootingStar();
      }

      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        const alpha =
          0.3 + (Math.sin(time * 0.0015 * star.twinkleSpeed + star.twinkleOffset) + 1) * 0.35;
        context.beginPath();
        context.fillStyle = `rgba(255, 249, 232, ${alpha})`;
        context.shadowBlur = 10;
        context.shadowColor = "rgba(255, 248, 232, 0.6)";
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      }

      context.shadowBlur = 0;

      shootingStars = shootingStars.filter((star) => {
        star.life += deltaSeconds;
        star.x += star.vx * deltaSeconds;
        star.y += star.vy * deltaSeconds;

        const headAlpha = Math.max(0, 1 - star.life / star.maxLife);
        star.trail.unshift({ x: star.x, y: star.y, alpha: headAlpha });

        if (star.trail.length > 40) {
          star.trail.pop();
        }

        for (let index = 1; index < star.trail.length; index += 1) {
          star.trail[index].alpha *= 0.88;
        }

        for (const point of star.trail) {
          const glow = Math.max(point.alpha, 0);
          context.beginPath();
          context.fillStyle = `rgba(255, 245, 225, ${glow})`;
          context.shadowBlur = 16;
          context.shadowColor = "rgba(255, 240, 220, 0.75)";
          context.arc(point.x, point.y, 2.4, 0, Math.PI * 2);
          context.fill();
        }

        context.shadowBlur = 0;

        return (
          star.life < star.maxLife &&
          star.x < width + 120 &&
          star.y < height + 120
        );
      });

      frameId = window.requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? true;
      },
      { threshold: 0.1 }
    );
    intersectionObserver.observe(canvas);

    resizeCanvas();
    frameId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
