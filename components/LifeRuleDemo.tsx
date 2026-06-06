"use client";

import { useEffect, useRef } from "react";

// A small grid that iterates the Game-of-Life rules from a fixed seed and
// loops. Older demos showed just step 0 → step 1, which barely demonstrated
// anything; this one runs N steps per cycle so the rule can tell its full
// story (a pattern that grows, oscillates, or progressively dies out).

interface Props {
  initial: ReadonlyArray<readonly [number, number]>;
  cols?: number;
  rows?: number;
  cycleSteps?: number;   // steps before restarting from the seed
  holdMs?: number;       // ms to hold each step
  label: string;
  caption: string;
  accent: string;
}

function step(src: Uint8Array, dst: Uint8Array, cols: number, rows: number) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const yy = y + dy;
          const xx = x + dx;
          if (xx < 0 || xx >= cols || yy < 0 || yy >= rows) continue;
          n += src[yy * cols + xx];
        }
      }
      const alive = src[y * cols + x] === 1;
      dst[y * cols + x] = alive ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
    }
  }
}

export function LifeRuleDemo({
  initial,
  cols = 7,
  rows = 7,
  cycleSteps = 6,
  holdMs = 700,
  label,
  caption,
  accent,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();
    let stepIdx = 0;
    let a = new Uint8Array(cols * rows);
    let b = new Uint8Array(cols * rows);
    const reseed = () => {
      a.fill(0);
      // centre the seed
      const seedW = Math.max(...initial.map(([x]) => x)) + 1;
      const seedH = Math.max(...initial.map(([, y]) => y)) + 1;
      const ox = Math.floor((cols - seedW) / 2);
      const oy = Math.floor((rows - seedH) / 2);
      for (const [x, y] of initial) {
        const px = ox + x;
        const py = oy + y;
        if (px >= 0 && px < cols && py >= 0 && py < rows) a[py * cols + px] = 1;
      }
      stepIdx = 0;
    };
    reseed();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const colorMap: Record<string, string> = {
      "text-signal-violet": "#b388ff",
      "text-signal-cyan": "#7df3ff",
      "text-signal-amber": "#ffd166",
      "text-signal-rose": "#ff7ab6",
    };
    const fill = colorMap[accent] ?? "#b388ff";

    const draw = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      ctx.fillStyle = "#070811";
      ctx.fillRect(0, 0, W, H);

      const cellSize = Math.min(W, H) / Math.max(cols, rows);
      const offX = (W - cellSize * cols) / 2;
      const offY = (H - cellSize * rows) / 2;

      ctx.strokeStyle = "rgba(138,144,164,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= cols; x++) {
        ctx.moveTo(offX + x * cellSize, offY);
        ctx.lineTo(offX + x * cellSize, offY + rows * cellSize);
      }
      for (let y = 0; y <= rows; y++) {
        ctx.moveTo(offX, offY + y * cellSize);
        ctx.lineTo(offX + cols * cellSize, offY + y * cellSize);
      }
      ctx.stroke();

      const r = cellSize * 0.36;
      ctx.fillStyle = fill;
      ctx.shadowColor = fill;
      ctx.shadowBlur = cellSize * 0.85;
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
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillText(`step ${stepIdx} / ${cycleSteps}`, 10, H - 10);
    };

    const loop = (now: number) => {
      if (now - last >= holdMs) {
        last = now;
        if (stepIdx >= cycleSteps) {
          reseed();
        } else {
          step(a, b, cols, rows);
          const tmp = a;
          a = b;
          b = tmp;
          stepIdx++;
        }
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [initial, cols, rows, cycleSteps, holdMs, accent]);

  return (
    <div className="rounded-2xl border hairline bg-ink-950/40 p-5 space-y-3">
      <div className={`font-mono text-[10px] tracking-widest2 uppercase ${accent}`}>{label}</div>
      <div className="aspect-square w-full bg-ink-950 rounded-md overflow-hidden border hairline">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
      <div className="text-sm text-ink-200 leading-snug">{caption}</div>
    </div>
  );
}
