"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Compact 2D excitable-medium simulator that nucleates rotating spiral
// waves of the kind seen in a Belousov-Zhabotinsky Petri dish. Uses a
// Barkley-style two-variable reduction of FitzHugh-Nagumo on a small
// grid with a 5-point Laplacian.
//
//   du/dt = (1/eps) * u * (1 - u) * (u - (v + b) / a) + Du * lap(u)
//   dv/dt = u - v
//
// u is the fast activator (paints the propagating front), v is the slow
// inhibitor (the refractory tail behind the wave).

const W = 180;
const H = 140;
const SIZE = W * H;
// Was 6 — at dt=0.18 that meant ~1 sim time-unit per frame at 60 fps, which
// rotated the spiral waves so fast the colour fronts strobed (epilepsy risk).
// 2 gives a calm, watchable swirl while still resolving the wave structure.
const STEPS_PER_FRAME = 2;

// Two-tone LUT: black ink -> deep rose -> warm amber. Tracks u directly.
function buildLUT(): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(256 * 3);
  const bg: [number, number, number] = [6, 7, 13];
  const mid: [number, number, number] = [255, 122, 182]; // rose
  const hi: [number, number, number] = [255, 209, 102]; // amber
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

// Initial seed: a quiescent field with a small excitation band that, once
// the symmetry is broken below, curls into a spiral.
function seed(u: Float32Array, v: Float32Array): void {
  u.fill(0);
  v.fill(0);
  // A horizontal stripe of "u" near the top, and a separate stripe of "v"
  // (refractory) just below it — when this state evolves, the leading edge
  // of u runs forward while the refractory tail blocks it from filling in,
  // and the asymmetry curls into a spiral pair.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      // Excitation band (upper third, left half)
      if (y > H * 0.35 && y < H * 0.45 && x < W * 0.5) {
        u[i] = 1.0;
      }
      // Refractory band right behind it (small slice further left)
      if (y > H * 0.45 && y < H * 0.6 && x < W * 0.5) {
        v[i] = 0.35;
      }
    }
  }
}

// Plant a localised perturbation at (cx, cy) — used to nucleate a fresh
// spiral in the middle of an already-running field.
function plantDefect(u: Float32Array, v: Float32Array, cx: number, cy: number): void {
  const r = 8;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const x = (cx + dx + W) % W;
      const y = (cy + dy + H) % H;
      const i = y * W + x;
      const d2 = dx * dx + dy * dy;
      if (d2 > r * r) continue;
      // Half excitation, half refractory — the broken-symmetry seed.
      if (dx < 0) u[i] = 1.0;
      if (dx >= 0 && d2 < (r - 2) * (r - 2)) v[i] = 0.4;
    }
  }
}

interface Props {
  caption: string;
  resetLabel: string;
  plantLabel: string;
  pauseLabel: string;
  playLabel: string;
  note: string;
}

export function BzrSpiralSim({
  caption,
  resetLabel,
  plantLabel,
  pauseLabel,
  playLabel,
  note,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [resetTick, setResetTick] = useState(0);
  // Honour prefers-reduced-motion: settle a representative spiral once and skip
  // the RAF loop so the rotating fronts do not animate for motion-sensitive
  // users (the strobing fronts are the flagged epilepsy risk).
  const [reduced, setReduced] = useState(false);
  // Bumped by Plant defect so the static (reduced-motion) render repaints.
  const [plantTick, setPlantTick] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const uRef = useRef<Float32Array>(new Float32Array(SIZE));
  const vRef = useRef<Float32Array>(new Float32Array(SIZE));
  const uNextRef = useRef<Float32Array>(new Float32Array(SIZE));
  const vNextRef = useRef<Float32Array>(new Float32Array(SIZE));

  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const lut = useMemo(() => buildLUT(), []);

  useEffect(() => {
    seed(uRef.current, vRef.current);
    uNextRef.current.set(uRef.current);
    vNextRef.current.set(vRef.current);
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

    // Barkley model parameters. a, b chosen so the medium is excitable
    // (single resting state, large excursion when threshold crossed).
    const a = 0.75;
    const b = 0.02;
    const eps = 0.04;
    const Du = 1.0;
    const dt = 0.18;

    // One Barkley grid update, swapping the double buffers.
    const simulate = (): void => {
      const uCur = uRef.current;
      const vCur = vRef.current;
      const uNext = uNextRef.current;
      const vNext = vNextRef.current;
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
          const uC = uCur[i];
          const vC = vCur[i];
          const lapU = uCur[row + xL] + uCur[row + xR] + uCur[rowU + x] + uCur[rowD + x] - 4 * uC;
          const fU = (uC * (1 - uC) * (uC - (vC + b) / a)) / eps;
          let uN = uC + dt * (fU + Du * lapU);
          let vN = vC + dt * (uC - vC);
          if (uN < 0) uN = 0;
          else if (uN > 1) uN = 1;
          if (vN < 0) vN = 0;
          else if (vN > 1) vN = 1;
          uNext[i] = uN;
          vNext[i] = vN;
        }
      }
      uRef.current = uNext;
      vRef.current = vNext;
      uNextRef.current = uCur;
      vNextRef.current = vCur;
    };

    const render = (): void => {
      const u = uRef.current;
      for (let i = 0; i < SIZE; i++) {
        let val = u[i];
        if (val < 0) val = 0;
        else if (val > 1) val = 1;
        const idx = (val * 255) | 0;
        const o = i * 4;
        const l = idx * 3;
        data[o] = lut[l];
        data[o + 1] = lut[l + 1];
        data[o + 2] = lut[l + 2];
        data[o + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
    };

    // Reduced motion: settle a representative spiral synchronously, paint it
    // once, and never start the RAF loop.
    if (reduced) {
      for (let s = 0; s < 700; s++) simulate();
      render();
      return;
    }

    let raf = 0;
    const step = (): void => {
      if (!pausedRef.current) {
        for (let s = 0; s < STEPS_PER_FRAME; s++) simulate();
      }
      render();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [lut, reduced, resetTick, plantTick]);

  const handlePlant = () => {
    // Random defect somewhere in the central two-thirds of the field.
    const cx = Math.floor(W * (0.2 + Math.random() * 0.6));
    const cy = Math.floor(H * (0.2 + Math.random() * 0.6));
    plantDefect(uRef.current, vRef.current, cx, cy);
    // Repaint even under reduced motion, where no RAF loop is running.
    setPlantTick((t) => t + 1);
  };

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
        {caption}
      </div>
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[360px_1fr]">
        <div className="hairline overflow-hidden rounded-xl border bg-ink-950">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={caption}
            className="block w-full"
            style={{
              imageRendering: "pixelated",
              aspectRatio: `${W} / ${H}`,
            }}
          />
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => setResetTick((t) => t + 1)}
              className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
            >
              {resetLabel}
            </button>
            <button
              onClick={handlePlant}
              className="rounded-md border border-signal-rose/40 bg-signal-rose/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-rose transition-colors hover:bg-signal-rose/20"
            >
              {plantLabel}
            </button>
            <button
              onClick={() => setPaused((v) => !v)}
              className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
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
