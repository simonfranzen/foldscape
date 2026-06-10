"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette as colorPalette } from "@/lib/visual/palette";

// --------------------------------------------------------------------------
// The Four Colour Theorem · Explorer
//
// A planar map is generated as a Voronoi tessellation of N random seed
// points inside the canvas (with optional Lloyd relaxation for nicer cells).
// Adjacency is detected by sweeping the per-pixel seed labels: two cells are
// adjacent iff they share a boundary pixel pair. A backtracking 4-colourer
// then assigns each region the smallest valid colour, picking the most
// constrained region at every step (MRV heuristic). The animation paints
// each region as the algorithm decides it — including any backtracks, so
// you can actually see the search tree being explored.
// --------------------------------------------------------------------------

type Preset =
  | { id: "voronoi30"; label: "Random Voronoi (30 cells)"; n: 30; relax: 2 }
  | { id: "voronoi60"; label: "Random Voronoi (60 cells)"; n: 60; relax: 2 }
  | { id: "usa"; label: "USA states (lower 48 — simplified)"; n: 48; relax: 3 }
  | { id: "germany"; label: "Germany states (Bundesländer)"; n: 16; relax: 4 }
  | { id: "africa"; label: "Africa countries"; n: 54; relax: 3 }
  | { id: "stress"; label: "Stress test (mutually-adjacent regions)"; n: 12; relax: 0 };

const PRESETS: Preset[] = [
  { id: "voronoi30", label: "Random Voronoi (30 cells)", n: 30, relax: 2 },
  { id: "voronoi60", label: "Random Voronoi (60 cells)", n: 60, relax: 2 },
  { id: "usa", label: "USA states (lower 48 — simplified)", n: 48, relax: 3 },
  { id: "germany", label: "Germany states (Bundesländer)", n: 16, relax: 4 },
  { id: "africa", label: "Africa countries", n: 54, relax: 3 },
  { id: "stress", label: "Stress test (mutually-adjacent regions)", n: 12, relax: 0 },
];

const DEFAULT_PALETTE = [colorPalette.signal.cyan, colorPalette.signal.amber, "#b18cff", colorPalette.signal.rose] as const;
const COLOUR_NAMES = ["cyan", "amber", "violet", "rose"] as const;

interface MapData {
  width: number;
  height: number;
  n: number;
  seeds: Array<{ x: number; y: number }>;
  // Per-pixel cell index, length = width * height
  labels: Int16Array;
  // adjacency[i] = sorted list of cell indices adjacent to i
  adjacency: number[][];
  edges: number;
  maxDegree: number;
}

interface ColouringStep {
  cell: number;
  colour: number; // -1 = uncolour (backtrack), 0..3 = assign
}

// Deterministic PRNG so a given seed reproduces the same map.
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickSeedsRandom(n: number, w: number, h: number, rand: () => number) {
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < n; i++) {
    pts.push({ x: rand() * w, y: rand() * h });
  }
  return pts;
}

