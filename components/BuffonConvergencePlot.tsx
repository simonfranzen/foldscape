"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// A small canvas (~360×140) that plots the running estimate of π versus
// the number of drops, with a horizontal line at the true π for
// comparison. The plot runs its own batched Buffon simulation governed
// by the N slider (100..100000); each time N changes we replay a fresh
// run and animate the curve into view.

interface Props {
  caption: string;
  nLabel: string;
  yLabel: string;
  xLabel: string;
  finalEstimateLabel: string;
}

export function BuffonConvergencePlot({
  caption,
  nLabel,
  yLabel,
  xLabel,
  finalEstimateLabel,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [logN, setLogN] = useState(3); // 10^3 = 1000 default
  const [finalEstimate, setFinalEstimate] = useState<number | null>(null);
  const dpr = useDpr();

  const N = Math.round(Math.pow(10, logN));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W0 = canvas.clientWidth;
    const H0 = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(W0 * dpr));
    canvas.height = Math.max(1, Math.floor(H0 * dpr));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Run one Buffon trial of N drops up-front, sampling the estimate at
    // ~120 log-spaced checkpoints so the curve looks natural across the
    // wide range. ell = 0.85 d to match the live simulator.
    const ELL = 0.85;
    const D = 1;
    let drops = 0;
    let crossings = 0;
    const samples: Array<{ n: number; est: number }> = [];
    const checkpoints = new Set<number>();
    const NSAMPLES = 160;
    for (let i = 1; i <= NSAMPLES; i++) {
      const n = Math.max(1, Math.round(Math.pow(N, i / NSAMPLES)));
      checkpoints.add(n);
    }
    let nextCheckpoint = -1;
    const sortedCheckpoints = [...checkpoints].sort((a, b) => a - b);
    let cpIdx = 0;
    nextCheckpoint = sortedCheckpoints[cpIdx] ?? -1;

    for (let i = 0; i < N; i++) {
      const cy = Math.random() * D;
      const theta = Math.random() * Math.PI;
      const half = (ELL / 2) * Math.sin(theta);
      // One line at y = 0 and y = D (mod). The needle crosses if
      // cy - half <= 0 (top line) or cy + half >= D (bottom line).
      if (cy - half <= 0 || cy + half >= D) crossings += 1;
      drops += 1;
      if (drops === nextCheckpoint) {
        const est = crossings > 0 ? (2 * ELL * drops) / (D * crossings) : 0;
        samples.push({ n: drops, est });
        cpIdx += 1;
        nextCheckpoint = sortedCheckpoints[cpIdx] ?? -1;
      }
    }
    const last = samples[samples.length - 1];
    setFinalEstimate(last ? last.est : null);

    drawPlot(ctx, W0, H0, samples, N);
  }, [N, dpr]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>
      <div className="space-y-3">
        <div className="relative">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={caption}
            className="hairline block w-full rounded-md border"
            style={{ height: 140, background: palette.canvas.bg }}
          />
          <div className="absolute left-3 top-2 font-mono text-[9px] uppercase tracking-widest2 text-signal-amber/80">
            π · 3.14159
          </div>
          <div className="absolute right-3 top-2 font-mono text-[9px] uppercase tracking-widest2 text-ink-400">
            {yLabel}
          </div>
          <div className="absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-widest2 text-ink-400">
            {xLabel}
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="buffon-convergence-n"
              className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
            >
              {nLabel}
            </label>
            <span className="font-mono text-sm text-signal-amber">{N.toLocaleString()}</span>
          </div>
          <input
            id="buffon-convergence-n"
            type="range"
            min={2}
            max={5}
            step={0.05}
            value={logN}
            onChange={(e) => setLogN(parseFloat(e.target.value))}
            aria-label={nLabel}
            className="w-full accent-signal-amber"
          />
        </div>
        <div className="hairline flex items-baseline justify-between border-t pt-2">
          <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
            {finalEstimateLabel}
          </span>
          <span className="math-italic text-lg text-signal-amber">
            {finalEstimate !== null ? finalEstimate.toFixed(5) : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

function drawPlot(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  samples: Array<{ n: number; est: number }>,
  N: number,
) {
  ctx.fillStyle = palette.canvas.bg;
  ctx.fillRect(0, 0, W, H);

  const PAD_L = 28;
  const PAD_R = 12;
  const PAD_T = 14;
  const PAD_B = 18;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  // y axis: 2.5 to 3.8 always (so π=3.14159 sits nicely).
  const yMin = 2.5;
  const yMax = 3.8;
  const yOf = (v: number) => PAD_T + plotH * (1 - (v - yMin) / (yMax - yMin));
  // x axis: log scale from 1 to N.
  const xOf = (n: number) => PAD_L + plotW * (Math.log(n) / Math.log(N));

  // Faint grid.
  ctx.strokeStyle = "rgba(176,182,200,0.10)";
  ctx.lineWidth = 0.5;
  for (let y = 2.6; y <= 3.7; y += 0.2) {
    ctx.beginPath();
    ctx.moveTo(PAD_L, yOf(y));
    ctx.lineTo(W - PAD_R, yOf(y));
    ctx.stroke();
  }

  // The true π reference line.
  ctx.strokeStyle = "rgba(255,209,102,0.55)";
  ctx.setLineDash([3, 3]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD_L, yOf(Math.PI));
  ctx.lineTo(W - PAD_R, yOf(Math.PI));
  ctx.stroke();
  ctx.setLineDash([]);

  // The estimate curve.
  if (samples.length > 0) {
    ctx.strokeStyle = palette.signal.cyan;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    let started = false;
    for (const s of samples) {
      const y = yOf(Math.max(yMin, Math.min(yMax, s.est)));
      const x = xOf(s.n);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Final point marker.
    const last = samples[samples.length - 1];
    ctx.fillStyle = palette.signal.rose;
    ctx.beginPath();
    ctx.arc(xOf(last.n), yOf(Math.max(yMin, Math.min(yMax, last.est))), 2.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // y-axis tick labels (3.14 reference, 3.0, 3.5).
  ctx.fillStyle = "rgba(176,182,200,0.55)";
  ctx.font = "9px ui-monospace, monospace";
  ctx.textAlign = "right";
  ctx.fillText("3.14", PAD_L - 4, yOf(Math.PI) + 3);
  ctx.fillText("3.5", PAD_L - 4, yOf(3.5) + 3);
  ctx.fillText("2.8", PAD_L - 4, yOf(2.8) + 3);

}
