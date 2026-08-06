"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Live Buffon's-needle drop simulator. Tiny canvas (~360×280), parallel
// lines, needles dropping one at a time. Tracks crossings, total drops,
// and the rolling π estimate. Buttons: play / pause / reset / +1000.
// State is exposed through an optional callback so the convergence-plot
// sibling can plot the same run if desired.

// Layout constants at module scope. d = line spacing, ell = needle length
// (ell <= d). Module scope keeps them referentially stable so the rAF loop
// effect does not need them in its dependency array.
const D = 38;
const ELL = D * 0.85;

interface Props {
  caption: string;
  playLabel: string;
  pauseLabel: string;
  resetLabel: string;
  fastForwardLabel: string;
  dropsLabel: string;
  crossingsLabel: string;
  estimateLabel: string;
  trueLabel: string;
  onSample?: (drops: number, crossings: number) => void;
}

export function BuffonNeedleSim({
  caption,
  playLabel,
  pauseLabel,
  resetLabel,
  fastForwardLabel,
  dropsLabel,
  crossingsLabel,
  estimateLabel,
  trueLabel,
  onSample,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();
  const [running, setRunning] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [drops, setDrops] = useState(0);
  const [crossings, setCrossings] = useState(0);
  const [resetTick, setResetTick] = useState(0);

  // Mutable refs for the inner loop — avoid re-rendering on every drop.
  const dropsRef = useRef(0);
  const crossingsRef = useRef(0);

  // Respect prefers-reduced-motion: the global CSS rule cannot stop a canvas
  // rAF loop, so we track the query ourselves and freeze on a static frame.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);

  // Draw the lined paper background on mount and on reset.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawBackground(ctx, W, H);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [resetTick, dpr]);

  // Drop loop — runs only while `running` is true.
  useEffect(() => {
    if (!running) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const tick = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      // Drop a couple of needles per frame. 6/frame felt closer to a hailstorm
      // than a Monte Carlo experiment — 2 lets the eye follow individual throws
      // and the π estimate visibly drift toward 3.14 as samples accumulate.
      const PER_FRAME = 2;
      for (let i = 0; i < PER_FRAME; i++) {
        dropOne(ctx, W, H, D, ELL, (cross) => {
          dropsRef.current += 1;
          if (cross) crossingsRef.current += 1;
        });
      }
      // Fade older needles slightly so the canvas does not saturate.
      // (We do this every ~60 frames.)
      if (dropsRef.current % (PER_FRAME * 30) === 0) {
        ctx.fillStyle = "rgba(6,7,13,0.18)";
        ctx.fillRect(0, 0, W, H);
        drawLines(ctx, W, H, D);
      }
      setDrops(dropsRef.current);
      setCrossings(crossingsRef.current);
      onSample?.(dropsRef.current, crossingsRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, onSample]);

  // When reduced motion is requested, stop the loop and paint one static
  // batch of needles so the figure still tells its story without animation.
  useEffect(() => {
    if (!reduced) return;
    setRunning(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    ctx.fillStyle = palette.canvas.bg;
    ctx.fillRect(0, 0, W, H);
    drawLines(ctx, W, H, D);
    const SEED = 300;
    let c = 0;
    for (let i = 0; i < SEED; i++) {
      dropOne(ctx, W, H, D, ELL, (cross) => {
        if (cross) c += 1;
      });
    }
    dropsRef.current = SEED;
    crossingsRef.current = c;
    setDrops(SEED);
    setCrossings(c);
  }, [reduced]);

  const reset = () => {
    dropsRef.current = 0;
    crossingsRef.current = 0;
    setDrops(0);
    setCrossings(0);
    setResetTick((t) => t + 1);
  };

  const fastForward = () => {
    // Simulate 1000 drops in a tight batch without animating each one;
    // we still draw the last hundred or so for visual continuity.
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    // Clear and redraw the lines once so the page does not turn into
    // pure pigment.
    ctx.fillStyle = palette.canvas.bg;
    ctx.fillRect(0, 0, W, H);
    drawLines(ctx, W, H, D);
    for (let i = 0; i < 1000; i++) {
      // Only draw the last 80 to keep the canvas readable.
      const draw = i >= 920;
      if (draw) {
        dropOne(ctx, W, H, D, ELL, (cross) => {
          dropsRef.current += 1;
          if (cross) crossingsRef.current += 1;
        });
      } else {
        // Probabilistic crossing without drawing. Same unbiased test as
        // dropOne: sample the centre over whole line-periods, then compare the
        // distance to the nearest grid line against the vertical half-extent.
        const rows = Math.max(1, Math.floor(H / D));
        const cy = Math.random() * rows * D;
        const theta = Math.random() * Math.PI;
        const half = (ELL / 2) * Math.sin(theta);
        const yMod = ((cy % D) + D) % D;
        const dist = Math.min(yMod, D - yMod);
        const cross = dist <= half;
        dropsRef.current += 1;
        if (cross) crossingsRef.current += 1;
      }
    }
    setDrops(dropsRef.current);
    setCrossings(crossingsRef.current);
    onSample?.(dropsRef.current, crossingsRef.current);
  };

  const piEstimate = crossings > 0 ? (2 * ELL * drops) / (D * crossings) : 0;
  const trueDelta = crossings > 0 ? Math.abs(piEstimate - Math.PI) : 0;

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>
      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-12">
        <div className="flex justify-center md:col-span-7">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={caption}
            className="hairline block rounded-md border"
            style={{ width: 360, height: 280, maxWidth: "100%", background: palette.canvas.bg }}
          />
        </div>
        <div className="space-y-4 md:col-span-5">
          <div className="space-y-3">
            <Stat label={dropsLabel} value={drops.toLocaleString()} color="text-signal-cyan" />
            <Stat
              label={crossingsLabel}
              value={crossings.toLocaleString()}
              color="text-signal-violet"
            />
            <div className="space-y-1.5 pt-1">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {estimateLabel}
              </div>
              <div className="math-italic text-3xl leading-none text-signal-amber">
                {crossings > 0 ? piEstimate.toFixed(5) : "—"}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
                {trueLabel} · 3.14159 · Δ {crossings > 0 ? trueDelta.toFixed(5) : "—"}
              </div>
            </div>
          </div>
          <div className="hairline flex flex-wrap items-center gap-2 border-t pt-3">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber transition-colors hover:text-ink-100"
            >
              {running ? pauseLabel : playLabel}
            </button>
            <span className="text-ink-500">·</span>
            <button
              type="button"
              onClick={fastForward}
              className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan transition-colors hover:text-ink-100"
            >
              {fastForwardLabel}
            </button>
            <span className="text-ink-500">·</span>
            <button
              type="button"
              onClick={reset}
              className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose transition-colors hover:text-ink-100"
            >
              {resetLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">{label}</span>
      <span className={`font-mono text-lg ${color}`}>{value}</span>
    </div>
  );
}

// --- drawing helpers ----------------------------------------------------

function computeLines(H: number, d: number): number[] {
  const lines: number[] = [];
  // Lines at every multiple of d, including y = 0: the visible copy of the
  // virtual infinite grid the crossing test samples against. Drawing from 0
  // keeps the picture consistent with the modular test in dropOne.
  for (let y = 0; y < H; y += d) lines.push(y);
  return lines;
}

function drawLines(ctx: CanvasRenderingContext2D, W: number, H: number, d: number) {
  ctx.strokeStyle = "rgba(176,182,200,0.32)";
  ctx.lineWidth = 0.8;
  const lines = computeLines(H, d);
  for (const y of lines) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
}

function drawBackground(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = palette.canvas.bg;
  ctx.fillRect(0, 0, W, H);
  drawLines(ctx, W, H, D);
}

function dropOne(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  d: number,
  ell: number,
  onResult: (cross: boolean) => void,
) {
  const cx = Math.random() * W;
  // Sample the centre over a whole number of line-periods so y mod d is truly
  // uniform. Over the full canvas height it is not (H is not a multiple of d),
  // which would leave the crossing probability, and thus π, permanently biased.
  const rows = Math.max(1, Math.floor(H / d));
  const cy = Math.random() * rows * d;
  const theta = Math.random() * Math.PI;
  const dx = (ell / 2) * Math.cos(theta);
  const dy = (ell / 2) * Math.sin(theta);
  // Crossing = distance to the nearest line of the grid at every multiple of d
  // (line at y = 0 included) is within the needle's vertical half-extent.
  const yMod = ((cy % d) + d) % d;
  const dist = Math.min(yMod, d - yMod);
  const cross = dist <= Math.abs(dy);

  ctx.strokeStyle = cross ? palette.signal.amber : "rgba(176,182,200,0.55)";
  ctx.fillStyle = cross ? palette.signal.amber : "rgba(176,182,200,0.55)";
  ctx.lineWidth = cross ? 1.4 : 1.1;
  ctx.beginPath();
  ctx.moveTo(cx - dx, cy - dy);
  ctx.lineTo(cx + dx, cy + dy);
  ctx.stroke();

  // Tiny endpoint dots so individual needles are easier to spot.
  ctx.beginPath();
  ctx.arc(cx, cy, 0.9, 0, Math.PI * 2);
  ctx.fill();

  onResult(cross);
}