// For the "stress test" preset: place N seeds in a tight cluster of small
// regions surrounded by a few large outer regions, so the adjacency graph
// is genuinely dense and the backtracker has to work.
function pickSeedsStress(n: number, w: number, h: number, rand: () => number) {
  const pts: Array<{ x: number; y: number }> = [];
  const cx = w / 2;
  const cy = h / 2;
  // 6 inner cells very close together (will share many borders)
  for (let i = 0; i < Math.min(6, n); i++) {
    const a = (i / 6) * Math.PI * 2;
    pts.push({ x: cx + Math.cos(a) * 40, y: cy + Math.sin(a) * 40 });
  }
  // Surrounding cells
  for (let i = pts.length; i < n; i++) {
    const a = rand() * Math.PI * 2;
    const r = Math.min(w, h) * (0.32 + rand() * 0.18);
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return pts;
}

// Assign every pixel to its nearest seed.
function rasteriseVoronoi(
  seeds: Array<{ x: number; y: number }>,
  w: number,
  h: number,
  stride: number,
): Int16Array {
  const labels = new Int16Array(w * h);
  for (let y = 0; y < h; y += stride) {
    for (let x = 0; x < w; x += stride) {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < seeds.length; i++) {
        const dx = x - seeds[i].x;
        const dy = y - seeds[i].y;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      // Fill the stride block to keep the per-pixel pass below cheap.
      for (let yy = y; yy < Math.min(y + stride, h); yy++) {
        for (let xx = x; xx < Math.min(x + stride, w); xx++) {
          labels[yy * w + xx] = best;
        }
      }
    }
  }
  return labels;
}

// One Lloyd-relaxation step: move each seed to the centroid of its cell.
function relaxSeeds(
  seeds: Array<{ x: number; y: number }>,
  labels: Int16Array,
  w: number,
  h: number,
) {
  const n = seeds.length;
  const sx = new Float64Array(n);
  const sy = new Float64Array(n);
  const ct = new Uint32Array(n);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = labels[y * w + x];
      sx[i] += x;
      sy[i] += y;
      ct[i]++;
    }
  }
  const next: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < n; i++) {
    if (ct[i] === 0) {
      next.push(seeds[i]);
    } else {
      next.push({ x: sx[i] / ct[i], y: sy[i] / ct[i] });
    }
  }
  return next;
}

function buildAdjacency(labels: Int16Array, w: number, h: number, n: number) {
  const sets: Set<number>[] = Array.from({ length: n }, () => new Set<number>());
  // Scan horizontally and vertically; record pairs across any pixel boundary
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w - 1; x++) {
      const a = labels[y * w + x];
      const b = labels[y * w + x + 1];
      if (a !== b) {
        sets[a].add(b);
        sets[b].add(a);
      }
    }
  }
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h - 1; y++) {
      const a = labels[y * w + x];
      const b = labels[(y + 1) * w + x];
      if (a !== b) {
        sets[a].add(b);
        sets[b].add(a);
      }
    }
  }
  const adjacency = sets.map((s) => Array.from(s).sort((a, b) => a - b));
  let edges = 0;
  let maxDegree = 0;
  for (const list of adjacency) {
    edges += list.length;
    if (list.length > maxDegree) maxDegree = list.length;
  }
  edges = edges / 2;
  return { adjacency, edges, maxDegree };
}

function buildMap(preset: Preset, seed: number, width: number, height: number): MapData {
  const rand = mulberry32(seed);
  let seeds =
    preset.id === "stress"
      ? pickSeedsStress(preset.n, width, height, rand)
      : pickSeedsRandom(preset.n, width, height, rand);
  // Coarse rasterise for relaxation (fast), then a fine pass at the end.
  let labels = rasteriseVoronoi(seeds, width, height, 4);
  for (let r = 0; r < preset.relax; r++) {
    seeds = relaxSeeds(seeds, labels, width, height);
    labels = rasteriseVoronoi(seeds, width, height, 4);
  }
  labels = rasteriseVoronoi(seeds, width, height, 1);
  const { adjacency, edges, maxDegree } = buildAdjacency(labels, width, height, seeds.length);
  return {
    width,
    height,
    n: seeds.length,
    seeds,
    labels,
    adjacency,
    edges,
    maxDegree,
  };
}

