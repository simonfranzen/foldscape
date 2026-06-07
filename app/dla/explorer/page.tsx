"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

type SeedKind = "point" | "line" | "ring";

interface Preset {
  id: string;
  label: string;
  note: string;
  seed: SeedKind;
  walkers: number;
  stickiness: number;
}

const PRESETS: Preset[] = [
  {
    id: "classic",
    label: "Centre seed",
    note: "single point, slow",
    seed: "point",
    walkers: 80,
    stickiness: 1.0,
  },
  {
    id: "fast",
    label: "Centre · fast",
    note: "80 walkers/frame",
    seed: "point",
    walkers: 300,
    stickiness: 1.0,
  },
  {
    id: "line",
    label: "Bottom line",
    note: "crystal growth",
    seed: "line",
    walkers: 200,
    stickiness: 1.0,
  },
  {
    id: "ring",
    label: "Ring seed",
    note: "inside-out coral",
    seed: "ring",
    walkers: 200,
    stickiness: 1.0,
  },
];

const COLORS = {
  rose: {
    rgb: "255, 122, 182",
    tw: "text-signal-rose",
    border: "border-signal-rose/60",
    bg: "bg-signal-rose/10",
    swatch: "bg-signal-rose",
  },
  cyan: {
    rgb: "125, 243, 255",
    tw: "text-signal-cyan",
    border: "border-signal-cyan/60",
    bg: "bg-signal-cyan/10",
    swatch: "bg-signal-cyan",
  },
  violet: {
    rgb: "179, 136, 255",
    tw: "text-signal-violet",
    border: "border-signal-violet/60",
    bg: "bg-signal-violet/10",
    swatch: "bg-signal-violet",
  },
  amber: {
    rgb: "255, 209, 102",
    tw: "text-signal-amber",
    border: "border-signal-amber/60",
    bg: "bg-signal-amber/10",
    swatch: "bg-signal-amber",
  },
} as const;
type ColorKey = keyof typeof COLORS;

