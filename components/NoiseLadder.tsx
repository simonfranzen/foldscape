"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Inline interactive for the diffusion story page. A T+1 strip of small
// tiles (32×32 px source, rendered crisp at ~80px) showing the same image
// progressively noised via the forward q(x_t | x_0) formula:
//
//     x_t = √(ᾱ_t) · x_0  +  √(1 − ᾱ_t) · ε,    ε ~ N(0, I)
//
// where ᾱ_t = ∏_{s≤t} (1 − β_s). The slider scrubs t between 0 and T.
// Auto-play walks t forward to T then reverses back, illustrating that
// the same image lives on both ends of the same Markov chain.

interface Props {
  caption: string;
  scrubLabel: string;
  playLabel: string;
  pauseLabel: string;
  forwardLabel: string;
  reverseLabel: string;
  stepLabel: string;
  hint: string;
}

const T = 8; // number of noise steps (frames are t=0..T → T+1 tiles)
const SIDE = 32; // image side in source pixels
const TILE = 80; // tile render size on screen
const BETA_START = 0.02;
const BETA_END = 0.5;

// Hand-drawn 32×32 smiley on amber background (0 = background, 1 = ink).
// Compact pixel-art constructed inline — small enough to live in source.
function buildBaseImage(): Float32Array {
  // RGB float buffer, length = SIDE*SIDE*3, values in [0,1].
  const buf = new Float32Array(SIDE * SIDE * 3);
  // Amber base (warm gold) and dark ink for the smiley features.
  const amber = [1.0, 0.78, 0.27];
  const ink = [0.18, 0.08, 0.05];
  // Mark which pixels are "ink" via a tiny boolean grid.
  const ink2d: boolean[][] = Array.from({ length: SIDE }, () =>
    new Array(SIDE).fill(false),
  );
  // Outer face circle (radius ~14 from centre 15.5)
  for (let y = 0; y < SIDE; y++) {
    for (let x = 0; x < SIDE; x++) {
      const dx = x - 15.5;
      const dy = y - 15.5;
      const r = Math.hypot(dx, dy);
      if (r > 14 && r < 15.3) ink2d[y][x] = true;
    }
  }
  // Eyes: two small filled discs at (11,12) and (20,12), radius ~1.5
  for (const [ex, ey] of [
    [11, 12],
    [20, 12],
  ] as const) {
    for (let y = 0; y < SIDE; y++) {
      for (let x = 0; x < SIDE; x++) {
        if (Math.hypot(x - ex, y - ey) < 1.8) ink2d[y][x] = true;
      }
    }
  }
  // Mouth: an arc from x=10..21 along y ≈ 20..22 (smile curve)
  for (let x = 10; x <= 21; x++) {
    const t = (x - 10) / 11;
    const yArc = Math.round(20 + 2.2 * Math.sin(Math.PI * t));
    if (yArc >= 0 && yArc < SIDE) ink2d[yArc][x] = true;
    if (yArc + 1 < SIDE) ink2d[yArc + 1][x] = true;
  }
  for (let y = 0; y < SIDE; y++) {
    for (let x = 0; x < SIDE; x++) {
      const isInk = ink2d[y][x];
      const px = isInk ? ink : amber;
      const i = (y * SIDE + x) * 3;
      buf[i] = px[0];
      buf[i + 1] = px[1];
      buf[i + 2] = px[2];
    }
  }
  return buf;
}

// Compute cumulative ᾱ_t for the linear β schedule. αBar[0] = 1, αBar[T] very small.
function buildAlphaBars(): Float32Array {
  const out = new Float32Array(T + 1);
  let acc = 1;
  out[0] = 1;
  for (let t = 1; t <= T; t++) {
    const u = (t - 1) / Math.max(1, T - 1);
    const beta = BETA_START + (BETA_END - BETA_START) * u;
    acc *= 1 - beta;
    out[t] = acc;
  }
  return out;
}

// Seeded Gaussian (Box-Muller) so the same frame always looks the same.
function gaussianBuffer(seed: number, length: number): Float32Array {
  // Lightweight LCG for u-samples; result is a fixed Gaussian field per seed.
  let s = (seed | 0) >>> 0;
  const lcg = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s >>> 0) / 4294967296;
  };
  const out = new Float32Array(length);
  for (let i = 0; i < length; i += 2) {
    const u1 = Math.max(1e-9, lcg());
    const u2 = lcg();
    const r = Math.sqrt(-2 * Math.log(u1));
    out[i] = r * Math.cos(2 * Math.PI * u2);
    if (i + 1 < length) out[i + 1] = r * Math.sin(2 * Math.PI * u2);
  }
  return out;
}