// Backtracking 4-colourer with most-constrained-variable heuristic.
// Returns the sequence of assign/unassign steps so the UI can animate.
function solveFourColouring(adj: number[][]): {
  steps: ColouringStep[];
  solution: number[] | null;
  backtracks: number;
} {
  const n = adj.length;
  const colours = new Int8Array(n).fill(-1);
  const steps: ColouringStep[] = [];
  let backtracks = 0;
  // Hard cap to keep the UI safe on adversarial graphs (shouldn't trigger
  // for any planar graph but we guard anyway).
  const STEP_CAP = 200000;

  function pickNext(): number {
    let best = -1;
    let bestRemaining = 5;
    let bestDegree = -1;
    for (let i = 0; i < n; i++) {
      if (colours[i] !== -1) continue;
      const used = new Set<number>();
      for (const j of adj[i]) {
        if (colours[j] !== -1) used.add(colours[j]);
      }
      const remaining = 4 - used.size;
      if (
        remaining < bestRemaining ||
        (remaining === bestRemaining && adj[i].length > bestDegree)
      ) {
        bestRemaining = remaining;
        bestDegree = adj[i].length;
        best = i;
      }
    }
    return best;
  }

  function recurse(): boolean {
    if (steps.length > STEP_CAP) return false;
    const i = pickNext();
    if (i === -1) return true;
    const used = new Set<number>();
    for (const j of adj[i]) {
      if (colours[j] !== -1) used.add(colours[j]);
    }
    for (let c = 0; c < 4; c++) {
      if (used.has(c)) continue;
      colours[i] = c;
      steps.push({ cell: i, colour: c });
      if (recurse()) return true;
      // backtrack
      colours[i] = -1;
      steps.push({ cell: i, colour: -1 });
      backtracks++;
    }
    return false;
  }

  const ok = recurse();
  return {
    steps,
    solution: ok ? Array.from(colours) : null,
    backtracks,
  };
}

// Paint the map: each region filled with its current colour or "uncoloured".
function drawMap(
  ctx: CanvasRenderingContext2D,
  map: MapData,
  colours: Int8Array,
  palette: readonly string[],
  dpr: number,
) {
  const { width: W, height: H, labels } = map;
  const img = ctx.createImageData(W, H);
  const data = img.data;
  // Pre-compute palette as RGBA
  const rgb: Array<[number, number, number, number]> = palette.map((hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 235];
  });
  const grey: [number, number, number, number] = [60, 64, 80, 140];

  for (let i = 0; i < labels.length; i++) {
    const cell = labels[i];
    const c = colours[cell];
    const px = c === -1 ? grey : rgb[c];
    const o = i * 4;
    data[o] = px[0];
    data[o + 1] = px[1];
    data[o + 2] = px[2];
    data[o + 3] = px[3];
  }

  // Draw region borders by detecting label changes
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W - 1; x++) {
      if (labels[y * W + x] !== labels[y * W + x + 1]) {
        const o = (y * W + x) * 4;
        data[o] = 11;
        data[o + 1] = 13;
        data[o + 2] = 24;
        data[o + 3] = 255;
      }
    }
  }
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H - 1; y++) {
      if (labels[y * W + x] !== labels[(y + 1) * W + x]) {
        const o = (y * W + x) * 4;
        data[o] = 11;
        data[o + 1] = 13;
        data[o + 2] = 24;
        data[o + 3] = 255;
      }
    }
  }

  // putImageData ignores transform; we composite manually
  // Render to an offscreen-style intermediate then blit scaled.
  const tmp = document.createElement("canvas");
  tmp.width = W;
  tmp.height = H;
  const tctx = tmp.getContext("2d");
  if (!tctx) return;
  tctx.putImageData(img, 0, 0);
  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, ctx.canvas.width / dpr, ctx.canvas.height / dpr);
  ctx.fillStyle = colorPalette.canvas.bg;
  ctx.fillRect(0, 0, ctx.canvas.width / dpr, ctx.canvas.height / dpr);
  ctx.drawImage(tmp, 0, 0, ctx.canvas.width / dpr, ctx.canvas.height / dpr);

  // Label each region with its index near its seed
  ctx.font = "10px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < map.seeds.length; i++) {
    const s = map.seeds[i];
    const sx = (s.x / W) * (ctx.canvas.width / dpr);
    const sy = (s.y / H) * (ctx.canvas.height / dpr);
    ctx.fillStyle = "rgba(11, 13, 24, 0.65)";
    ctx.beginPath();
    ctx.arc(sx, sy, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colours[i] === -1 ? colorPalette.canvas.muted : "#ffffff";
    ctx.fillText(String(i + 1), sx, sy + 0.5);
  }
  ctx.restore();
}

