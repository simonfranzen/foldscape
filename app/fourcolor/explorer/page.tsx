"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette as colorPalette } from "@/lib/visual/palette";
import { ExplorerGuideSection, ExplorerHelpButton } from "@/components/ExplorerGuide";
import { FOURCOLOR_GUIDE } from "@/lib/explorer-guides/fourcolor";
import {
  PRESETS,
  buildMap,
  solveFourColouring,
  type ColouringStep,
  type MapData,
  type Preset,
  type PresetId,
} from "@/lib/fourcolor/map";

// --------------------------------------------------------------------------
// The Four Colour Theorem · Explorer
//
// A planar map is generated as a Voronoi tessellation of N random seed
// points inside the canvas (with optional Lloyd relaxation for nicer cells).
// Adjacency is detected by sweeping the per-pixel seed labels: two cells are
// adjacent iff they share a stretch of border (a corner contact does not
// count). A backtracking 4-colourer then assigns each region the smallest
// valid colour, picking the most constrained region at every step (MRV
// heuristic). The animation paints each region as the algorithm decides it,
// including any backtracks, so you can actually see the search tree being
// explored. The map and solver code lives in lib/fourcolor/map.ts.
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
// Per-locale UI strings. EN and DE are filled in; the other locales fall back
// to EN at the call site until they are translated.
// --------------------------------------------------------------------------

type RichExplorer = {
  presets: Record<PresetId, string>;
  seed: string;
  regions: string;
  edges: string;
  maxDeg: string;
  stepCounter: string;
  presetMap: string;
  generate: string;
  numRegions: string;
  palette: string;
  colourNames: readonly [string, string, string, string];
  resetPalette: string;
  autoColourer: string;
  step: string;
  run: string;
  pause: string;
  auto: string;
  resetColouring: string;
  speed: string;
  msPerStep: string;
  coloured: string;
  backtracks: string;
  solved: string;
  yes: string;
  stepLimit: string;
  stepsTotal: string;
};

const RICH_EXPLORER: { en: RichExplorer } & Partial<Record<Locale, RichExplorer>> = {
  en: {
    presets: {
      voronoi30: "Random Voronoi (30 cells)",
      voronoi60: "Random Voronoi (60 cells)",
      count48: "48 regions (as many as contiguous US states)",
      count16: "16 regions (as many as German states)",
      count54: "54 regions (as many as UN member states in Africa)",
      stress: "Stress test (12 regions, dense cluster)",
    },
    seed: "seed",
    regions: "regions",
    edges: "edges",
    maxDeg: "max deg",
    stepCounter: "step",
    presetMap: "Preset map",
    generate: "Generate random",
    numRegions: "Number of regions",
    palette: "Colour palette",
    colourNames: ["cyan", "amber", "violet", "rose"],
    resetPalette: "Reset palette",
    autoColourer: "Auto-colourer",
    step: "Step",
    run: "Run",
    pause: "Pause",
    auto: "Auto",
    resetColouring: "Reset colouring",
    speed: "Speed",
    msPerStep: "ms / step",
    coloured: "coloured",
    backtracks: "backtracks",
    solved: "solved",
    yes: "yes",
    stepLimit: "step limit reached",
    stepsTotal: "steps total",
  },
  de: {
    presets: {
      voronoi30: "Zufälliges Voronoi (30 Zellen)",
      voronoi60: "Zufälliges Voronoi (60 Zellen)",
      count48: "48 Regionen (so viele wie US-Staaten ohne Alaska und Hawaii)",
      count16: "16 Regionen (so viele wie deutsche Bundesländer)",
      count54: "54 Regionen (so viele wie UN-Mitgliedstaaten in Afrika)",
      stress: "Stresstest (12 Regionen, dichtes Knäuel)",
    },
    seed: "Seed",
    regions: "Regionen",
    edges: "Kanten",
    maxDeg: "max. Grad",
    stepCounter: "Schritt",
    presetMap: "Kartenvorlage",
    generate: "Neue Zufallskarte",
    numRegions: "Anzahl Regionen",
    palette: "Farbpalette",
    colourNames: ["Cyan", "Bernstein", "Violett", "Rosa"],
    resetPalette: "Palette zurücksetzen",
    autoColourer: "Auto-Färber",
    step: "Schritt",
    run: "Start",
    pause: "Pause",
    auto: "Auto",
    resetColouring: "Färbung zurücksetzen",
    speed: "Tempo",
    msPerStep: "ms / Schritt",
    coloured: "gefärbt",
    backtracks: "Rücknahmen",
    solved: "gelöst",
    yes: "ja",
    stepLimit: "Schrittlimit erreicht",
    stepsTotal: "Schritte gesamt",
  },
};