// q(x_t | x_0) = N( √(ᾱ_t) x_0, (1−ᾱ_t) I ).
// Draw deterministically (same noise seed every render) so the strip is stable.
function noisedFrame(base: Float32Array, alphaBar: number, noise: Float32Array): Float32Array {
  const out = new Float32Array(base.length);
  const sA = Math.sqrt(alphaBar);
  const sB = Math.sqrt(1 - alphaBar);
  for (let i = 0; i < base.length; i++) {
    // Centre the image on 0 around 0.5 grey, scale noise by 0.5 amplitude so it
    // sits in roughly the same range as the image after re-clamping.
    const centered = base[i] - 0.5;
    const v = sA * centered + sB * 0.5 * noise[i];
    out[i] = Math.min(1, Math.max(0, v + 0.5));
  }
  return out;
}

function paintTile(canvas: HTMLCanvasElement, img: Float32Array) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  // Crisp scaling: render to an SIDE×SIDE backbuffer then upscale.
  const back = document.createElement("canvas");
  back.width = SIDE;
  back.height = SIDE;
  const bctx = back.getContext("2d");
  if (!bctx) return;
  const id = bctx.createImageData(SIDE, SIDE);
  for (let i = 0; i < SIDE * SIDE; i++) {
    id.data[i * 4 + 0] = Math.round(img[i * 3 + 0] * 255);
    id.data[i * 4 + 1] = Math.round(img[i * 3 + 1] * 255);
    id.data[i * 4 + 2] = Math.round(img[i * 3 + 2] * 255);
    id.data[i * 4 + 3] = 255;
  }
  bctx.putImageData(id, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(back, 0, 0, canvas.width, canvas.height);
}

export function NoiseLadder({
  caption,
  scrubLabel,
  playLabel,
  pauseLabel,
  forwardLabel,
  reverseLabel,
  stepLabel,
  hint,
}: Props) {
  const base = useMemo(() => buildBaseImage(), []);
  const alphaBars = useMemo(() => buildAlphaBars(), []);
  // One fixed noise field per frame, so x_t varies smoothly as t changes.
  // Using one shared field per frame (rather than per pixel re-sampled each
  // render) keeps the tiles stable while the user scrubs.
  const noiseFields = useMemo(
    () =>
      Array.from({ length: T + 1 }, (_, t) =>
        gaussianBuffer(0x1234abcd + t * 6151, SIDE * SIDE * 3),
      ),
    [],
  );
  const frames = useMemo(
    () => Array.from({ length: T + 1 }, (_, t) => noisedFrame(base, alphaBars[t], noiseFields[t])),
    [base, alphaBars, noiseFields],
  );

  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  // direction: +1 forward (clean → noisy), -1 reverse (noisy → clean).
  const [dir, setDir] = useState<1 | -1>(1);
  const rafRef = useRef<number | null>(null);

  const refs = useRef<Array<HTMLCanvasElement | null>>([]);
  useEffect(() => {
    refs.current.forEach((c, i) => {
      if (c) paintTile(c, frames[i]);
    });
  }, [frames]);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      if (dt > 0.45) {
        // ~2.2 fps walk — slow enough to read each frame.
        last = now;
        setT((prev) => {
          let next = prev + dir;
          if (next > T) {
            next = T - 1;
            setDir(-1);
          } else if (next < 0) {
            next = 1;
            setDir(1);
          }
          return next;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, dir]);

  return (
    <figure className="glass hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6 md:p-8">
      <figcaption className="space-y-1">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
          {caption}
        </div>
        <div className="text-[11px] text-ink-400">
          q(x_t | x_0) = N(√ᾱ_t · x_0, (1−ᾱ_t) I)
        </div>
      </figcaption>

      {/* The strip of tiles */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-end gap-2 pb-2">
          {Array.from({ length: T + 1 }, (_, i) => {
            const active = i === t;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <canvas
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  width={TILE}
                  height={TILE}
                  className={`block rounded-md transition-all ${
                    active
                      ? "ring-2 ring-signal-rose/80 scale-105"
                      : "ring-1 ring-ink-700/40 opacity-80"
                  }`}
                  aria-label={`x_${i}`}
                />
                <span
                  className={`font-mono text-[10px] ${
                    active ? "text-signal-rose" : "text-ink-400"
                  }`}
                >
                  t = {i}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            <span>{scrubLabel}</span>
            <span className="text-signal-rose">
              t = {t} / {T}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={T}
            step={1}
            value={t}
            onChange={(e) => {
              setPlaying(false);
              setT(parseInt(e.target.value, 10));
            }}
            className="w-full accent-signal-rose"
            aria-label={stepLabel}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPlaying((p) => !p)}
            className={`rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
              playing
                ? "border-signal-rose/60 bg-signal-rose/15 text-signal-rose"
                : "hairline text-ink-200 hover:border-signal-rose/40 hover:text-signal-rose"
            }`}
          >
            {playing ? pauseLabel : playLabel}
          </button>
          <button
            onClick={() => {
              setDir(1);
              setT(0);
            }}
            className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
          >
            {forwardLabel}
          </button>
          <button
            onClick={() => {
              setDir(-1);
              setT(T);
            }}
            className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
          >
            {reverseLabel}
          </button>
        </div>

        <p className="text-[12px] leading-relaxed text-ink-300">{hint}</p>
      </div>
    </figure>
  );
}