export default function DlaExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.dla;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [seed, setSeed] = useState<SeedKind>("point");
  const [walkers, setWalkers] = useState(150);
  const [stickiness, setStickiness] = useState(1.0);
  const [cell, setCell] = useState(3); // px per grid cell
  const [color, setColor] = useState<ColorKey>("rose");
  const [running, setRunning] = useState(true);
  const [stuck, setStuck] = useState(0);
  const [resetTick, setResetTick] = useState(0);

  const paramsRef = useRef({ walkers, stickiness, color, running });
  paramsRef.current = { walkers, stickiness, color, running };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let raf = 0;
    let cellPx = cell * dpr;
    let gridW = 1;
    let gridH = 1;
    let grid = new Uint8Array(0); // 0 empty, >0 stuck (stores age tier 1..255)
    let live: Array<{ x: number; y: number }> = [];
    let frame = 0;
    let stuckCount = 0;

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      gridW = Math.max(20, Math.floor(canvas.width / cellPx));
      gridH = Math.max(20, Math.floor(canvas.height / cellPx));
      grid = new Uint8Array(gridW * gridH);
      live = [];
      stuckCount = 0;
      seedCluster();
    };

    const seedCluster = () => {
      if (seed === "point") {
        const cx = Math.floor(gridW / 2);
        const cy = Math.floor(gridH / 2);
        grid[cy * gridW + cx] = 1;
        stuckCount = 1;
      } else if (seed === "line") {
        const y = gridH - 2;
        for (let x = 0; x < gridW; x++) grid[y * gridW + x] = 1;
        stuckCount = gridW;
      } else {
        const cx = gridW / 2;
        const cy = gridH / 2;
        const r = Math.min(gridW, gridH) / 3;
        const steps = 360;
        for (let i = 0; i < steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          const x = Math.round(cx + Math.cos(a) * r);
          const y = Math.round(cy + Math.sin(a) * r);
          if (x >= 0 && x < gridW && y >= 0 && y < gridH) {
            const idx = y * gridW + x;
            if (grid[idx] === 0) {
              grid[idx] = 1;
              stuckCount++;
            }
          }
        }
      }
      setStuck(stuckCount);
    };

    cellPx = cell * dpr;
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawnWalker = () => {
      // Spawn at the boundary of a circle that expands with cluster.
      // For a centre seed: a large bounding circle. For line: spawn at top.
      if (seed === "line") {
        return { x: Math.floor(Math.random() * gridW), y: 0 };
      }
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
      // top up live pool
      const target = Math.min(p.walkers, 4000);
      while (live.length < target) {
        const w0 = spawnWalker();
        // skip spawns that land on the cluster directly
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
        // reflect at walls
        if (w.x < 0) w.x = 0;
        else if (w.x >= gridW) w.x = gridW - 1;
        if (w.y < 0) w.y = 0;
        else if (w.y >= gridH) w.y = gridH - 1;
        // stick?
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
      const p = paramsRef.current;
      const rgb = COLORS[p.color].rgb;
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // stuck cells, colour by age tier
      for (let y = 0; y < gridH; y++) {
        for (let x = 0; x < gridW; x++) {
          const v = grid[y * gridW + x];
          if (v > 0) {
            const a = 0.55 + (v / 255) * 0.4;
            ctx.fillStyle = `rgba(${rgb}, ${a})`;
            ctx.fillRect(x * cellPx, y * cellPx, cellPx, cellPx);
          }
        }
      }
      // walkers — faint
      ctx.fillStyle = `rgba(${rgb}, 0.18)`;
      for (const w of live) {
        ctx.fillRect(w.x * cellPx, w.y * cellPx, cellPx, cellPx);
      }
    };

    let lastReport = 0;
    const loop = () => {
      step();
      draw();
      if (frame - lastReport > 30) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, cell, resetTick]);

  const applyPreset = (p: Preset) => {
    setSeed(p.seed);
    setWalkers(p.walkers);
    setStickiness(p.stickiness);
    setResetTick((t) => t + 1);
  };

  const c = COLORS[color];

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              DLA · seed = {seed} · cell {cell}px
            </div>
            <div
              className={`glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 ${c.tw}`}
            >
              {stuck.toLocaleString()} stuck · {walkers} walkers
            </div>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${c.tw}`}>
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Presets
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  className="hairline rounded-md border px-3 py-2 text-left text-ink-200 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
                >
                  <div className="font-mono text-xs">{p.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">{p.note}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Seed
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["point", "line", "ring"] as SeedKind[]).map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    setSeed(k);
                    setResetTick((t) => t + 1);
                  }}
                  className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    seed === k
                      ? `${c.border} ${c.tw} ${c.bg}`
                      : "hairline text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <SliderRow
              label="Walkers / frame"
              value={walkers}
              min={10}
              max={1000}
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
            <SliderRow
              label="Cell size (px)"
              value={cell}
              min={2}
              max={8}
              step={1}
              display={`${cell}px`}
              onChange={(v) => {
                setCell(v);
                setResetTick((t) => t + 1);
              }}
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Colour
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(COLORS) as ColorKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setColor(k)}
                  aria-label={k}
                  className={`flex flex-col items-center justify-center gap-1 rounded-md border py-2 transition-colors ${
                    color === k
                      ? `${COLORS[k].border} ${COLORS[k].bg}`
                      : "hairline hover:border-ink-300/50"
                  }`}
                >
                  <span className={`h-4 w-4 rounded-full ${COLORS[k].swatch}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-2 border-b p-5">
            <button
              onClick={() => setRunning((v) => !v)}
              className={`w-full rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                running
                  ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                  : `${c.border} ${c.tw} ${c.bg}`
              }`}
            >
              {running ? "❚❚ Pause" : "▶ Play"}
            </button>
            <button
              onClick={() => setResetTick((t) => t + 1)}
              className="hairline hover:text-ink-50 w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50"
            >
              ⟳ Reset
            </button>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
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
        <div className="font-mono text-[10px] text-ink-400">{display}</div>
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
