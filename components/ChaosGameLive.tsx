"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Inline, compact live chaos-game animator for the story page.
// Smaller than the Explorer, intentionally — just enough to feel the rule.
// Sliders: number of vertices (3..7), jump ratio (0.30..0.72), no-repeat toggle.

// Draw colours derived from the shared palette so the trace matches the
// signal-* swatches used everywhere else (no drifting rgba literals).
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const COLORS = {
  cyan: hexToRgba(palette.signal.cyan, 0.55),
  violet: hexToRgba(palette.signal.violet, 0.55),
  amber: hexToRgba(palette.signal.amber, 0.55),
  rose: hexToRgba(palette.signal.rose, 0.55),
} as const;

const OUTLINE = hexToRgba(palette.signal.amber, 0.22);
const VERTEX = hexToRgba(palette.signal.amber, 0.7);

// Magic jump ratio for a regular n-gon. The update is p' = p + r·(v − p), so
// each map's sub-copy shrinks by sₙ = 1/(2·(1 + Σ_{k=1..⌊n/4⌋} cos(2πk/n))),
// and the ratio that makes the copies just kiss (a clean self-similar
// attractor, not a filled polygon) is rₙ = 1 − sₙ: 0.5, 0.5, 1/φ, 2/3, 0.692,
// 1/√2 for n = 3..8. The old 1/(1+2cos(π/n)) was only correct at n = 3.
function magicRatio(n: number): number {
  let sum = 0;
  for (let k = 1; k <= Math.floor(n / 4); k++) {
    sum += Math.cos((2 * Math.PI * k) / n);
  }
  const s = 1 / (2 * (1 + sum));
  return 1 - s;
}

function polygonLayout(n: number, W: number, H: number) {
  const cx = W / 2;
  const cy = H / 2 + 4;
  const R = Math.min(W, H) * 0.42;
  const vx: number[] = [];
  const vy: number[] = [];
  for (let i = 0; i < n; i++) {
    const theta = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    vx.push(cx + R * Math.cos(theta));
    vy.push(cy + R * Math.sin(theta));
  }
  return { vx, vy };
}

interface Props {
  caption: string;
  verticesLabel: string;
  ratioLabel: string;
  noRepeatLabel: string;
  magicLabel: string;
  resetLabel: string;
  pointsLabel: (n: number) => string;
}

export function ChaosGameLive({
  caption,
  verticesLabel,
  ratioLabel,
  noRepeatLabel,
  magicLabel,
  resetLabel,
  pointsLabel,
}: Props) {
  const dpr = useDpr();
  const uid = useId();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [n, setN] = useState(3);
  const [ratio, setRatio] = useState(0.5);
  const [noRepeat, setNoRepeat] = useState(false);
  const [points, setPoints] = useState(0);
  const [resetTick, setResetTick] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const historyRef = useRef<number[]>([]);
  const countRef = useRef(0);

  // Track prefers-reduced-motion live (re-subscribe so an OS toggle takes
  // effect without a reload), matching the rest of the repo's canvases.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Clear and reseed when the rule changes
  useEffect(() => {
    countRef.current = 0;
    historyRef.current = [];
    posRef.current = { x: 0, y: 0 };
    setPoints(0);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = palette.canvas.bg;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    // sketch polygon outline
    const { vx, vy } = polygonLayout(n, canvas.clientWidth, canvas.clientHeight);
    ctx.strokeStyle = OUTLINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      if (i === 0) ctx.moveTo(vx[i], vy[i]);
      else ctx.lineTo(vx[i], vy[i]);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = VERTEX;
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.arc(vx[i], vy[i], 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [n, ratio, noRepeat, resetTick]);

  // Set up canvas DPR and animation loop
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
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);
      const { vx, vy } = polygonLayout(n, W, H);
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        if (i === 0) ctx.moveTo(vx[i], vy[i]);
        else ctx.lineTo(vx[i], vy[i]);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = VERTEX;
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.arc(vx[i], vy[i], 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => ro.disconnect();

    // Cycle colour roughly with vertex count so the trace stays lively
    const dotColors = [COLORS.cyan, COLORS.violet, COLORS.amber, COLORS.rose, COLORS.cyan];
    const fillStyle = dotColors[(n - 3) % dotColors.length] ?? COLORS.cyan;

    // Point budget: stop once the fractal is fully dense so we don't re-render
    // React state 60×/s forever (and reduced-motion users never loop at all).
    const BUDGET = 600_000;

    const drawBatch = (batch: number) => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      const { vx, vy } = polygonLayout(n, W, H);
      let { x, y } = posRef.current;
      if (x === 0 && y === 0) {
        x = W / 2;
        y = H / 2;
      }
      const hist = historyRef.current;
      ctx.fillStyle = fillStyle;
      for (let i = 0; i < batch; i++) {
        let pick: number;
        let attempts = 0;
        do {
          pick = (Math.random() * n) | 0;
          attempts++;
          if (attempts > 32) break;
        } while (noRepeat && hist.length > 0 && pick === hist[0]);
        x = x + ratio * (vx[pick] - x);
        y = y + ratio * (vy[pick] - y);
        hist.unshift(pick);
        if (hist.length > 2) hist.pop();
        ctx.fillRect(x, y, 1, 1);
      }
      posRef.current = { x, y };
      countRef.current += batch;
    };

    // Reduced motion: draw one complete static frame, never animate.
    if (reduceMotion) {
      drawBatch(60_000);
      setPoints(countRef.current);
      return () => ro.disconnect();
    }

    let raf = 0;
    // 7k points/frame lets the fractal accumulate visibly over a couple of
    // seconds while still filling out cleanly, unlike an instant 20k dump.
    const SPEED = 7000;

    const tick = () => {
      drawBatch(SPEED);
      setPoints(countRef.current);
      if (countRef.current >= BUDGET) return; // settled — stop the loop
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [n, ratio, noRepeat, resetTick, dpr, reduceMotion]);

  const mr = magicRatio(n);

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
            className="hairline block rounded-md border bg-ink-950"
            style={{ width: 360, height: 360, maxWidth: "100%" }}
          />
        </div>
        <div className="space-y-4 md:col-span-5">
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor={`${uid}-vertices`}
                className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
              >
                {verticesLabel}
              </label>
              <span className="font-mono text-sm text-signal-amber">{n}</span>
            </div>
            <input
              id={`${uid}-vertices`}
              type="range"
              min={3}
              max={7}
              step={1}
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor={`${uid}-ratio`}
                className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
              >
                {ratioLabel}
              </label>
              <span className="font-mono text-sm text-signal-amber">{ratio.toFixed(3)}</span>
            </div>
            <input
              id={`${uid}-ratio`}
              type="range"
              min={0.3}
              max={0.72}
              step={0.005}
              value={ratio}
              onChange={(e) => setRatio(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <button
              type="button"
              onClick={() => setRatio(parseFloat(mr.toFixed(4)))}
              className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan transition-colors hover:text-ink-100"
            >
              {magicLabel} · {mr.toFixed(4)}
            </button>
          </div>
          <label className="flex cursor-pointer select-none items-center gap-3">
            <input
              type="checkbox"
              checked={noRepeat}
              onChange={(e) => setNoRepeat(e.target.checked)}
              className="accent-signal-amber"
            />
            <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {noRepeatLabel}
            </span>
          </label>
          <div className="hairline flex items-center justify-between border-t pt-2">
            <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
              {pointsLabel(points)}
            </span>
            <button
              type="button"
              onClick={() => setResetTick((t) => t + 1)}
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
