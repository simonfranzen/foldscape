"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Inline live demo: a small r-slider that drives two synchronized canvases.
// Left canvas: time series xₙ (last ~120 iterations after a burn-in). Right
// canvas: cobweb plot — the parabola y = r·x·(1−x) with the staircase
// y=x, drawn live as r moves. The animation auto-runs (rAF) so the user
// sees the orbit evolve even without touching the slider. Under
// prefers-reduced-motion the loop is skipped and a single static frame of
// the full buffered orbit is painted instead (repo a11y invariant).

interface Props {
  caption?: string;
  cobwebCaption?: string;
  rAriaLabel?: string;
  initialR?: number;
}

const W = 360;
const H = 100;
const COBWEB_SIZE = 160;
const BURN_IN = 200;
const SHOW = 120;

export function LogisticRTimeSeries({
  caption = "Time series · xₙ",
  cobwebCaption = "Cobweb · y = r·x·(1−x)",
  rAriaLabel = "Growth rate r",
  initialR = 3.7,
}: Props) {
  const seriesRef = useRef<HTMLCanvasElement | null>(null);
  const cobwebRef = useRef<HTMLCanvasElement | null>(null);
  const [r, setR] = useState(initialR);
  const rRef = useRef(r);
  rRef.current = r;
  const dpr = useDpr();
  const dprRef = useRef(dpr);
  dprRef.current = dpr;

  // Track prefers-reduced-motion reactively so the canvas can freeze/thaw
  // when the OS setting flips without a remount.
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Time-series canvas: redraw every animation frame using the current r.
  // We shift the buffer one step left and append a new iterate so the
  // orbit visibly streams across the canvas. dpr is a dependency so the
  // backing store re-scales when the window moves to a different-DPR screen.
  useEffect(() => {
    const canvas = seriesRef.current;
    if (!canvas) return;
    const dpr = dprRef.current;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Rolling buffer of recent x values.
    const buf: number[] = [];
    let x = 0.2;
    // Burn in once at mount.
    for (let k = 0; k < BURN_IN; k++) x = rRef.current * x * (1 - x);
    for (let k = 0; k < SHOW; k++) {
      buf.push(x);
      x = rRef.current * x * (1 - x);
    }

    const paint = () => {
      // Background.
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // Grid: y = 0, 0.5, 1.
      ctx.strokeStyle = "rgba(138,144,164,0.15)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const yy = (i / 4) * H;
        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(W, yy);
        ctx.stroke();
      }

      // Series.
      ctx.strokeStyle = "rgba(255, 122, 182, 0.85)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let i = 0; i < buf.length; i++) {
        const px = (i / (SHOW - 1)) * W;
        const py = (1 - buf[i]) * H;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Dots, recent ones brighter.
      ctx.fillStyle = palette.signal.rose;
      for (let i = 0; i < buf.length; i++) {
        const px = (i / (SHOW - 1)) * W;
        const py = (1 - buf[i]) * H;
        const alpha = 0.35 + 0.65 * (i / SHOW);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(px, py, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    // Reduced motion: paint one static frame of the buffered orbit, no loop.
    if (reducedMotion) {
      paint();
      return;
    }

    let raf = 0;
    let lastT = 0;
    const STEP_MS = 60; // one iteration every 60 ms — slow enough to read

    const draw = (t: number) => {
      if (t - lastT > STEP_MS) {
        lastT = t;
        const rNow = rRef.current;
        buf.push(x);
        if (buf.length > SHOW) buf.shift();
        x = rNow * x * (1 - x);
        // Numerical safety: if it diverges (shouldn't for r ≤ 4) reset.
        if (!Number.isFinite(x) || x < 0 || x > 1) {
          x = 0.2;
          for (let k = 0; k < BURN_IN; k++) x = rNow * x * (1 - x);
        }
      }
      paint();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, dpr]);

  // Cobweb canvas: pure function of r (no animation needed). Redraw whenever
  // r or dpr changes.
  useEffect(() => {
    const canvas = cobwebRef.current;
    if (!canvas) return;
    const dpr = dprRef.current;
    const S = COBWEB_SIZE;
    canvas.width = Math.floor(S * dpr);
    canvas.height = Math.floor(S * dpr);
    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = palette.canvas.bg;
    ctx.fillRect(0, 0, S, S);

    // y = x diagonal.
    ctx.strokeStyle = "rgba(138,144,164,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, S);
    ctx.lineTo(S, 0);
    ctx.stroke();

    // Parabola y = r·x·(1−x).
    ctx.strokeStyle = palette.signal.cyan;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const x = i / 200;
      const y = r * x * (1 - x);
      const px = x * S;
      const py = (1 - y) * S;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Cobweb staircase: 150 iterations from x = 0.2.
    let x = 0.2;
    let y = r * x * (1 - x);
    ctx.strokeStyle = "rgba(255, 209, 102, 0.7)";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(x * S, S);
    ctx.lineTo(x * S, (1 - y) * S);
    for (let k = 0; k < 150; k++) {
      // Horizontal step to diagonal.
      ctx.lineTo(y * S, (1 - y) * S);
      // Vertical step to parabola.
      const ny = r * y * (1 - y);
      ctx.lineTo(y * S, (1 - ny) * S);
      x = y;
      y = ny;
    }
    ctx.stroke();
  }, [r, dpr]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5 md:p-6">
      <div className="flex flex-col items-start gap-5 md:flex-row">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
            {caption}
          </div>
          <canvas
            ref={seriesRef}
            role="img"
            aria-label={caption}
            className="hairline h-[100px] w-full max-w-[360px] rounded-md border bg-ink-950/80"
          />
        </div>
        <div className="shrink-0 space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
            {cobwebCaption}
          </div>
          <canvas
            ref={cobwebRef}
            role="img"
            aria-label={cobwebCaption}
            style={{ width: COBWEB_SIZE, height: COBWEB_SIZE }}
            className="hairline rounded-md border bg-ink-950/80"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span className="text-[10px] uppercase tracking-widest2 text-ink-300">r</span>
          <span className="text-signal-rose">{r.toFixed(4)}</span>
        </div>
        <input
          type="range"
          aria-label={rAriaLabel}
          value={r}
          min={2.5}
          max={4.0}
          step={0.0005}
          onChange={(e) => setR(parseFloat(e.target.value))}
          className="w-full accent-signal-rose"
        />
        <div className="flex justify-between font-mono text-[10px] text-ink-500">
          <span>2.5</span>
          <span>3.0</span>
          <span>3.5</span>
          <span>4.0</span>
        </div>
      </div>
    </div>
  );
}
