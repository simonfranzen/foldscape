"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

const GRID = 200;
const STATES = 100; // n — number of cell states (0 = healthy, STATES-1 = ill)
const ILL = STATES - 1;

type ColourMap = "rose" | "violet" | "amber" | "cyan";

interface Preset {
  label: string;
  k1: number;
  k2: number;
  g: number;
}

const PRESETS: Preset[] = [
  { label: "Classic spirals", k1: 3, k2: 3, g: 28 },
  { label: "Tight scrolls", k1: 2, k2: 3, g: 22 },
  { label: "Slow targets", k1: 3, k2: 3, g: 12 },
  { label: "Turbulent", k1: 2, k2: 2, g: 40 },
];

// Build a 256-entry RGBA lookup table for a given colour map, mapping
// state index in [0, STATES-1] onto a smooth ramp. The lookup is shorter
// than 256 in practice; we size it to STATES.
function buildLUT(map: ColourMap): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(STATES * 4);
  for (let s = 0; s < STATES; s++) {
    const t = s / (STATES - 1); // 0..1
    let r = 0;
    let g = 0;
    let b = 0;
    switch (map) {
      case "rose": {
        // dark ink → rose → amber highlight
        r = 18 + t * (255 - 18);
        g = 12 + t * (180 - 12);
        b = 28 + t * (140 - 28);
        if (t > 0.75) {
          const k = (t - 0.75) / 0.25;
          r = 255;
          g = 180 + k * (215 - 180);
          b = 140 - k * 80;
        }
        break;
      }
      case "violet": {
        r = 14 + t * (180 - 14);
        g = 10 + t * (110 - 10);
        b = 30 + t * (255 - 30);
        if (t > 0.8) {
          const k = (t - 0.8) / 0.2;
          r = 180 + k * (240 - 180);
          g = 110 + k * (200 - 110);
          b = 255;
        }
        break;
      }
      case "amber": {
        r = 22 + t * (255 - 22);
        g = 14 + t * (200 - 14);
        b = 8 + t * (60 - 8);
        if (t > 0.7) {
          const k = (t - 0.7) / 0.3;
          r = 255;
          g = 200 + k * (240 - 200);
          b = 60 + k * 160;
        }
        break;
      }
      case "cyan": {
        r = 6 + t * (90 - 6);
        g = 18 + t * (220 - 18);
        b = 28 + t * (255 - 28);
        if (t > 0.8) {
          const k = (t - 0.8) / 0.2;
          r = 90 + k * (210 - 90);
          g = 220 + k * (245 - 220);
          b = 255;
        }
        break;
      }
    }
    lut[s * 4 + 0] = r;
    lut[s * 4 + 1] = g;
    lut[s * 4 + 2] = b;
    lut[s * 4 + 3] = 255;
  }
  return lut;
}

function randomGrid(): Uint8Array {
  const g = new Uint8Array(GRID * GRID);
  for (let i = 0; i < g.length; i++) {
    g[i] = Math.floor(Math.random() * STATES);
  }
  return g;
}

function spiralSeed(): Uint8Array {
  // A clean spiral seed: a horizontal half-line of ill cells with an
  // adjacent row of healthy cells creates a phase discontinuity that
  // rolls into a spiral once the rule runs.
  const g = new Uint8Array(GRID * GRID);
  const mid = Math.floor(GRID / 2);
  for (let x = mid; x < GRID; x++) {
    g[mid * GRID + x] = ILL;
  }
  for (let x = mid; x < GRID; x++) {
    g[(mid + 1) * GRID + x] = Math.floor(STATES * 0.6);
  }
  for (let x = mid; x < GRID; x++) {
    g[(mid - 1) * GRID + x] = Math.floor(STATES * 0.2);
  }
  return g;
}

// One Hodgepodge step: writes next state into `next` from `cur`.
function step(cur: Uint8Array, next: Uint8Array, k1: number, k2: number, g: number): void {
  const N = GRID;
  for (let y = 0; y < N; y++) {
    const ym = y === 0 ? N - 1 : y - 1;
    const yp = y === N - 1 ? 0 : y + 1;
    for (let x = 0; x < N; x++) {
      const xm = x === 0 ? N - 1 : x - 1;
      const xp = x === N - 1 ? 0 : x + 1;
      const idx = y * N + x;
      const s = cur[idx];

      if (s === ILL) {
        next[idx] = 0;
        continue;
      }

      // Gather Moore-neighbourhood stats
      let a = 0; // count of ill neighbours
      let b = 0; // count of infected neighbours (1..ILL-1)
      let sum = 0; // sum of infected neighbour states + own state

      const n = [
        cur[ym * N + xm],
        cur[ym * N + x],
        cur[ym * N + xp],
        cur[y * N + xm],
        cur[y * N + xp],
        cur[yp * N + xm],
        cur[yp * N + x],
        cur[yp * N + xp],
      ];
      for (let i = 0; i < 8; i++) {
        const v = n[i];
        if (v === ILL) a++;
        else if (v > 0) {
          b++;
          sum += v;
        }
      }

      if (s === 0) {
        // Healthy: count ill + infected neighbours, divide by k1/k2
        const v = Math.floor(a / k2) + Math.floor(b / k1);
        next[idx] = v >= ILL ? ILL : v;
      } else {
        // Infected: average infected (incl. self) + g
        const count = b + 1;
        const total = sum + s;
        const v = Math.floor(total / count) + g;
        next[idx] = v >= ILL ? ILL : v;
      }
    }
  }
}

