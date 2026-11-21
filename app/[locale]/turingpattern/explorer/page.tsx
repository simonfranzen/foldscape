"use client";

import Link from "@/components/LocaleLink";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { ExplorerGuideSection, ExplorerHelpButton } from "@/components/ExplorerGuide";
import { TURINGPATTERN_GUIDE } from "@/lib/explorer-guides/turingpattern";

const N = 200;
const SIZE = N * N;

type PresetId = "spots" | "mitosis" | "maze" | "worms" | "holes" | "solitons" | "coral";

interface Preset {
  id: PresetId;
  F: number;
  k: number;
}

// Every pair here was run through this exact integrator (D_a = 0.16,
// D_b = 0.08, dt = 1) from both seed modes and checked to grow the pattern it
// is named after. Two classic pairs did not make it: F = 0.078 / k = 0.061
// dies from any soft seed at these diffusion rates, and the U-skate point
// F = 0.062 / k = 0.0609 only ever gives a perforated sheet, never gliders,
// so they are replaced by a faster worm regime and by an honestly named
// "holes" regime. Spots and Mitosis must keep agreeing with the story gallery.
const PRESETS: Preset[] = [
  { id: "spots", F: 0.025, k: 0.06 },
  { id: "mitosis", F: 0.0367, k: 0.0649 },
  { id: "maze", F: 0.029, k: 0.057 },
  { id: "worms", F: 0.046, k: 0.065 },
  { id: "holes", F: 0.039, k: 0.058 },
  { id: "solitons", F: 0.03, k: 0.062 },
  { id: "coral", F: 0.0545, k: 0.0625 },
];

// A preset click glides F and k to the new pair over this many simulation
// steps. Jumping in one step makes dense patterns (maze, holes, coral)
// overshoot in unison and die out everywhere before they can reorganise.
const RAMP_STEPS = 1500;

// Batch size of the single still frame computed under reduced motion; enough
// for every preset to be recognisable from either seed mode.
const STILL_STEPS = 6000;
const STILL_CHUNK = 500;

type ColorMap = "cyan" | "violet" | "amber" | "rose";

const COLOR_MAPS: ColorMap[] = ["cyan", "violet", "amber", "rose"];

// ─── Localized UI strings ────────────────────────────────────────────────────
// Per repo convention the explorer carries its own RICH_EXPLORER. Only EN and
// DE are filled in; the other locales fall back to EN.

interface ExplorerStrings {
  gridInfo: string;
  canvasAria: string;
  paused: string;
  stepsPerFrame: string;
  presetLabel: string;
  presets: Record<PresetId, { name: string; desc: string }>;
  presetHint: string;
  feedLabel: string;
  feedAria: string;
  killLabel: string;
  killAria: string;
  daLabel: string;
  daAria: string;
  dbLabel: string;
  dbAria: string;
  seedLabel: string;
  resetRandom: string;
  resetCentered: string;
  speedLabel: string;
  speedAria: string;
  stepsUnit: string;
  play: string;
  pause: string;
  colourMapLabel: string;
  colours: Record<ColorMap, string>;
}

