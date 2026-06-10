"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

type Restriction = "none" | "norepeat" | "noneighbour" | "noopposite";

interface DotColor {
  id: string;
  label: string;
  css: string; // for swatch
  draw: string; // canvas fillStyle (slightly translucent)
}

const COLORS: DotColor[] = [
  { id: "cyan", label: "cyan", css: "bg-signal-cyan", draw: "rgba(125, 243, 255, 0.55)" },
  { id: "violet", label: "violet", css: "bg-signal-violet", draw: "rgba(168, 132, 255, 0.55)" },
  { id: "amber", label: "amber", css: "bg-signal-amber", draw: "rgba(255, 209, 102, 0.55)" },
  { id: "rose", label: "rose", css: "bg-signal-rose", draw: "rgba(255, 122, 182, 0.55)" },
];

function magicRatio(n: number): number {
  return 1 / (1 + 2 * Math.cos(Math.PI / n));
}

interface Preset {
  id: string;
  label: string;
  n: number; // 0 == fern
  restriction: Restriction;
  ratio: number | null; // null = use magic
  note?: string;
}

const PRESETS: Preset[] = [
  { id: "triangle", label: "Triangle", n: 3, restriction: "none", ratio: 0.5 },
  { id: "square", label: "Square (no-repeat)", n: 4, restriction: "norepeat", ratio: 0.5 },
  { id: "pentagon", label: "Pentagon", n: 5, restriction: "none", ratio: null },
  {
    id: "fern",
    label: "Barnsley fern",
    n: 0,
    restriction: "none",
    ratio: null,
    note: "IFS · 4 affine maps",
  },
];

// Barnsley fern affine maps, applied to (x, y).
// Each entry: [a, b, c, d, e, f] meaning x' = a*x + b*y + e, y' = c*x + d*y + f.
// Probabilities: 0.01, 0.85, 0.07, 0.07.
const FERN_MAPS: Array<[number, number, number, number, number, number]> = [
  [0.0, 0.0, 0.0, 0.16, 0.0, 0.0],
  [0.85, 0.04, -0.04, 0.85, 0.0, 1.6],
  [0.2, -0.26, 0.23, 0.22, 0.0, 1.6],
  [-0.15, 0.28, 0.26, 0.24, 0.0, 0.44],
];
const FERN_CUMULATIVE = [0.01, 0.86, 0.93, 1.0];

function pickFernMap(): number {
  const r = Math.random();
  for (let i = 0; i < FERN_CUMULATIVE.length; i++) {
    if (r < FERN_CUMULATIVE[i]) return i;
  }
  return FERN_CUMULATIVE.length - 1;
}