const DEFAULT_PALETTE = [
  colorPalette.signal.cyan,
  colorPalette.signal.amber,
  "#b18cff",
  colorPalette.signal.rose,
] as const;

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
  const { a, u, locale } = useI18n();
  const tx = RICH_EXPLORER[locale] ?? RICH_EXPLORER.en;
  const topic = a.topics.fourcolor;
  const dpr = useDpr();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const [presetId, setPresetId] = useState<PresetId>("voronoi30");
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
        preset.id === "voronoi30" || preset.id === "voronoi60" ? { ...preset, n } : preset;
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
    ? `${tx.stepCounter} ${Math.min(animIdx, solution.steps.length)} / ${solution.steps.length}`
    : `${tx.stepCounter} 0 / 0`;

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {tx.presets[presetId]} · {tx.seed} {seed}
            </div>
            <div className="flex items-center gap-2">
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
                χ(planar) ≤ 4
              </div>
              <ExplorerHelpButton guide={FOURCOLOR_GUIDE} />
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {tx.regions} · {map?.n ?? 0}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {tx.edges} · {map?.edges ?? 0}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {tx.maxDeg} · {map?.maxDegree ?? 0}
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
              {tx.presetMap}
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
                  <div className="font-mono text-xs">{tx.presets[p.id]}</div>
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
              {tx.generate}
            </button>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tx.numRegions}
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
              {tx.palette}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {palette.map((c, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer flex-col items-center gap-1"
                  title={tx.colourNames[i]}
                >
                  <span
                    className="hairline inline-block h-9 w-full rounded-md border"
                    style={{ backgroundColor: c }}
                  />
                  <input
                    type="color"
                    value={c}
                    onChange={(e) => updateSwatch(i, e.target.value)}
                    aria-label={tx.colourNames[i]}
                    className="sr-only"
                  />
                  <span className="font-mono text-[9px] uppercase tracking-widest2 text-ink-400">
                    {tx.colourNames[i]}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setPalette(DEFAULT_PALETTE)}
              className="hairline w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:text-ink-100"
            >
              {tx.resetPalette}
            </button>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tx.autoColourer}
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
                {tx.step}
              </button>
              <button
                onClick={() => setRunning((r) => !r)}
                className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                  running
                    ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber hover:bg-signal-amber/20"
                    : "border-signal-teal/60 bg-signal-teal/10 text-signal-teal hover:bg-signal-teal/20"
                }`}
              >
                {running ? tx.pause : tx.run}
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setAnimIdx(solution ? solution.steps.length : 0);
                }}
                className="hairline rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
              >
                {tx.auto}
              </button>
            </div>
            <button
              onClick={() => {
                setRunning(false);
                setAnimIdx(0);
              }}
              className="hairline w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:text-ink-100"
            >
              {tx.resetColouring}
            </button>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tx.speed} · {speedMs} {tx.msPerStep}
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
              <span>{tx.coloured}</span>
              <span className="text-ink-100">
                {colouredCount} / {map?.n ?? 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{tx.backtracks}</span>
              <span className="text-ink-100">{solution?.backtracks ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span>{tx.solved}</span>
              <span className={solution?.final ? "text-signal-teal" : "text-ink-400"}>
                {solution?.final ? tx.yes : solution ? tx.stepLimit : "…"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{tx.stepsTotal}</span>
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
      <ExplorerGuideSection guide={FOURCOLOR_GUIDE} storyHref="/fourcolor" />
    </main>
  );
}