const RICH_EXPLORER: { en: ExplorerStrings } & Partial<Record<Locale, ExplorerStrings>> = {
  en: {
    gridInfo: `Gray-Scott · ${N}×${N} grid · toroidal`,
    canvasAria: "Live Gray-Scott reaction-diffusion simulation",
    paused: "paused",
    stepsPerFrame: "steps/frame",
    presetLabel: "Pattern preset",
    presets: {
      spots: { name: "Spots", desc: "Discrete round dots, like a leopard." },
      mitosis: { name: "Mitosis", desc: "Dots split, replicate, fill the plane." },
      maze: { name: "Maze", desc: "One connected, winding labyrinth." },
      worms: { name: "Worms", desc: "Curling stripe segments with loose ends." },
      holes: { name: "Holes", desc: "A filled sheet punctured by dark dots." },
      solitons: { name: "Solitons", desc: "Self-contained spots that settle into a grid." },
      coral: { name: "Coral", desc: "Branching, growing structures." },
    },
    presetHint: `A preset glides F and k to its values over ${RAMP_STEPS} steps, so the current pattern can morph instead of collapsing.`,
    feedLabel: "F · feed rate",
    feedAria: "F, feed rate",
    killLabel: "k · kill rate",
    killAria: "k, kill rate",
    daLabel: "D_a · substrate (inhibitor) diffusion",
    daAria: "D_a, substrate (inhibitor) diffusion rate",
    dbLabel: "D_b · activator diffusion",
    dbAria: "D_b, activator diffusion rate",
    seedLabel: "Initial seed",
    resetRandom: "Reset random",
    resetCentered: "Reset centered",
    speedLabel: "Speed · sim steps / frame",
    speedAria: "Simulation speed, steps per frame",
    stepsUnit: "steps",
    play: "Play",
    pause: "Pause",
    colourMapLabel: "Colour map",
    colours: { cyan: "Cyan", violet: "Violet", amber: "Amber", rose: "Rose" },
  },
  de: {
    gridInfo: `Gray-Scott · Gitter ${N}×${N} · Torus`,
    canvasAria: "Laufende Gray-Scott-Simulation von Reaktion und Diffusion",
    paused: "pausiert",
    stepsPerFrame: "Schritte/Frame",
    presetLabel: "Muster-Voreinstellung",
    presets: {
      spots: { name: "Punkte", desc: "Einzelne runde Flecken, wie beim Leoparden." },
      mitosis: { name: "Mitose", desc: "Punkte teilen sich und füllen die Fläche." },
      maze: { name: "Labyrinth", desc: "Ein zusammenhängendes, gewundenes Labyrinth." },
      worms: { name: "Würmer", desc: "Gekrümmte Streifenstücke mit losen Enden." },
      holes: { name: "Löcher", desc: "Eine gefüllte Fläche mit dunklen Löchern." },
      solitons: { name: "Solitonen", desc: "Eigenständige Punkte, die sich zum Raster ordnen." },
      coral: { name: "Koralle", desc: "Verzweigte, wachsende Strukturen." },
    },
    presetHint: `Eine Voreinstellung führt F und k über ${RAMP_STEPS} Schritte zu ihren Werten, damit sich das aktuelle Muster umformt, statt zusammenzubrechen.`,
    feedLabel: "F · Zufuhrrate",
    feedAria: "F, Zufuhrrate",
    killLabel: "k · Abbaurate",
    killAria: "k, Abbaurate",
    daLabel: "D_a · Diffusion des Substrats (Hemmer)",
    daAria: "D_a, Diffusionsrate des Substrats (Hemmer)",
    dbLabel: "D_b · Diffusion des Aktivators",
    dbAria: "D_b, Diffusionsrate des Aktivators",
    seedLabel: "Startzustand",
    resetRandom: "Neustart zufällig",
    resetCentered: "Neustart mittig",
    speedLabel: "Tempo · Schritte pro Frame",
    speedAria: "Simulationstempo, Schritte pro Frame",
    stepsUnit: "Schritte",
    play: "Start",
    pause: "Pause",
    colourMapLabel: "Farbskala",
    colours: { cyan: "Cyan", violet: "Violett", amber: "Bernstein", rose: "Rosa" },
  },
};

function buildLUT(map: ColorMap): Uint8ClampedArray {
  // 256-entry RGB LUT: interpolates background (low b) to highlight (high b).
  const lut = new Uint8ClampedArray(256 * 3);
  // Stops: (r, g, b)
  let bg: [number, number, number];
  let mid: [number, number, number];
  let hi: [number, number, number];
  switch (map) {
    case "cyan":
      bg = [6, 7, 13];
      mid = [11, 64, 92];
      hi = [125, 243, 255];
      break;
    case "violet":
      bg = [10, 6, 20];
      mid = [60, 30, 110];
      hi = [188, 140, 255];
      break;
    case "amber":
      bg = [12, 8, 4];
      mid = [110, 55, 12];
      hi = [255, 209, 102];
      break;
    case "rose":
      bg = [14, 6, 12];
      mid = [120, 30, 70];
      hi = [255, 122, 182];
      break;
  }
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let r: number;
    let g: number;
    let b: number;
    if (t < 0.5) {
      const u = t / 0.5;
      r = bg[0] + (mid[0] - bg[0]) * u;
      g = bg[1] + (mid[1] - bg[1]) * u;
      b = bg[2] + (mid[2] - bg[2]) * u;
    } else {
      const u = (t - 0.5) / 0.5;
      r = mid[0] + (hi[0] - mid[0]) * u;
      g = mid[1] + (hi[1] - mid[1]) * u;
      b = mid[2] + (hi[2] - mid[2]) * u;
    }
    lut[i * 3] = r;
    lut[i * 3 + 1] = g;
    lut[i * 3 + 2] = b;
  }
  return lut;
}

