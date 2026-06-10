"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Inline mini DLA simulator for the /dla story page. Smaller, simpler, and
// self-contained version of the full Explorer — single point seed at centre,
// walkers + stickiness sliders, a reset button. Renders to a square canvas
// (~280×280 CSS pixels).
//
// Colours mirror the design system: rose for the cluster, faint rose for
// drifting walkers, deep ink as background.

interface Props {
  caption: string;
  className?: string;
}

const ROSE_RGB = "255, 122, 182";
const CELL_PX = 3; // CSS px per grid cell — small canvas, chunky cells

export function DlaMiniSim({ caption, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [walkers, setWalkers] = useState(120);
  const [stickiness, setStickiness] = useState(1.0);
  const [running, setRunning] = useState(true);
  const [stuck, setStuck] = useState(1);
  const [resetTick, setResetTick] = useState(0);
  const dpr = useDpr();

  const paramsRef = useRef({ walkers, stickiness, running });
  paramsRef.current = { walkers, stickiness, running };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const cellPx = CELL_PX * dpr;
    let gridW = 1;
    let gridH = 1;
    let grid = new Uint8Array(0);
    let live: Array<{ x: number; y: number }> = [];
    let frame = 0;
    let stuckCount = 0;

    const seedCluster = () => {
      const cx = Math.floor(gridW / 2);
      const cy = Math.floor(gridH / 2);
      grid[cy * gridW + cx] = 1;
      stuckCount = 1;
      setStuck(1);
    };

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      gridW = Math.max(20, Math.floor(canvas.width / cellPx));
      gridH = Math.max(20, Math.floor(canvas.height / cellPx));
      grid = new Uint8Array(gridW * gridH);
      live = [];
      stuckCount = 0;
      frame = 0;
      seedCluster();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawnWalker = () => {
      const cx = gridW / 2;
      const cy = gridH / 2;
      const R = Math.min(gridW, gridH) / 2 - 2;
      const ang = Math.random() * Math.PI * 2;
      return {
        x: Math.floor(cx + Math.cos(ang) * R),
        y: Math.floor(cy + Math.sin(ang) * R),
      };
    };

    const hasStuckNeighbour = (x: number, y: number) => {
      if (x > 0 && grid[y * gridW + (x - 1)] > 0) return true;
      if (x < gridW - 1 && grid[y * gridW + (x + 1)] > 0) return true;
      if (y > 0 && grid[(y - 1) * gridW + x] > 0) return true;
      if (y < gridH - 1 && grid[(y + 1) * gridW + x] > 0) return true;
      return false;
    };

    const step = () => {
      const p = paramsRef.current;
      if (!p.running) return;
      const target = Math.min(p.walkers, 1500);
      while (live.length < target) {
        const w0 = spawnWalker();
        if (grid[w0.y * gridW + w0.x] === 0) live.push(w0);
        else break;
      }

      for (let i = live.length - 1; i >= 0; i--) {
        const w = live[i];
        const r = Math.random();
        if (r < 0.25) w.x++;
        else if (r < 0.5) w.x--;
        else if (r < 0.75) w.y++;
        else w.y--;
        if (w.x < 0) w.x = 0;
        else if (w.x >= gridW) w.x = gridW - 1;
        if (w.y < 0) w.y = 0;
        else if (w.y >= gridH) w.y = gridH - 1;
        if (hasStuckNeighbour(w.x, w.y) && Math.random() < p.stickiness) {
          const idx = w.y * gridW + w.x;
          const age = Math.min(255, 1 + Math.floor((frame / 60) * 4));
          grid[idx] = age;
          stuckCount++;
          live.splice(i, 1);
        }
      }
      frame++;
    };

    const draw = () => {
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < gridH; y++) {
        for (let x = 0; x < gridW; x++) {
          const v = grid[y * gridW + x];
          if (v > 0) {
            const a = 0.55 + (v / 255) * 0.4;
            ctx.fillStyle = `rgba(${ROSE_RGB}, ${a})`;
            ctx.fillRect(x * cellPx, y * cellPx, cellPx, cellPx);
          }
        }
      }
      ctx.fillStyle = `rgba(${ROSE_RGB}, 0.18)`;
      for (const w of live) {
        ctx.fillRect(w.x * cellPx, w.y * cellPx, cellPx, cellPx);
      }
    };

    let lastReport = 0;
    const loop = () => {
      step();
      draw();
      if (frame - lastReport > 20) {
        setStuck(stuckCount);
        lastReport = frame;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [resetTick, dpr]);

  return (
    <div className={`hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5 ${className}`}>
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
        {caption}
      </div>
      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[280px_1fr]">
        <div className="hairline relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-md border bg-ink-950 md:mx-0">
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
          <div className="pointer-events-none absolute left-2 right-2 top-2 flex items-center justify-between gap-2">
            <div className="glass hairline rounded-sm border px-2 py-1 font-mono text-[9px] uppercase tracking-widest2 text-ink-200">
              centre seed
            </div>
            <div className="glass hairline rounded-sm border px-2 py-1 font-mono text-[9px] uppercase tracking-widest2 text-signal-rose">
              {stuck.toLocaleString()} stuck
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <SliderRow
            label="Walkers / frame"
            value={walkers}
            min={20}
            max={400}
            step={10}
            display={walkers.toString()}
            onChange={setWalkers}
          />
          <SliderRow
            label="Stickiness"
            value={stickiness}
            min={0.1}
            max={1}
            step={0.05}
            display={stickiness.toFixed(2)}
            onChange={setStickiness}
          />
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setRunning((v) => !v)}
              className={`flex-1 rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                running
                  ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose hover:bg-signal-rose/20"
                  : "hover:text-ink-50 border-ink-500/50 text-ink-200 hover:border-ink-300/50"
              }`}
            >
              {running ? "❚❚ Pause" : "▶ Play"}
            </button>
            <button
              onClick={() => setResetTick((t) => t + 1)}
              className="hairline flex-1 rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
            >
              ⟳ Reset
            </button>
          </div>
          <p className="font-mono text-[10px] leading-relaxed text-ink-400">
            More walkers · faster growth. Lower stickiness · denser, blobbier cluster — walkers slip
            past tips before freezing.
          </p>
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">{label}</div>
        <div className="font-mono text-[10px] text-signal-rose">{display}</div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-signal-rose"
      />
    </div>
  );
}
