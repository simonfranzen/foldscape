"use client";

import { useEffect, useRef } from "react";

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
}

const colourMap: Record<string, string> = {
  "text-signal-violet": "#b388ff",
  "text-signal-cyan": "#7df3ff",
  "text-signal-amber": "#ffd166",
  "text-signal-rose": "#ff7ab6",
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
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();
    const fill = colourMap[accent] ?? "#7df3ff";

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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * cellSize * dpr);
      canvas.height = Math.floor(height * cellSize * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#06070d";
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
  }, [rule, initial, width, height, cellSize, cycleMs, accent]);

  return (
    <canvas
      ref={canvasRef}
      className={`block h-auto w-full ${className}`}
      style={{ aspectRatio: `${width * cellSize} / ${height * cellSize}` }}
    />
  );
}