// Soft seed values (a≈0.5, b≈0.25 with a sprinkle of noise) keep the
// explicit Euler step stable. A hard 0/1 step injects a 5-point
// Laplacian of magnitude ~4 and blows the integration up to NaN within
// a handful of iterations, which is why the canvas was painting black.
//
// Blotch radii stay at 5 cells or less on purpose: at these diffusion rates a
// soft disc of radius 6 or more is wider than one Gray-Scott spot, its core
// burns out before the rim can close into a spot, and under the Mitosis
// values the whole disc vanishes.
function paintBlotch(a: Float32Array, b: Float32Array, cx: number, cy: number, r: number): void {
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r) continue;
      const x = (cx + dx + N) % N;
      const y = (cy + dy + N) % N;
      const i = y * N + x;
      a[i] = 0.5 + (Math.random() - 0.5) * 0.1;
      b[i] = 0.25 + (Math.random() - 0.5) * 0.1;
    }
  }
}

function seedRandom(a: Float32Array, b: Float32Array): void {
  a.fill(1);
  b.fill(0);
  for (let p = 0; p < 20; p++) {
    const cx = Math.floor(Math.random() * N);
    const cy = Math.floor(Math.random() * N);
    paintBlotch(a, b, cx, cy, 3 + Math.floor(Math.random() * 3));
  }
}

function seedCentered(a: Float32Array, b: Float32Array): void {
  a.fill(1);
  b.fill(0);
  paintBlotch(a, b, N / 2, N / 2, 5);
}

