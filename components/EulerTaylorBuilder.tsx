"use client";

import { useEffect, useRef, useState } from "react";

// Builds three partial Taylor sums in parallel:
//   eˣ  ≈ Σₖ xᵏ / k!
//   cos x ≈ Σₖ (−1)ᵏ x^(2k) / (2k)!
//   sin x ≈ Σₖ (−1)ᵏ x^(2k+1) / (2k+1)!
// The slider sets N (the number of terms kept). We plot the true curves
// faintly and the partial sums as bright lines.
//
// Below the plot, a small read-out shows what happens when you feed x = iπ
// into the partial exp series — the running complex sum converges to −1.

interface Props {
  caption: string;
  termsLabel: string;
  expLabel: string;
  cosLabel: string;
  sinLabel: string;
  walkLabel: string;
}

const W = 360;
const H = 200;
const X_MIN = -Math.PI;
const X_MAX = Math.PI;

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

// Partial Taylor sum of eˣ with N+1 terms (k = 0..N).
function expPartial(x: number, N: number): number {
  let sum = 0;
  for (let k = 0; k <= N; k++) sum += Math.pow(x, k) / factorial(k);
  return sum;
}

function cosPartial(x: number, N: number): number {
  let sum = 0;
  for (let k = 0; k <= N; k++) {
    sum += ((k % 2 === 0 ? 1 : -1) * Math.pow(x, 2 * k)) / factorial(2 * k);
  }
  return sum;
}

function sinPartial(x: number, N: number): number {
  let sum = 0;
  for (let k = 0; k <= N; k++) {
    sum += ((k % 2 === 0 ? 1 : -1) * Math.pow(x, 2 * k + 1)) / factorial(2 * k + 1);
  }
  return sum;
}

// Partial e^(iπ) sum, tracking real/imag separately. Sum_{k=0..N} (iπ)^k / k!
function expIPiPartial(N: number): { re: number; im: number } {
  let re = 0;
  let im = 0;
  // (iπ)^k cycles: k mod 4 = 0 → π^k (real), 1 → iπ^k (imag), 2 → -π^k, 3 → -iπ^k
  for (let k = 0; k <= N; k++) {
    const mag = Math.pow(Math.PI, k) / factorial(k);
    switch (k % 4) {
      case 0:
        re += mag;
        break;
      case 1:
        im += mag;
        break;
      case 2:
        re -= mag;
        break;
      case 3:
        im -= mag;
        break;
    }
  }
  return { re, im };
}

