"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Inline interactive for the diffusion story page. A T+1 strip of tiles
// (48×48 px source, rendered crisp at ~96px) showing the same image
// progressively noised via the forward q(x_t | x_0) formula:
//
//     x_t = √(ᾱ_t) · x_0  +  √(1 − ᾱ_t) · ε,    ε ~ N(0, I)
//
// where ᾱ_t = ∏_{s≤t} (1 − β_s). The slider scrubs t between 0 and T.
// Auto-play (the default) walks t forward to T then reverses back —
// the same Markov chain visited from both ends.
//
// We also paint a big "hero" tile at the current step so the BEFORE→AFTER
// is unmistakable: a sharp coloured silhouette at t=0, pure static at t=T.

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
const SIDE = 48; // image side in source pixels (bumped from 32 for clarity)
const TILE = 96; // small-tile render size on screen (bumped from 80)
const HERO = 288; // hero render size on screen (3 × small tile)
const BETA_START = 0.02;
const BETA_END = 0.55;

// Pixel-art "Foldscape mark": a stylised cardioid-on-grid silhouette in
// vivid rose against a deep navy field. Designed at SIDE=48 so it stays
// chunky and instantly recognisable even when half-eaten by noise.
function buildBaseImage(): Float32Array {
  const buf = new Float32Array(SIDE * SIDE * 3);
  // Vivid palette — picked so the silhouette survives a lot of additive
  // noise before becoming unreadable.
  const bg = [0.04, 0.05, 0.12]; // deep navy
  const ink = [1.0, 0.38, 0.62]; // signal-rose
  const accent = [0.49, 0.95, 1.0]; // signal-cyan
  const ink2d: number[][] = Array.from({ length: SIDE }, () => new Array<number>(SIDE).fill(0));
  // Cardioid r = a·(1 − cos θ) drawn as a filled silhouette, centred and
  // scaled to fill the tile. Mark interior with 1, outline with 2.
  const cx = SIDE / 2;
  const cy = SIDE / 2 + 2;
  const a = SIDE * 0.22;
  for (let y = 0; y < SIDE; y++) {
    for (let x = 0; x < SIDE; x++) {
      const dx = x - cx;
      const dy = -(y - cy); // flip so cardioid opens right-ish visually
      const r = Math.hypot(dx, dy);
      const theta = Math.atan2(dy, dx);
      const rho = a * (1 - Math.cos(theta));
      if (r < rho) ink2d[y][x] = 1;
      if (r >= rho - 0.9 && r < rho + 0.9) ink2d[y][x] = 1;
    }
  }
  // Add a thin cyan equatorial bar to break the silhouette into something
  // unmistakable post-noise.
  const barY = Math.round(SIDE / 2 + 3);
  for (let x = 6; x < SIDE - 6; x++) {
    if (ink2d[barY][x] === 0) ink2d[barY][x] = 2;
    if (ink2d[barY + 1] && ink2d[barY + 1][x] === 0) ink2d[barY + 1][x] = 2;
  }
  for (let y = 0; y < SIDE; y++) {
    for (let x = 0; x < SIDE; x++) {
      const tag = ink2d[y][x];
      const px = tag === 1 ? ink : tag === 2 ? accent : bg;
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
    // Centre per-channel around 0.5 so noise rides around mid-grey.
    const centered = base[i] - 0.5;
    const v = sA * centered + sB * 0.55 * noise[i];
    out[i] = Math.min(1, Math.max(0, v + 0.5));
  }
  return out;
}

function paintTile(canvas: HTMLCanvasElement, img: Float32Array) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
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

// Short per-step caption naming the regime the user is in. We pick the
// English-ish phrasing here (the parent `hint` string handles full prose
// in all 8 locales); the per-tile label below is just a quick pointer.
function stepFlavour(t: number, total: number, alphaBar: number): string {
  const sig = Math.sqrt(alphaBar); // signal share
  if (t === 0) return "clean · x₀";
  if (t === total) return "pure noise · x_T";
  if (sig > 0.85) return "barely noisy";
  if (sig > 0.5) return "half signal, half noise";
  if (sig > 0.2) return "mostly noise";
  return "nearly pure noise";
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

  // Respect prefers-reduced-motion: if set, do not auto-play and let the
  // user advance the chain manually with the scrub bar / nudge buttons.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);

  const [t, setT] = useState(0);
  // Auto-play by default so a visitor sees the chain breathing immediately
  // (unless they've asked for reduced motion).
  const [playing, setPlaying] = useState(true);
  // direction: +1 forward (clean → noisy), -1 reverse (noisy → clean).
  const [dir, setDir] = useState<1 | -1>(1);
  const rafRef = useRef<number | null>(null);

  // Honour reduced-motion: stop the playback loop and freeze on a mid-tile.
  useEffect(() => {
    if (reduced) {
      setPlaying(false);
      setT(Math.floor(T / 2));
    }
  }, [reduced]);

  const heroRef = useRef<HTMLCanvasElement | null>(null);
  const refs = useRef<Array<HTMLCanvasElement | null>>([]);
  useEffect(() => {
    refs.current.forEach((c, i) => {
      if (c) paintTile(c, frames[i]);
    });
  }, [frames]);
  // Repaint the hero tile whenever t changes.
  useEffect(() => {
    if (heroRef.current) paintTile(heroRef.current, frames[t]);
  }, [t, frames]);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      if (dt > 0.55) {
        // ~1.8 fps walk — slow enough to read each frame.
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

  const flavour = stepFlavour(t, T, alphaBars[t]);
  const signalPct = Math.round(Math.sqrt(alphaBars[t]) * 100);
  const noisePct = 100 - signalPct;

  return (
    <figure className="glass hairline space-y-6 rounded-2xl border bg-ink-950/40 p-6 md:p-8">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="space-y-1">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
            {caption}
          </div>
          <div className="text-[11px] text-ink-400">q(x_t | x_0) = N(√ᾱ_t · x_0, (1−ᾱ_t) I)</div>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          signal {signalPct}% · noise {noisePct}%
        </div>
      </figcaption>

      {/* Hero tile — large enough that the BEFORE/AFTER difference is
          unmissable. Sits above the tile strip. */}
      <div className="flex flex-col items-center gap-2">
        <canvas
          ref={heroRef}
          width={HERO}
          height={HERO}
          className="block rounded-xl shadow-[0_0_60px_rgba(255,97,151,0.25)] ring-2 ring-signal-rose/60"
          aria-label={`x_${t}`}
        />
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm text-signal-rose">
            t = {t} / {T}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-ink-300">
            {flavour}
          </span>
        </div>
      </div>

      {/* The strip of small tiles */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-end justify-center gap-2 pb-2">
          {Array.from({ length: T + 1 }, (_, i) => {
            const active = i === t;
            return (
              <button
                type="button"
                key={i}
                onClick={() => {
                  setPlaying(false);
                  setT(i);
                }}
                className="flex flex-col items-center gap-1"
                aria-label={`Jump to step ${i}`}
              >
                <canvas
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  width={TILE}
                  height={TILE}
                  className={`block rounded-md transition-all ${
                    active
                      ? "scale-110 ring-2 ring-signal-rose/80"
                      : "opacity-70 ring-1 ring-ink-700/40 hover:opacity-100 hover:ring-signal-rose/40"
                  }`}
                />
                <span
                  className={`font-mono text-[10px] ${
                    active ? "text-signal-rose" : "text-ink-400"
                  }`}
                >
                  t = {i}
                </span>
              </button>
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
              setPlaying(false);
              setDir(1);
              setT(0);
            }}
            className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
          >
            {forwardLabel}
          </button>
          <button
            onClick={() => {
              setPlaying(false);
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
