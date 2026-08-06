"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Compact Rule-N 1D cellular automaton renderer. Each row is one generation
// drawn below the previous. The whole canvas re-renders every `cycleMs` so
// the demo loops cleanly.

interface Props {
  rule?: number;
  initial?: "single" | "random";
  width?: number;
  height?: number;
  cellSize?: number;
  cycleMs?: number;
  accent?: string;
  className?: string;
  ariaLabel?: string;
}

const colourMap: Record<string, string> = {
  "text-signal-violet": palette.signal.violet,
  "text-signal-cyan": palette.signal.cyan,
  "text-signal-amber": palette.signal.amber,
  "text-signal-rose": palette.signal.rose,
};

export function Rule110Demo({
  rule = 110,
  initial = "single",
  width = 120,
  height = 80,
  cellSize = 4,
  cycleMs = 8000,
  accent = "text-signal-cyan",
  className = "",
  ariaLabel,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();
  const [reduced, setReduced] = useState(false);

  // JS-driven canvases must honour prefers-reduced-motion themselves; the
  // global CSS rule only tames declarative animations, not this rAF loop.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();
    const fill = colourMap[accent] ?? palette.signal.cyan;

    const reset = () => {
      const row = new Uint8Array(width);
      if (initial === "single") row[Math.floor(width / 2)] = 1;
      else for (let i = 0; i < width; i++) row[i] = Math.random() < 0.45 ? 1 : 0;
      return row;
    };

    const step = (row: Uint8Array) => {
      const next = new Uint8Array(width);
      for (let i = 0; i < width; i++) {
        const l = row[(i - 1 + width) % width];
        const c = row[i];
        const r = row[(i + 1) % width];
        const key = (l << 2) | (c << 1) | r;
        next[i] = (rule >> key) & 1;
      }
      return next;
    };

    const render = () => {
      canvas.width = Math.floor(width * cellSize * dpr);
      canvas.height = Math.floor(height * cellSize * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      let row = reset();
      ctx.fillStyle = fill;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (row[x]) {
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
        row = step(row);
      }
    };

    render();
    const ro = new ResizeObserver(() => render());
    ro.observe(canvas);

    // Reduced motion: draw a single static frame and never cycle.
    if (reduced) {
      return () => ro.disconnect();
    }

    const loop = (now: number) => {
      if (now - last >= cycleMs) {
        last = now;
        render();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [rule, initial, width, height, cellSize, cycleMs, accent, dpr, reduced]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={ariaLabel ?? `Rule ${rule} cellular automaton`}
      className={`block h-auto w-full ${className}`}
      style={{ aspectRatio: `${width * cellSize} / ${height * cellSize}` }}
    />
  );
}