export default function TuringPatternExplorer() {
  const { a: atlas, u, locale } = useI18n();
  const ex = RICH_EXPLORER[locale] ?? RICH_EXPLORER.en;
  const topic = atlas.topics.turingpattern;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [presetIdx, setPresetIdx] = useState(0);
  const [F, setF] = useState(PRESETS[0].F);
  const [k, setK] = useState(PRESETS[0].k);
  // Pearson 1993 canonical defaults: Da=0.16, Db=0.08 (Laplace amplifier
  // 4·Da·dt = 0.64 ≪ CFL = 1). Previous 1.0/0.5 was numerically unstable:
  // clamping kept it from NaN but pinned the field, so no real pattern formed.
  const [Da, setDa] = useState(0.16);
  const [Db, setDb] = useState(0.08);
  const [speed, setSpeed] = useState(8);
  const [colorMap, setColorMap] = useState<ColorMap>("cyan");
  const [paused, setPaused] = useState(false);
  const [resetTick, setResetTick] = useState(0);
  const [seedMode, setSeedMode] = useState<"random" | "centered">("random");
  const [reducedMotion, setReducedMotion] = useState(false);

  // Track the reduced-motion preference live so we can freeze / resume.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (): void => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Mutable simulation state, kept in refs so re-renders don't reset it.
  const aRef = useRef<Float32Array>(new Float32Array(SIZE));
  const bRef = useRef<Float32Array>(new Float32Array(SIZE));
  const aNextRef = useRef<Float32Array>(new Float32Array(SIZE));
  const bNextRef = useRef<Float32Array>(new Float32Array(SIZE));

  // Latest param values seen by the animation loop.
  const paramsRef = useRef({ F, k, Da, Db, speed, paused });
  paramsRef.current = { F, k, Da, Db, speed, paused };
  // F and k the integrator used in its latest step. They trail the slider
  // state only while a preset ramp is running.
  const effRef = useRef({ F, k });
  const rampRef = useRef<{ F0: number; k0: number; done: number } | null>(null);

  const lut = useMemo(() => buildLUT(colorMap), [colorMap]);
  const lutRef = useRef(lut);
  lutRef.current = lut;

  // (Re)seed whenever the reset button is pressed or mode changes.
  useEffect(() => {
    if (seedMode === "random") seedRandom(aRef.current, bRef.current);
    else seedCentered(aRef.current, bRef.current);
    aNextRef.current.set(aRef.current);
    bNextRef.current.set(bRef.current);
  }, [resetTick, seedMode]);

  // Animation / simulation loop. Respects prefers-reduced-motion: when reduce
  // is requested we settle the field with one fixed batch of steps and paint a
  // single static frame, then leave the rAF loop unscheduled. The batch is
  // split into chunks so the page stays responsive while it computes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = N;
    canvas.height = N;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = ctx.createImageData(N, N);
    const data = image.data;

    // One explicit-Euler sub-step over the whole grid, reading live params.
    const advance = (): void => {
      const p = paramsRef.current;
      let F = p.F;
      let k = p.k;
      const ramp = rampRef.current;
      if (ramp) {
        ramp.done++;
        const t = ramp.done / RAMP_STEPS;
        F = ramp.F0 + (p.F - ramp.F0) * t;
        k = ramp.k0 + (p.k - ramp.k0) * t;
        if (ramp.done >= RAMP_STEPS) rampRef.current = null;
      }
      effRef.current.F = F;
      effRef.current.k = k;
      const aCur = aRef.current;
      const bCur = bRef.current;
      const aNext = aNextRef.current;
      const bNext = bNextRef.current;
      // 5-point Laplacian with toroidal wrap.
      for (let y = 0; y < N; y++) {
        const yUp = y === 0 ? N - 1 : y - 1;
        const yDn = y === N - 1 ? 0 : y + 1;
        const row = y * N;
        const rowU = yUp * N;
        const rowD = yDn * N;
        for (let x = 0; x < N; x++) {
          const xL = x === 0 ? N - 1 : x - 1;
          const xR = x === N - 1 ? 0 : x + 1;
          const i = row + x;
          const aC = aCur[i];
          const bC = bCur[i];
          const lapA = aCur[row + xL] + aCur[row + xR] + aCur[rowU + x] + aCur[rowD + x] - 4 * aC;
          const lapB = bCur[row + xL] + bCur[row + xR] + bCur[rowU + x] + bCur[rowD + x] - 4 * bC;
          const abb = aC * bC * bC;
          // dt = 1 with Karl Sims style scaling. Hard-clamp keeps
          // the explicit Euler stable through sharp transients.
          let aN = aC + (p.Da * lapA - abb + F * (1 - aC));
          let bN = bC + (p.Db * lapB + abb - (F + k) * bC);
          if (aN < 0) aN = 0;
          else if (aN > 1) aN = 1;
          if (bN < 0) bN = 0;
          else if (bN > 1) bN = 1;
          aNext[i] = aN;
          bNext[i] = bN;
        }
      }
      // Swap.
      aRef.current = aNext;
      bRef.current = bNext;
      aNextRef.current = aCur;
      bNextRef.current = bCur;
    };

    const paint = (): void => {
      const b = bRef.current;
      const tbl = lutRef.current;
      for (let i = 0; i < SIZE; i++) {
        let v = b[i] * 3.5; // visual gain
        if (v < 0) v = 0;
        else if (v > 1) v = 1;
        const idx = (v * 255) | 0;
        const o = i * 4;
        const l = idx * 3;
        data[o] = tbl[l];
        data[o + 1] = tbl[l + 1];
        data[o + 2] = tbl[l + 2];
        data[o + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
    };

    if (reducedMotion) {
      let left = STILL_STEPS;
      let timer = 0;
      const batch = (): void => {
        const n = Math.min(STILL_CHUNK, left);
        for (let s = 0; s < n; s++) advance();
        left -= n;
        if (left > 0) timer = window.setTimeout(batch, 0);
        else paint();
      };
      batch();
      return () => window.clearTimeout(timer);
    }

    let raf = 0;
    const step = (): void => {
      const p = paramsRef.current;
      if (!p.paused) {
        const steps = Math.max(1, Math.floor(p.speed));
        for (let s = 0; s < steps; s++) advance();
      }
      paint();
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, resetTick, presetIdx, seedMode]);

  const applyPreset = (idx: number): void => {
    rampRef.current = { F0: effRef.current.F, k0: effRef.current.k, done: 0 };
    setPresetIdx(idx);
    setF(PRESETS[idx].F);
    setK(PRESETS[idx].k);
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {ex.gridInfo}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              ∂a/∂t = D_a∇²a − ab² + F(1−a)
            </div>
          </div>
          <div className="hairline relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={ex.canvasAria}
              className="block h-full w-full"
              style={{
                imageRendering: "pixelated",
                aspectRatio: "1 / 1",
                maxHeight: "100%",
                maxWidth: "100%",
              }}
            />
            <div className="pointer-events-none absolute right-3 top-3">
              <ExplorerHelpButton guide={TURINGPATTERN_GUIDE} />
            </div>
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            F = {F.toFixed(4)} · k = {k.toFixed(4)} · D_a = {Da.toFixed(2)} · D_b = {Db.toFixed(2)}{" "}
            · {paused ? ex.paused : `${speed} ${ex.stepsPerFrame}`}
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
              {ex.presetLabel}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(i)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    i === presetIdx
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">{ex.presets[p.id].name}</div>
                  <div className="mt-0.5 font-mono text-[10px] leading-snug text-ink-400">
                    {ex.presets[p.id].desc}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-ink-300">{ex.presetHint}</p>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {ex.feedLabel}
              </div>
              <div className="flex items-center justify-between font-mono text-sm">
                <span className="text-signal-cyan">{F.toFixed(4)}</span>
              </div>
              <input
                type="range"
                aria-label={ex.feedAria}
                value={F}
                min={0}
                max={0.1}
                step={0.0005}
                onChange={(e) => {
                  rampRef.current = null;
                  setF(parseFloat(e.target.value));
                }}
                className="w-full accent-signal-cyan"
              />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {ex.killLabel}
              </div>
              <div className="flex items-center justify-between font-mono text-sm">
                <span className="text-signal-cyan">{k.toFixed(4)}</span>
              </div>
              <input
                type="range"
                aria-label={ex.killAria}
                value={k}
                min={0}
                max={0.08}
                step={0.0005}
                onChange={(e) => {
                  rampRef.current = null;
                  setK(parseFloat(e.target.value));
                }}
                className="w-full accent-signal-cyan"
              />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {ex.daLabel}
              </div>
              <div className="flex items-center justify-between font-mono text-sm">
                <span className="text-signal-teal">{Da.toFixed(3)}</span>
              </div>
              <input
                type="range"
                aria-label={ex.daAria}
                value={Da}
                min={0.05}
                max={0.25}
                step={0.005}
                onChange={(e) => setDa(parseFloat(e.target.value))}
                className="w-full accent-signal-teal"
              />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {ex.dbLabel}
              </div>
              <div className="flex items-center justify-between font-mono text-sm">
                <span className="text-signal-teal">{Db.toFixed(3)}</span>
              </div>
              <input
                type="range"
                aria-label={ex.dbAria}
                value={Db}
                min={0.02}
                max={0.12}
                step={0.002}
                onChange={(e) => setDb(parseFloat(e.target.value))}
                className="w-full accent-signal-teal"
              />
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.seedLabel}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  rampRef.current = null;
                  setSeedMode("random");
                  setResetTick((t) => t + 1);
                }}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
              >
                {ex.resetRandom}
              </button>
              <button
                onClick={() => {
                  rampRef.current = null;
                  setSeedMode("centered");
                  setResetTick((t) => t + 1);
                }}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
              >
                {ex.resetCentered}
              </button>
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.speedLabel}
            </div>
            <input
              type="range"
              aria-label={ex.speedAria}
              value={speed}
              min={1}
              max={20}
              step={1}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full accent-signal-teal"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">
              {speed} {ex.stepsUnit}
            </div>
            <button
              onClick={() => setPaused((v) => !v)}
              className="hairline w-full rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
            >
              {paused ? ex.play : ex.pause}
            </button>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.colourMapLabel}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_MAPS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColorMap(c)}
                  className={`rounded-md border px-2 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    c === colorMap
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-ink-100"
                  }`}
                >
                  {ex.colours[c]}
                </button>
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
      <ExplorerGuideSection guide={TURINGPATTERN_GUIDE} storyHref="/turingpattern" />
    </main>
  );
}
