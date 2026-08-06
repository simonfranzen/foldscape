"use client";

import { useEffect, useRef, useState } from "react";
import { getDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// A larger grid running a single pattern continuously, with toroidal wrap.
// Used to show a glider walking across the demo.

interface Props {
  cells: ReadonlyArray<readonly [number, number]>;
  cols?: number;
  rows?: number;
  speedMs?: number; // ms per generation
  label: string;
  caption: string;
  accent?: string;
}

function step(src: Uint8Array, dst: Uint8Array, cols: number, rows: number) {
  for (let y = 0; y < rows; y++) {
    const yN = (y - 1 + rows) % rows;
    const yS = (y + 1) % rows;
    for (let x = 0; x < cols; x++) {
      const xW = (x - 1 + cols) % cols;
      const xE = (x + 1) % cols;
      const n =
        src[yN * cols + xW] +
        src[yN * cols + x] +
        src[yN * cols + xE] +
        src[y * cols + xW] +
        src[y * cols + xE] +
        src[yS * cols + xW] +
        src[yS * cols + x] +
        src[yS * cols + xE];
      const alive = src[y * cols + x] === 1;
      dst[y * cols + x] = alive ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
    }
  }
}

export function LifeGliderDemo({
  cells,
  cols = 20,
  rows = 14,
  speedMs = 180,
  label,
  caption,
  accent = "text-signal-cyan",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reduced, setReduced] = useState(false);

  // JS-driven canvases must honour prefers-reduced-motion themselves; the global
  // CSS rule can't stop a rAF loop. Re-subscribe so a live toggle is respected.
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
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let gen = 0;
    let a = new Uint8Array(cols * rows);
    let b = new Uint8Array(cols * rows);

    const seed = () => {
      a.fill(0);
      for (const [x, y] of cells) {
        const px = ((x % cols) + cols) % cols;
        const py = ((y % rows) + rows) % rows;
        a[py * cols + px] = 1;
      }
      gen = 0;
    };
    seed();

    const resize = () => {
      const dpr = getDpr();
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const colorMap: Record<string, string> = {
      "text-signal-violet": palette.signal.violet,
      "text-signal-cyan": palette.signal.cyan,
      "text-signal-amber": palette.signal.amber,
      "text-signal-rose": palette.signal.rose,
    };
    const fill = colorMap[accent] ?? palette.signal.cyan;

    const draw = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);
      const cellSize = Math.min(W / cols, H / rows);
      const offX = (W - cellSize * cols) / 2;
      const offY = (H - cellSize * rows) / 2;
      const r = Math.max(1, cellSize * 0.42);
      ctx.fillStyle = fill;
      ctx.shadowColor = fill;
      ctx.shadowBlur = cellSize * 1.0;
      ctx.beginPath();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (a[y * cols + x]) {
            const cx = offX + x * cellSize + cellSize / 2;
            const cy = offY + y * cellSize + cellSize / 2;
            ctx.moveTo(cx + r, cy);
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(168,175,191,0.75)";
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillText(`gen ${gen}`, 8, H - 8);
    };

    // Redraw on resize so the static (reduced-motion) frame stays crisp too.
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);

    // Reduced-motion: paint a single static seed frame, no animation loop.
    if (reduced) {
      draw();
      return () => {
        ro.disconnect();
      };
    }

    const loop = (now: number) => {
      acc += now - last;
      last = now;
      while (acc >= speedMs) {
        acc -= speedMs;
        step(a, b, cols, rows);
        const tmp = a;
        a = b;
        b = tmp;
        gen++;
        // restart if pattern dies out entirely
        let pop = 0;
        for (let i = 0; i < a.length; i++) pop += a[i];
        if (pop === 0 || gen > 240) seed();
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [cells, cols, rows, speedMs, accent, reduced]);

  return (
    <div className="hairline space-y-2 rounded-2xl border bg-ink-950/40 p-4">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>{label}</div>
      <div className="hairline aspect-[16/10] w-full overflow-hidden rounded-md border bg-ink-950">
        <canvas ref={canvasRef} className="block h-full w-full" role="img" aria-label={caption} />
      </div>
      <div className="text-xs text-ink-200">{caption}</div>
    </div>
  );
}
