"use client";

import { useEffect, useRef, useState } from "react";

// Sensitive dependence on initial conditions for the logistic map.
// Two parallel orbits start at x₀ and x₀ + 10⁻⁶ and advance one iteration
// per animation tick. At r ≈ 3.9 the two trajectories visually separate
// within ~25 iterations and stay uncorrelated thereafter.

interface Props {
  captionA?: string;
  captionB?: string;
  playLabel?: string;
  pauseLabel?: string;
  resetLabel?: string;
  divergenceLabel?: string;
  iterLabel?: string;
  rLabel?: string;
}

const EPSILON = 1e-6;
const X0 = 0.2;
const MAX_ITER = 220;
const STEP_MS = 90;
const W = 360;
const H = 100;

export function LogisticDivergeDemo({
  captionA,
  captionB,
  playLabel,
  pauseLabel,
  resetLabel,
  divergenceLabel,
  iterLabel,
  rLabel,
}: Props) {
  const canvasARef = useRef<HTMLCanvasElement | null>(null);
  const canvasBRef = useRef<HTMLCanvasElement | null>(null);
  const [r, setR] = useState(3.9);
  const [running, setRunning] = useState(true);
  const [resetTick, setResetTick] = useState(0);
  const [stats, setStats] = useState({ n: 0, dist: EPSILON });

  const rRef = useRef(r);
  rRef.current = r;
  const runningRef = useRef(running);
  runningRef.current = running;

  useEffect(() => {
    const cA = canvasARef.current;
    const cB = canvasBRef.current;
    if (!cA || !cB) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    [cA, cB].forEach((c) => {
      c.width = Math.floor(W * dpr);
      c.height = Math.floor(H * dpr);
    });
    const ctxA = cA.getContext("2d")!;
    const ctxB = cB.getContext("2d")!;
    ctxA.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxB.setTransform(dpr, 0, 0, dpr, 0, 0);

    let xa = X0;
    let xb = X0 + EPSILON;
    const histA: number[] = [xa];
    const histB: number[] = [xb];
    let n = 0;
    let lastT = 0;
    let raf = 0;

    const drawBackground = (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(138,144,164,0.15)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const yy = (i / 4) * H;
        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(W, yy);
        ctx.stroke();
      }
    };

    const drawHist = (
      ctx: CanvasRenderingContext2D,
      hist: number[],
      lineColor: string,
      dotColor: string,
    ) => {
      drawBackground(ctx);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      const total = MAX_ITER;
      for (let i = 0; i < hist.length; i++) {
        const px = (i / (total - 1)) * W;
        const py = (1 - hist[i]) * H;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = dotColor;
      for (let i = 0; i < hist.length; i++) {
        const px = (i / (total - 1)) * W;
        const py = (1 - hist[i]) * H;
        ctx.beginPath();
        ctx.arc(px, py, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    drawHist(ctxA, histA, "rgba(125,243,255,0.85)", "#7df3ff");
    drawHist(ctxB, histB, "rgba(179,136,255,0.85)", "#b388ff");

    const step = (t: number) => {
      if (runningRef.current && t - lastT > STEP_MS) {
        lastT = t;
        if (n < MAX_ITER - 1) {
          const rNow = rRef.current;
          xa = rNow * xa * (1 - xa);
          xb = rNow * xb * (1 - xb);
          histA.push(xa);
          histB.push(xb);
          n++;
          drawHist(ctxA, histA, "rgba(125,243,255,0.85)", "#7df3ff");
          drawHist(ctxB, histB, "rgba(179,136,255,0.85)", "#b388ff");
          setStats({ n, dist: Math.abs(xa - xb) });
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [resetTick]);

  const reset = () => {
    setStats({ n: 0, dist: EPSILON });
    setResetTick((x) => x + 1);
  };

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5 md:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
            {captionA ?? "Orbit A · x₀ = 0.200000"}
          </div>
          <canvas
            ref={canvasARef}
            style={{ width: W, height: H }}
            className="hairline h-[100px] w-full max-w-[360px] rounded-md border bg-ink-950/80"
          />
        </div>
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
            {captionB ?? "Orbit B · x₀ = 0.200001"}
          </div>
          <canvas
            ref={canvasBRef}
            style={{ width: W, height: H }}
            className="hairline h-[100px] w-full max-w-[360px] rounded-md border bg-ink-950/80"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span className="text-[10px] uppercase tracking-widest2 text-ink-300">
            {rLabel ?? "r"}
          </span>
          <span className="text-signal-rose">{r.toFixed(4)}</span>
        </div>
        <input
          type="range"
          value={r}
          min={2.5}
          max={4.0}
          step={0.0005}
          onChange={(e) => {
            setR(parseFloat(e.target.value));
            reset();
          }}
          className="w-full accent-signal-rose"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => setRunning((p) => !p)}
          className="hairline rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-signal-rose transition-colors hover:border-signal-rose/60"
        >
          {running ? (pauseLabel ?? "Pause") : (playLabel ?? "Play")}
        </button>
        <button
          type="button"
          onClick={reset}
          className="hairline rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50"
        >
          {resetLabel ?? "Reset"}
        </button>
        <div className="ml-auto flex gap-4 font-mono text-[11px] text-ink-300">
          <div>
            {iterLabel ?? "n"} · <span className="text-ink-100">{stats.n}</span>
          </div>
          <div>
            {divergenceLabel ?? "|Δ|"} ·{" "}
            <span className="text-signal-rose">{stats.dist.toExponential(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
