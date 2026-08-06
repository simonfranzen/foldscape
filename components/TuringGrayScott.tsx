"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Compact Gray-Scott reaction-diffusion simulator used inline in the
// /turingpattern story page. Grid is small (~120×100) so the simulation
// runs comfortably in real time even on laptops; ~30 sub-steps per frame
// give the patterns time to actually emerge.

interface Preset {
  id: string;
  label: string;
  F: number;
  k: number;
}

const DEFAULT_PRESETS: Preset[] = [
  { id: "spots", label: "Spots", F: 0.025, k: 0.06 },
  { id: "stripes", label: "Stripes", F: 0.029, k: 0.057 },
  { id: "coral", label: "Coral", F: 0.0545, k: 0.062 },
  { id: "mitosis", label: "Mitosis", F: 0.0367, k: 0.0649 },
];

const W = 120;
const H = 100;
const SIZE = W * H;
const STEPS_PER_FRAME = 30;

// Tiny shared LUT (ink → mid → amber).
function buildLUT(): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(256 * 3);
  const bg: [number, number, number] = [6, 7, 13];
  const mid: [number, number, number] = [110, 55, 12];
  const hi: [number, number, number] = [255, 209, 102];
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let r: number, g: number, b: number;
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

function seed(a: Float32Array, b: Float32Array): void {
  // Background equilibrium: a=1, b=0. A handful of soft blotches with
  // a≈0.5, b≈0.25 break the symmetry without driving the explicit Euler
  // step into instability (a hard 0/1 step would inject a Laplacian of
  // magnitude ~4 and blow up immediately with Da=1, Db=0.5, dt=1).
  a.fill(1);
  b.fill(0);
  for (let p = 0; p < 8; p++) {
    const cx = Math.floor(Math.random() * W);
    const cy = Math.floor(Math.random() * H);
    const r = 3 + Math.floor(Math.random() * 4);
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r * r) continue;
        const x = (cx + dx + W) % W;
        const y = (cy + dy + H) % H;
        const i = y * W + x;
        a[i] = 0.5 + (Math.random() - 0.5) * 0.1;
        b[i] = 0.25 + (Math.random() - 0.5) * 0.1;
      }
    }
  }
}

interface Props {
  caption: string;
  feedLabel: string;
  killLabel: string;
  resetLabel: string;
  pauseLabel: string;
  playLabel: string;
  presetLabel: string;
  presetNames?: { spots: string; stripes: string; coral: string; mitosis: string };
  note: string;
}