export function EulerTaylorBuilder({
  caption,
  termsLabel,
  expLabel,
  cosLabel,
  sinLabel,
  walkLabel,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Default at N=2 so the curves already show partial convergence but still
  // have visible room to grow as the user slides up. (Default of 4 used to
  // sit at the high end of the interesting range — Taylor converges so fast
  // on [-π, π] that beyond N≈5 the curves move by < 1 px and the slider
  // felt unresponsive.)
  const [N, setN] = useState(2);

  useEffect(() => {
    const cnv = canvasRef.current;
    if (!cnv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cnv.width = W * dpr;
    cnv.height = H * dpr;
    const ctx = cnv.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = "#06070d";
    ctx.fillRect(0, 0, W, H);

    // Plot range: x in [-π, π], y in [-2.5, 4]
    const yMin = -2.5;
    const yMax = 4;
    const xToPx = (x: number) => ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 24) + 12;
    const yToPx = (y: number) => H - 12 - ((y - yMin) / (yMax - yMin)) * (H - 24);

    // Grid + axes
    ctx.strokeStyle = "rgba(138,144,164,0.10)";
    ctx.lineWidth = 1;
    for (let i = -3; i <= 4; i++) {
      const py = yToPx(i);
      ctx.beginPath();
      ctx.moveTo(12, py);
      ctx.lineTo(W - 12, py);
      ctx.stroke();
    }
    // x = 0 axis
    ctx.strokeStyle = "rgba(138,144,164,0.45)";
    ctx.beginPath();
    ctx.moveTo(xToPx(0), 4);
    ctx.lineTo(xToPx(0), H - 4);
    ctx.stroke();
    // y = 0 axis
    ctx.beginPath();
    ctx.moveTo(8, yToPx(0));
    ctx.lineTo(W - 8, yToPx(0));
    ctx.stroke();

    // Helper to plot a function on [X_MIN, X_MAX]
    const plot = (fn: (x: number) => number, color: string, width: number, dashed = false) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      if (dashed) ctx.setLineDash([3, 3]);
      else ctx.setLineDash([]);
      ctx.beginPath();
      let started = false;
      const steps = 240;
      for (let i = 0; i <= steps; i++) {
        const x = X_MIN + (i / steps) * (X_MAX - X_MIN);
        const y = fn(x);
        if (!Number.isFinite(y)) {
          started = false;
          continue;
        }
        // Clip wild divergence to avoid garbage strokes off-canvas.
        if (y > yMax + 6 || y < yMin - 6) {
          started = false;
          continue;
        }
        const px = xToPx(x);
        const py = yToPx(y);
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // True curves (faint, dashed)
    plot((x) => Math.exp(x), "rgba(255,209,102,0.25)", 1.2, true);
    plot((x) => Math.cos(x), "rgba(125,243,255,0.25)", 1.2, true);
    plot((x) => Math.sin(x), "rgba(179,136,255,0.25)", 1.2, true);

    // Partial Taylor sums (bright, solid)
    plot((x) => expPartial(x, N), "#ffd166", 1.8);
    plot((x) => cosPartial(x, N), "#7df3ff", 1.8);
    plot((x) => sinPartial(x, N), "#b388ff", 1.8);

    // Mark x = π
    ctx.strokeStyle = "rgba(255,122,182,0.6)";
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(xToPx(Math.PI), 4);
    ctx.lineTo(xToPx(Math.PI), H - 4);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#ff7ab6";
    ctx.font = "10px ui-monospace, monospace";
    ctx.textAlign = "right";
    ctx.fillText("π", xToPx(Math.PI) - 4, 14);
  }, [N]);

  // The complex walk e^(iπ) partial sum at current N
  const walk = expIPiPartial(N);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          style={{ width: W, height: H }}
          className="hairline rounded-lg border"
          aria-label="Taylor partial sums for exp, cos, sin"
        />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-10 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          N
        </span>
        <input
          type="range"
          min={0}
          max={15}
          step={1}
          value={N}
          onChange={(e) => setN(parseInt(e.target.value, 10))}
          className="flex-1 accent-signal-amber"
          aria-label="number of Taylor terms"
        />
        {/* The prose talks about "the first N+1 terms" because the sum runs
            k = 0..N. So the label has to display N+1, not N — otherwise
            "15 Terme" at N=15 contradicts "die ersten N+1 Glieder". */}
        <span className="w-24 text-right font-mono text-xs text-signal-amber">
          {N + 1} {termsLabel}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-widest2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-signal-amber" />
          <span className="text-ink-300">{expLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-signal-cyan" />
          <span className="text-ink-300">{cosLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-signal-violet" />
          <span className="text-ink-300">{sinLabel}</span>
        </div>
      </div>
      <div className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3 font-mono text-xs">
        <div className="text-[10px] uppercase tracking-widest2 text-signal-rose">{walkLabel}</div>
        <div className="text-ink-100">
          Σ<sub>k=0..{N}</sub> (iπ)ᵏ / k! ={" "}
          <span className="text-signal-amber">
            {walk.re.toFixed(4)}
            {walk.im >= 0 ? " + " : " − "}
            {Math.abs(walk.im).toFixed(4)}i
          </span>
        </div>
        <div className="text-[10px] text-ink-400">→ −1 + 0i as N → ∞</div>
      </div>
    </div>
  );
}
