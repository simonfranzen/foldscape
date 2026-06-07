"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Inline interactive for the Riemann story. Plots the image of ζ along the
// critical line s = 1/2 + it for t ∈ [0, t_max], parameterised by a single
// slider for the upper bound. The trace is the curve in the complex plane
// — each loop through the origin marks a non-trivial zero. A small zero
// counter ticks up as the user advances t.
//
// We compute ζ with the alternating-series (Dirichlet eta) representation
//     ζ(s) = (1 / (1 − 2^{1−s})) · Σ_{n=1..N} (−1)^{n+1} / n^s
// because the alternating series converges in the entire half-plane Re(s)
// > 0 (not just Re(s) > 1), which is exactly where the critical line
// lives. N = 200 is enough for t ≲ 60.

type Cx = { re: number; im: number };

const cAdd = (a: Cx, b: Cx): Cx => ({ re: a.re + b.re, im: a.im + b.im });
const cSub = (a: Cx, b: Cx): Cx => ({ re: a.re - b.re, im: a.im - b.im });
const cDiv = (a: Cx, b: Cx): Cx => {
  const d = b.re * b.re + b.im * b.im;
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
};
// n^s = exp(s · log n) for real positive n; exp(x + iy) = e^x (cos y + i sin y).
const nPowS = (n: number, s: Cx): Cx => {
  const logn = Math.log(n);
  const ex = Math.exp(s.re * logn);
  const ang = s.im * logn;
  return { re: ex * Math.cos(ang), im: ex * Math.sin(ang) };
};

// ζ(s) via the eta-series rearrangement. N controls accuracy.
function zeta(s: Cx, N = 200): Cx {
  // eta(s) = Σ (−1)^{n+1} / n^s
  let eta: Cx = { re: 0, im: 0 };
  for (let n = 1; n <= N; n++) {
    const term = cDiv({ re: 1, im: 0 }, nPowS(n, s));
    eta = n % 2 === 1 ? cAdd(eta, term) : cSub(eta, term);
  }
  // 1 − 2^{1−s}, with 2^{1−s} = exp((1−s) · log 2).
  const oneMinusS: Cx = { re: 1 - s.re, im: -s.im };
  const log2 = Math.log(2);
  const ex = Math.exp(oneMinusS.re * log2);
  const ang = oneMinusS.im * log2;
  const twoPow: Cx = { re: ex * Math.cos(ang), im: ex * Math.sin(ang) };
  const denom: Cx = cSub({ re: 1, im: 0 }, twoPow);
  return cDiv(eta, denom);
}

interface Props {
  caption: string;
  tLabel: string;
  zerosFoundLabel: string;
  hintLabel: string;
}

export function RiemannZetaPath({ caption, tLabel, zerosFoundLabel, hintLabel }: Props) {
  const [tMax, setTMax] = useState(35);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute the full trace once per render — cached per tMax value so
  // dragging the slider stays smooth even at N=200, ~3500 samples.
  const trace = useMemo(() => {
    const steps = Math.max(400, Math.floor(tMax * 80));
    const pts: Cx[] = new Array(steps);
    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1)) * tMax;
      pts[i] = zeta({ re: 0.5, im: t }, 200);
    }
    return pts;
  }, [tMax]);

  // Count zeros: a zero is registered each time the trace passes near the
  // origin — operationally, each minimum of |ζ| below a small threshold.
  const zerosFound = useMemo(() => {
    let count = 0;
    let prev = Infinity;
    let prevPrev = Infinity;
    for (const p of trace) {
      const m = Math.hypot(p.re, p.im);
      // Local minimum + below threshold → a zero.
      if (prev < prevPrev && prev < m && prev < 0.15) count++;
      prevPrev = prev;
      prev = m;
    }
    return count;
  }, [trace]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);

      // Frame the plot to fit the trace's bounding box with a margin.
      let minR = Infinity;
      let maxR = -Infinity;
      let minI = Infinity;
      let maxI = -Infinity;
      for (const p of trace) {
        if (p.re < minR) minR = p.re;
        if (p.re > maxR) maxR = p.re;
        if (p.im < minI) minI = p.im;
        if (p.im > maxI) maxI = p.im;
      }
      // Always include origin in the frame so zeros are visually obvious.
      minR = Math.min(minR, -0.5);
      maxR = Math.max(maxR, 0.5);
      minI = Math.min(minI, -0.5);
      maxI = Math.max(maxI, 0.5);
      const spanR = maxR - minR;
      const spanI = maxI - minI;
      const span = Math.max(spanR, spanI) * 1.1;
      const cxC = (minR + maxR) / 2;
      const cyC = (minI + maxI) / 2;
      const cx = W / 2;
      const cy = H / 2;
      const scale = Math.min(W, H) / span;
      const toPx = (z: Cx) => ({
        x: cx + (z.re - cxC) * scale,
        y: cy - (z.im - cyC) * scale,
      });

      // Axes
      ctx.strokeStyle = "rgba(168,171,189,0.18)";
      ctx.lineWidth = 1;
      const ox = toPx({ re: 0, im: 0 });
      ctx.beginPath();
      ctx.moveTo(0, ox.y);
      ctx.lineTo(W, ox.y);
      ctx.moveTo(ox.x, 0);
      ctx.lineTo(ox.x, H);
      ctx.stroke();

      // Trace — colour by parameter t so the curve has a sense of time.
      ctx.lineWidth = 1.4;
      for (let i = 1; i < trace.length; i++) {
        const p0 = toPx(trace[i - 1]);
        const p1 = toPx(trace[i]);
        const t = i / (trace.length - 1);
        const a = 0.35 + 0.6 * t;
        ctx.strokeStyle = `rgba(255,209,102,${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }

      // Mark the origin
      ctx.fillStyle = "#fff5d6";
      ctx.beginPath();
      ctx.arc(ox.x, ox.y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Mark the current head of the trace
      const head = toPx(trace[trace.length - 1]);
      ctx.fillStyle = "rgba(255,209,102,1)";
      ctx.beginPath();
      ctx.arc(head.x, head.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,209,102,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 9, 0, Math.PI * 2);
      ctx.stroke();
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [trace]);

  return (
    <div className="hairline glass space-y-3 rounded-2xl border p-5 md:p-6">
      <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        <span>{caption}</span>
        <span className="text-ink-300">
          {zerosFoundLabel}: <span className="text-signal-amber">{zerosFound}</span>
        </span>
      </div>
      <div className="hairline aspect-[4/3] overflow-hidden rounded-xl border bg-ink-950">
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between font-mono text-[11px] text-ink-300">
          <span>
            {tLabel}: <span className="text-signal-amber">{tMax.toFixed(1)}</span>
          </span>
          <span className="text-ink-400">t ∈ [0, {tMax.toFixed(1)}]</span>
        </div>
        <input
          type="range"
          value={tMax}
          min={1}
          max={60}
          step={0.5}
          onChange={(e) => setTMax(parseFloat(e.target.value))}
          className="w-full accent-signal-amber"
        />
      </div>
      <p className="text-[12px] leading-relaxed text-ink-300">{hintLabel}</p>
    </div>
  );
}