export function TuringGrayScott({
  caption,
  feedLabel,
  killLabel,
  resetLabel,
  pauseLabel,
  playLabel,
  presetLabel,
  presetNames,
  note,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [F, setF] = useState(DEFAULT_PRESETS[0].F);
  const [k, setK] = useState(DEFAULT_PRESETS[0].k);
  const [paused, setPaused] = useState(false);
  const [resetTick, setResetTick] = useState(0);
  const [activePreset, setActivePreset] = useState("spots");
  const [reducedMotion, setReducedMotion] = useState(false);

  // Track the reduced-motion preference live so we can freeze / resume.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (): void => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const presets = useMemo<Preset[]>(
    () =>
      DEFAULT_PRESETS.map((p) => ({
        ...p,
        label: presetNames?.[p.id as keyof typeof presetNames] ?? p.label,
      })),
    [presetNames],
  );

  const aRef = useRef<Float32Array>(new Float32Array(SIZE));
  const bRef = useRef<Float32Array>(new Float32Array(SIZE));
  const aNextRef = useRef<Float32Array>(new Float32Array(SIZE));
  const bNextRef = useRef<Float32Array>(new Float32Array(SIZE));

  const paramsRef = useRef({ F, k, paused });
  paramsRef.current = { F, k, paused };

  const lut = useMemo(() => buildLUT(), []);

  useEffect(() => {
    seed(aRef.current, bRef.current);
    aNextRef.current.set(aRef.current);
    bNextRef.current.set(bRef.current);
  }, [resetTick]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = ctx.createImageData(W, H);
    const data = image.data;

    // Canonical Pearson 1993 Gray-Scott constants. Da=1, Db=0.5 with dt=1
    // gives a Laplace amplifier of 4·Da·dt = 4 (way over CFL = 1) — the
    // hard-clamp prevented NaN but pinned the field to {0,1} so no pattern
    // ever formed. 0.16/0.08 keeps 4·Da·dt = 0.64 — comfortably stable,
    // and matches the F/k values quoted in the Pearson zoo presets.
    const Da = 0.16;
    const Db = 0.08;
    const dt = 1.0;

    // One explicit-Euler sub-step over the whole grid, reading live F/k.
    const advance = (): void => {
      const p = paramsRef.current;
      const aCur = aRef.current;
      const bCur = bRef.current;
      const aNext = aNextRef.current;
      const bNext = bNextRef.current;
      for (let y = 0; y < H; y++) {
        const yUp = y === 0 ? H - 1 : y - 1;
        const yDn = y === H - 1 ? 0 : y + 1;
        const row = y * W;
        const rowU = yUp * W;
        const rowD = yDn * W;
        for (let x = 0; x < W; x++) {
          const xL = x === 0 ? W - 1 : x - 1;
          const xR = x === W - 1 ? 0 : x + 1;
          const i = row + x;
          const aC = aCur[i];
          const bC = bCur[i];
          const lapA = aCur[row + xL] + aCur[row + xR] + aCur[rowU + x] + aCur[rowD + x] - 4 * aC;
          const lapB = bCur[row + xL] + bCur[row + xR] + bCur[rowU + x] + bCur[rowD + x] - 4 * bC;
          const abb = aC * bC * bC;
          let aN = aC + dt * (Da * lapA - abb + p.F * (1 - aC));
          let bN = bC + dt * (Db * lapB + abb - (p.F + p.k) * bC);
          // Hard-clamp to [0,1] keeps the explicit Euler stable
          // and prevents NaN/Inf cascades when seeds are sharp.
          if (aN < 0) aN = 0;
          else if (aN > 1) aN = 1;
          if (bN < 0) bN = 0;
          else if (bN > 1) bN = 1;
          aNext[i] = aN;
          bNext[i] = bN;
        }
      }
      aRef.current = aNext;
      bRef.current = bNext;
      aNextRef.current = aCur;
      bNextRef.current = bCur;
    };

    const paint = (): void => {
      const b = bRef.current;
      for (let i = 0; i < SIZE; i++) {
        let v = b[i] * 3.5;
        if (v < 0) v = 0;
        else if (v > 1) v = 1;
        const idx = (v * 255) | 0;
        const o = i * 4;
        const l = idx * 3;
        data[o] = lut[l];
        data[o + 1] = lut[l + 1];
        data[o + 2] = lut[l + 2];
        data[o + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
    };

    if (reducedMotion) {
      // Run to a near-stationary pattern once, then freeze (no perpetual rAF).
      for (let s = 0; s < 1800; s++) advance();
      paint();
      return;
    }

    let raf = 0;
    const step = (): void => {
      const p = paramsRef.current;
      if (!p.paused) {
        for (let s = 0; s < STEPS_PER_FRAME; s++) advance();
      }
      paint();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [lut, reducedMotion, resetTick]);

  const applyPreset = (preset: Preset) => {
    setF(preset.F);
    setK(preset.k);
    setActivePreset(preset.id);
    setResetTick((t) => t + 1);
  };

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[360px_1fr]">
        <div className="hairline overflow-hidden rounded-xl border bg-ink-950">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Live Gray-Scott reaction-diffusion simulation"
            className="block w-full"
            style={{
              imageRendering: "pixelated",
              aspectRatio: `${W} / ${H}`,
            }}
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {presetLabel}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  className={`rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    p.id === activePreset
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-ink-100"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              <span>{feedLabel}</span>
              <span className="text-signal-amber">{F.toFixed(4)}</span>
            </div>
            <input
              type="range"
              aria-label={feedLabel}
              value={F}
              min={0.01}
              max={0.08}
              step={0.0005}
              onChange={(e) => {
                setF(parseFloat(e.target.value));
                setActivePreset("custom");
              }}
              className="w-full accent-signal-amber"
            />
          </div>
          <div>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              <span>{killLabel}</span>
              <span className="text-signal-amber">{k.toFixed(4)}</span>
            </div>
            <input
              type="range"
              aria-label={killLabel}
              value={k}
              min={0.04}
              max={0.075}
              step={0.0005}
              onChange={(e) => {
                setK(parseFloat(e.target.value));
                setActivePreset("custom");
              }}
              className="w-full accent-signal-amber"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setResetTick((t) => t + 1)}
              className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              {resetLabel}
            </button>
            <button
              onClick={() => setPaused((v) => !v)}
              className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              {paused ? playLabel : pauseLabel}
            </button>
          </div>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-ink-400">{note}</p>
    </div>
  );
}