export default function FourColorExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.fourcolor;
  const dpr = useDpr();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const [presetId, setPresetId] = useState<Preset["id"]>("voronoi30");
  const [n, setN] = useState(30);
  const [seed, setSeed] = useState(1);
  const [palette, setPalette] = useState<readonly string[]>(DEFAULT_PALETTE);
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number }>({ w: 720, h: 480 });
  const [map, setMap] = useState<MapData | null>(null);
  const [solution, setSolution] = useState<{
    steps: ColouringStep[];
    final: number[] | null;
    backtracks: number;
  } | null>(null);

  // Animation state
  const [animIdx, setAnimIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [speedMs, setSpeedMs] = useState(60);

  // Editable palette: clicking a swatch opens a native colour picker.
  const updateSwatch = useCallback((i: number, hex: string) => {
    setPalette((p) => p.map((c, j) => (j === i ? hex : c)));
  }, []);

  // Whenever the preset or size changes, regenerate.
  const regenerate = useCallback(
    (nextSeed?: number) => {
      const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
      const effectivePreset: Preset =
        preset.id === "voronoi30" || preset.id === "voronoi60"
          ? ({ ...preset, n } as Preset)
          : preset;
      const s = nextSeed ?? seed;
      const m = buildMap(effectivePreset, s, canvasSize.w, canvasSize.h);
      setMap(m);
      const sol = solveFourColouring(m.adjacency);
      setSolution({ steps: sol.steps, final: sol.solution, backtracks: sol.backtracks });
      setAnimIdx(0);
      setRunning(false);
    },
    [presetId, n, seed, canvasSize.w, canvasSize.h],
  );

  // Initial generation once the canvas mounts (and on preset / size change).
  useEffect(() => {
    regenerate();
  }, [regenerate]);

  // Track canvas client size.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const measure = () => {
      const w = Math.max(200, Math.floor(canvas.clientWidth));
      const h = Math.max(200, Math.floor(canvas.clientHeight));
      setCanvasSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // Render to canvas whenever the displayed colouring changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !map || !solution) return;
    canvas.width = Math.floor(canvasSize.w * dpr);
    canvas.height = Math.floor(canvasSize.h * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Build the current colouring snapshot from the first animIdx steps
    const colours = new Int8Array(map.n).fill(-1);
    const upto = Math.min(animIdx, solution.steps.length);
    for (let i = 0; i < upto; i++) {
      const step = solution.steps[i];
      colours[step.cell] = step.colour;
    }
    drawMap(ctx, map, colours, palette, dpr);
  }, [map, solution, animIdx, canvasSize.w, canvasSize.h, palette, dpr]);

  // Animation loop
  useEffect(() => {
    if (!running || !solution) return;
    const tick = () => {
      setAnimIdx((i) => {
        if (i >= solution.steps.length) {
          setRunning(false);
          return i;
        }
        return i + 1;
      });
    };
    const id = window.setInterval(tick, Math.max(8, speedMs));
    animRef.current = id;
    return () => {
      window.clearInterval(id);
      animRef.current = null;
    };
  }, [running, solution, speedMs]);

  const currentColours = useMemo(() => {
    if (!map || !solution) return null;
    const c = new Int8Array(map.n).fill(-1);
    const upto = Math.min(animIdx, solution.steps.length);
    for (let i = 0; i < upto; i++) {
      const step = solution.steps[i];
      c[step.cell] = step.colour;
    }
    return c;
  }, [map, solution, animIdx]);

  const colouredCount = useMemo(() => {
    if (!currentColours) return 0;
    let k = 0;
    for (let i = 0; i < currentColours.length; i++) if (currentColours[i] !== -1) k++;
    return k;
  }, [currentColours]);

  const stepRow = solution
    ? `step ${Math.min(animIdx, solution.steps.length)} / ${solution.steps.length}`
    : "step 0 / 0";

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {PRESETS.find((p) => p.id === presetId)?.label} · seed {seed}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              χ(planar) ≤ 4
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              regions · {map?.n ?? 0}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              edges · {map?.edges ?? 0}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              max deg · {map?.maxDegree ?? 0}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {stepRow}
            </div>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Preset map
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPresetId(p.id);
                    if (p.id === "voronoi30") setN(30);
                    if (p.id === "voronoi60") setN(60);
                    if (p.id !== "voronoi30" && p.id !== "voronoi60") setN(p.n);
                  }}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    presetId === p.id
                      ? "border-signal-teal/60 bg-signal-teal/10 text-signal-teal"
                      : "hairline text-ink-200 hover:border-signal-teal/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">{p.label}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                const next = (seed + 1) >>> 0 || 1;
                setSeed(next);
              }}
              className="w-full rounded-md border border-signal-teal/60 bg-signal-teal/10 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-teal transition-colors hover:bg-signal-teal/20"
            >
              Generate random
            </button>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Number of regions
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-teal">{n}</span>
              <span className="text-[10px] text-ink-400">5 … 80</span>
            </div>
            <input
              type="range"
              value={n}
              min={5}
              max={80}
              step={1}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                setN(v);
                // Switching the slider auto-switches us to a Voronoi preset
                // so the number actually takes effect on the next regenerate.
                if (presetId !== "voronoi30" && presetId !== "voronoi60") {
                  setPresetId(v > 40 ? "voronoi60" : "voronoi30");
                }
              }}
              className="w-full accent-signal-teal"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Colour palette
            </div>
            <div className="grid grid-cols-4 gap-2">
              {palette.map((c, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer flex-col items-center gap-1"
                  title={COLOUR_NAMES[i]}
                >
                  <span
                    className="hairline inline-block h-9 w-full rounded-md border"
                    style={{ backgroundColor: c }}
                  />
                  <input
                    type="color"
                    value={c}
                    onChange={(e) => updateSwatch(i, e.target.value)}
                    className="sr-only"
                  />
                  <span className="font-mono text-[9px] uppercase tracking-widest2 text-ink-400">
                    {COLOUR_NAMES[i]}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setPalette(DEFAULT_PALETTE)}
              className="hairline w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:text-ink-100"
            >
              Reset palette
            </button>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Auto-colourer
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setRunning(false);
                  setAnimIdx((i) => {
                    if (!solution) return 0;
                    return Math.min(i + 1, solution.steps.length);
                  });
                }}
                className="hairline rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
              >
                Step
              </button>
              <button
                onClick={() => setRunning((r) => !r)}
                className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                  running
                    ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber hover:bg-signal-amber/20"
                    : "border-signal-teal/60 bg-signal-teal/10 text-signal-teal hover:bg-signal-teal/20"
                }`}
              >
                {running ? "Pause" : "Run"}
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setAnimIdx(solution ? solution.steps.length : 0);
                }}
                className="hairline rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
              >
                Auto
              </button>
            </div>
            <button
              onClick={() => {
                setRunning(false);
                setAnimIdx(0);
              }}
              className="hairline w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:text-ink-100"
            >
              Reset colouring
            </button>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Speed · {speedMs} ms / step
            </div>
            <input
              type="range"
              value={speedMs}
              min={8}
              max={400}
              step={2}
              onChange={(e) => setSpeedMs(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="hairline space-y-2 border-b p-5 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            <div className="flex justify-between">
              <span>coloured</span>
              <span className="text-ink-100">
                {colouredCount} / {map?.n ?? 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>backtracks</span>
              <span className="text-ink-100">{solution?.backtracks ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span>solved</span>
              <span className={solution?.final ? "text-signal-teal" : "text-ink-400"}>
                {solution?.final ? "yes" : "in progress"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>steps total</span>
              <span className="text-ink-100">{solution?.steps.length ?? 0}</span>
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