export default function ChaosGameExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.chaosgame;
  const dpr = useDpr();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // controls
  const [n, setN] = useState(3);
  const [restriction, setRestriction] = useState<Restriction>("none");
  const [autoMagic, setAutoMagic] = useState(true);
  const [ratio, setRatio] = useState(0.5);
  // Default speed: 8000 was effectively "image appears instantly", losing
  // the IFS "drawing itself" feeling. 1500 lets the eye follow how the
  // fractal accumulates over a few seconds. Slider still goes up to 50k.
  const [speed, setSpeed] = useState(1500);
  const [colorId, setColorId] = useState("cyan");
  const [mode, setMode] = useState<"polygon" | "fern">("polygon");
  const [totalPoints, setTotalPoints] = useState(0);
  const [clearTick, setClearTick] = useState(0); // bump to clear canvas

  // refs for animation loop (avoid re-renders per frame)
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const historyRef = useRef<number[]>([]);
  const countRef = useRef(0);
  const lastReportRef = useRef(0);

  // sync magic ratio when n changes and autoMagic is on
  useEffect(() => {
    if (mode === "polygon" && autoMagic) {
      setRatio(parseFloat(magicRatio(n).toFixed(4)));
    }
  }, [n, autoMagic, mode]);

  // restart-on-change: clear canvas and counters whenever the rule changes
  useEffect(() => {
    countRef.current = 0;
    lastReportRef.current = 0;
    setTotalPoints(0);
    historyRef.current = [];
    posRef.current = { x: 0, y: 0 };
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = palette.canvas.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [n, ratio, restriction, mode, clearTick]);

  // main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sizeCanvas = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);
      // Sketch the polygon outline for context
      if (mode === "polygon") {
        const { vx, vy } = polygonLayout(n, W, H);
        ctx.strokeStyle = "rgba(125,243,255,0.18)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const xx = vx[i];
          const yy = vy[i];
          if (i === 0) ctx.moveTo(xx, yy);
          else ctx.lineTo(xx, yy);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = "rgba(125,243,255,0.6)";
        for (let i = 0; i < n; i++) {
          ctx.beginPath();
          ctx.arc(vx[i], vy[i], 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    sizeCanvas();
    const ro = new ResizeObserver(sizeCanvas);
    ro.observe(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => ro.disconnect();

    let raf = 0;
    const fillStyle = COLORS.find((c) => c.id === colorId)?.draw ?? COLORS[0].draw;

    const W = () => canvas.clientWidth;
    const H = () => canvas.clientHeight;

    const tick = () => {
      const w = W();
      const h = H();
      ctx.fillStyle = fillStyle;

      if (mode === "fern") {
        // map fern world (x ≈ [-3,3], y ≈ [0,10]) into canvas
        const margin = 14;
        const sx = (w - 2 * margin) / 6; // x range 6
        const sy = (h - 2 * margin) / 10; // y range 10
        const scale = Math.min(sx, sy);
        const ox = w / 2;
        const oy = h - margin;

        let { x, y } = posRef.current;
        for (let i = 0; i < speed; i++) {
          const m = pickFernMap();
          const map = FERN_MAPS[m];
          const nx = map[0] * x + map[1] * y + map[4];
          const ny = map[2] * x + map[3] * y + map[5];
          x = nx;
          y = ny;
          const px = ox + x * scale;
          const py = oy - y * scale;
          ctx.fillRect(px, py, 1, 1);
        }
        posRef.current = { x, y };
      } else {
        const { vx, vy } = polygonLayout(n, w, h);
        let { x, y } = posRef.current;
        if (x === 0 && y === 0) {
          x = w / 2;
          y = h / 2;
        }
        const hist = historyRef.current;
        for (let i = 0; i < speed; i++) {
          let pick: number;
          let attempts = 0;
          do {
            pick = (Math.random() * n) | 0;
            attempts++;
            if (attempts > 64) break;
          } while (isForbidden(pick, hist, n, restriction));

          x = x + ratio * (vx[pick] - x);
          y = y + ratio * (vy[pick] - y);

          hist.unshift(pick);
          if (hist.length > 2) hist.pop();

          ctx.fillRect(x, y, 1, 1);
        }
        posRef.current = { x, y };
      }

      countRef.current += speed;
      // throttle the React state update to ~10/s
      const now = performance.now();
      if (now - lastReportRef.current > 100) {
        lastReportRef.current = now;
        setTotalPoints(countRef.current);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [n, ratio, restriction, mode, speed, colorId, clearTick, dpr]);

  const handlePreset = (p: Preset) => {
    if (p.id === "fern") {
      setMode("fern");
      setN(0);
      setRestriction("none");
      // Initialise fern starting position
      posRef.current = { x: 0, y: 0 };
    } else {
      setMode("polygon");
      setN(p.n);
      setRestriction(p.restriction);
      setAutoMagic(p.ratio === null);
      if (p.ratio !== null) setRatio(p.ratio);
      else setRatio(parseFloat(magicRatio(p.n).toFixed(4)));
    }
    setClearTick((t) => t + 1);
  };

  const handleNChange = (nv: number) => {
    setMode("polygon");
    setN(nv);
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {mode === "fern"
                ? "Barnsley fern · 4-map IFS"
                : `Chaos game · n = ${n} · r = ${ratio.toFixed(4)} · ${restrictionLabel(restriction)}`}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              p ← p + r · (vᵢ − p)
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {totalPoints.toLocaleString()} points
            </div>
            <button
              onClick={() => setClearTick((t) => t + 1)}
              className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
            >
              Clear
            </button>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
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
                  onClick={() => handlePreset(p)}
                  className="hairline rounded-md border px-3 py-2 text-left text-ink-200 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
                >
                  <div className="font-mono text-xs">{p.label}</div>
                  {p.note ? (
                    <div className="mt-0.5 font-mono text-[10px] text-ink-400">{p.note}</div>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Vertices n
              </div>
              <div className="font-mono text-sm text-signal-cyan">
                {mode === "fern" ? "fern" : n}
              </div>
            </div>
            <input
              type="range"
              value={mode === "fern" ? 3 : n}
              min={3}
              max={8}
              step={1}
              disabled={mode === "fern"}
              onChange={(e) => handleNChange(parseInt(e.target.value))}
              className="w-full accent-signal-cyan disabled:opacity-40"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Jump ratio r
              </div>
              <div className="font-mono text-sm text-signal-amber">{ratio.toFixed(4)}</div>
            </div>
            <input
              type="range"
              value={ratio}
              min={0.1}
              max={0.9}
              step={0.001}
              disabled={mode === "fern"}
              onChange={(e) => {
                setAutoMagic(false);
                setRatio(parseFloat(e.target.value));
              }}
              className="w-full accent-signal-amber disabled:opacity-40"
            />
            <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-ink-300">
              <input
                type="checkbox"
                checked={autoMagic}
                disabled={mode === "fern"}
                onChange={(e) => setAutoMagic(e.target.checked)}
                className="accent-signal-cyan"
              />
              <span>Auto magic ratio · 1 / (1 + 2·cos(π/n))</span>
            </label>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Restriction
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "none" as const, label: "None" },
                { id: "norepeat" as const, label: "No repeat" },
                { id: "noneighbour" as const, label: "No neighbour" },
                { id: "noopposite" as const, label: "No opposite" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setMode("polygon");
                    setRestriction(r.id);
                  }}
                  disabled={mode === "fern"}
                  className={`rounded-md border px-3 py-2 text-left transition-colors disabled:opacity-40 ${
                    restriction === r.id && mode !== "fern"
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-signal-cyan"
                  }`}
                >
                  <div className="font-mono text-xs">{r.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Speed · points/frame
              </div>
              <div className="font-mono text-sm text-signal-amber">{speed.toLocaleString()}</div>
            </div>
            <input
              type="range"
              value={speed}
              min={100}
              max={50000}
              step={100}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Dot colour
            </div>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorId(c.id)}
                  aria-label={c.label}
                  className={`h-8 w-8 rounded-md border transition-transform ${c.css} ${
                    colorId === c.id ? "scale-110 border-ink-100" : "border-ink-700 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

// --- helpers ---

function polygonLayout(n: number, W: number, H: number): { vx: number[]; vy: number[] } {
  const margin = 24;
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) / 2 - margin;
  const vx: number[] = [];
  const vy: number[] = [];
  for (let i = 0; i < n; i++) {
    const theta = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    vx.push(cx + R * Math.cos(theta));
    vy.push(cy + R * Math.sin(theta));
  }
  return { vx, vy };
}

function isForbidden(
  pick: number,
  history: number[],
  n: number,
  restriction: Restriction,
): boolean {
  if (restriction === "none" || history.length === 0) return false;
  const last = history[0];
  if (restriction === "norepeat") {
    return pick === last;
  }
  if (restriction === "noneighbour") {
    const diff = (((pick - last) % n) + n) % n;
    return diff === 1 || diff === n - 1;
  }
  if (restriction === "noopposite") {
    if (n % 2 === 0) {
      return pick === (last + n / 2) % n;
    }
    // odd n: forbid the two "almost-opposite" vertices
    const half = (n - 1) / 2;
    return pick === (last + half) % n || pick === (last + half + 1) % n;
  }
  return false;
}

function restrictionLabel(r: Restriction): string {
  switch (r) {
    case "none":
      return "no restriction";
    case "norepeat":
      return "no repeat";
    case "noneighbour":
      return "no neighbour";
    case "noopposite":
      return "no opposite";
  }
}