export default function BzrExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.bzr;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bufRef = useRef<Uint8Array>(randomGrid());
  const nextRef = useRef<Uint8Array>(new Uint8Array(GRID * GRID));
  const iterRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const [k1, setK1] = useState(3);
  const [k2, setK2] = useState(3);
  const [g, setG] = useState(28);
  // Was 2 — at 60 fps that's ~120 grid-generations/s, which made the spiral
  // colour fronts strobe (epilepsy risk). 1 is the safe default; the slider
  // still goes up to 8 for users who want it faster.
  const [speed, setSpeed] = useState(1); // steps per frame
  const [running, setRunning] = useState(true);
  const [colourMap, setColourMap] = useState<ColourMap>("rose");
  const [iter, setIter] = useState(0);
  const [presetIdx, setPresetIdx] = useState(0);

  const lut = useMemo(() => buildLUT(colourMap), [colourMap]);

  const restart = useCallback(() => {
    bufRef.current = randomGrid();
    iterRef.current = 0;
    setIter(0);
  }, []);

  const seedSpiral = useCallback(() => {
    bufRef.current = spiralSeed();
    iterRef.current = 0;
    setIter(0);
  }, []);

  const applyPreset = useCallback((i: number) => {
    const p = PRESETS[i];
    setPresetIdx(i);
    setK1(p.k1);
    setK2(p.k2);
    setG(p.g);
  }, []);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = GRID;
    canvas.height = GRID;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const imgData = ctx.createImageData(GRID, GRID);

    const draw = () => {
      const buf = bufRef.current;
      const data = imgData.data;
      for (let i = 0; i < buf.length; i++) {
        const s = buf[i];
        const o = s * 4;
        const j = i * 4;
        data[j] = lut[o];
        data[j + 1] = lut[o + 1];
        data[j + 2] = lut[o + 2];
        data[j + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
    };

    const tick = () => {
      if (running) {
        for (let i = 0; i < speed; i++) {
          step(bufRef.current, nextRef.current, k1, k2, g);
          const tmp = bufRef.current;
          bufRef.current = nextRef.current;
          nextRef.current = tmp;
          iterRef.current++;
        }
        setIter(iterRef.current);
      }
      draw();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [k1, k2, g, speed, running, lut]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              Hodgepodge automaton · {GRID} × {GRID} · {STATES} states
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
              k₁ = {k1} · k₂ = {k2} · g = {g}
            </div>
          </div>
          <div className="hairline flex flex-1 items-center justify-center overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={canvasRef}
              className="block"
              style={{
                width: "min(100%, calc(100vh - 12rem))",
                height: "min(100%, calc(100vh - 12rem))",
                imageRendering: "pixelated",
              }}
            />
          </div>
          <div className="glass hairline flex items-center justify-between rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            <span>iteration {iter}</span>
            <span>{running ? "running" : "paused"}</span>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={restart}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-rose/50 hover:text-signal-rose"
              >
                Restart · random
              </button>
              <button
                onClick={seedSpiral}
                className="rounded-md border border-signal-rose/60 bg-signal-rose/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-rose transition-colors hover:bg-signal-rose/20"
              >
                Seed spiral
              </button>
              <button
                onClick={() => setRunning((r) => !r)}
                className="hairline col-span-2 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/50 hover:text-signal-amber"
              >
                {running ? "Pause" : "Play"}
              </button>
            </div>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Presets
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(i)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    presetIdx === i && p.k1 === k1 && p.k2 === k2 && p.g === g
                      ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                      : "hairline text-ink-200 hover:border-signal-rose/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">{p.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">
                    k₁={p.k1} · k₂={p.k2} · g={p.g}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              k₁ · infected weight
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-rose">{k1}</span>
            </div>
            <input
              type="range"
              value={k1}
              min={1}
              max={8}
              step={1}
              onChange={(e) => setK1(parseInt(e.target.value))}
              className="w-full accent-signal-rose"
            />

            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              k₂ · ill weight
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-rose">{k2}</span>
            </div>
            <input
              type="range"
              value={k2}
              min={1}
              max={8}
              step={1}
              onChange={(e) => setK2(parseInt(e.target.value))}
              className="w-full accent-signal-rose"
            />

            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              g · reaction rate
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-amber">{g}</span>
            </div>
            <input
              type="range"
              value={g}
              min={1}
              max={60}
              step={1}
              onChange={(e) => setG(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Speed · steps per frame
            </div>
            <input
              type="range"
              value={speed}
              min={1}
              max={8}
              step={1}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">
              {speed} step{speed > 1 ? "s" : ""}/frame
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Colour map
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(["rose", "violet", "amber", "cyan"] as ColourMap[]).map((cm) => (
                <button
                  key={cm}
                  onClick={() => setColourMap(cm)}
                  className={`rounded-md border px-2 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    colourMap === cm
                      ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                      : "hairline text-ink-300 hover:border-signal-rose/40 hover:text-ink-100"
                  }`}
                >
                  {cm}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-2 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Stats
            </div>
            <div className="flex justify-between font-mono text-xs text-ink-200">
              <span>Grid</span>
              <span>
                {GRID} × {GRID}
              </span>
            </div>
            <div className="flex justify-between font-mono text-xs text-ink-200">
              <span>States</span>
              <span>{STATES}</span>
            </div>
            <div className="flex justify-between font-mono text-xs text-ink-200">
              <span>Iteration</span>
              <span className="text-signal-rose">{iter}</span>
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/bzr"
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
