"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Compact Oregonator-style three-variable oscillator. Plots the rescaled
// concentrations x ~ HBrO2, y ~ Br-, z ~ Ce(IV) over time. Uses the
// dimensionless Field-Noyes (1974) form
//
//   eps  * dx/dt = q*y - x*y + x*(1 - x)
//   eps' * dy/dt = -q*y - x*y + f*z
//          dz/dt = x - z
//
// Integrated with a simple semi-implicit / forward-Euler hybrid on tiny dt.

const W = 360;
const H = 180;
const HISTORY = W; // one sample per displayed column

// Colours for the three traces.
const TRACE_COLORS = {
  x: "#7df3ff", // cyan   - HBrO2
  y: "#b388ff", // violet - Br-
  z: "#ffd166", // amber  - Ce(IV)
} as const;

// Logarithmic-like compression so we can see all three traces on one
// canvas: each species lives at a wildly different concentration in the
// real chemistry, but the dimensionless form is still wide-dynamic-range.
function compress(v: number): number {
  if (!isFinite(v) || v <= 0) return 0;
  // map (0, ~10) -> (0, 1) on a soft curve
  return Math.min(1, Math.log10(1 + v) / Math.log10(11));
}

interface Props {
  caption: string;
  epsilonLabel: string;
  qLabel: string;
  resetLabel: string;
  pauseLabel: string;
  playLabel: string;
  legendLabel: string;
  note: string;
}

export function BzrOregonator({
  caption,
  epsilonLabel,
  qLabel,
  resetLabel,
  pauseLabel,
  playLabel,
  legendLabel,
  note,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [epsilon, setEpsilon] = useState(0.04); // 1e-2 .. 1e-1 sweet spot
  const [q, setQ] = useState(8e-4); // small parameter
  const [paused, setPaused] = useState(false);
  const [resetTick, setResetTick] = useState(0);

  const stateRef = useRef({ x: 0.5, y: 1e-4, z: 0.5 });
  const histRef = useRef({
    x: new Float32Array(HISTORY),
    y: new Float32Array(HISTORY),
    z: new Float32Array(HISTORY),
    n: 0,
  });

  const paramsRef = useRef({ epsilon, q, paused });
  paramsRef.current = { epsilon, q, paused };

  // re-seed when reset is pressed
  useEffect(() => {
    stateRef.current = { x: 0.5, y: 1e-4, z: 0.1 };
    histRef.current.x.fill(0);
    histRef.current.y.fill(0);
    histRef.current.z.fill(0);
    histRef.current.n = 0;
  }, [resetTick]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use a tight epsilon' close to epsilon so the system stays stiff but
    // legible at the per-frame step counts we run with.
    const f = 1.0;
    const dt = 0.0008;
    // Was 60 — gave ~4 oscillations/second, fast enough that the colour
    // bars flickered. 20 gives ~1.3 osc/sec — clearly visible cycle, no strobe.
    const STEPS_PER_FRAME = 20;
    // Take one history sample every N steps so we see ~10 oscillations on
    // screen.
    const SAMPLE_EVERY = 6;

    let raf = 0;
    let stepCounter = 0;
    const step = (): void => {
      const p = paramsRef.current;
      if (!p.paused) {
        const eps = Math.max(1e-3, p.epsilon);
        const epsP = eps * 0.5; // eps' a bit faster than eps -> Br- relaxes quickly
        const qq = Math.max(1e-6, p.q);
        let { x, y, z } = stateRef.current;
        for (let s = 0; s < STEPS_PER_FRAME; s++) {
          // Forward Euler on dimensionless Oregonator. Clamp to keep the
          // stiff system from blowing up at the slider edges.
          const dx = (qq * y - x * y + x * (1 - x)) / eps;
          const dy = (-qq * y - x * y + f * z) / epsP;
          const dz = x - z;
          x = Math.max(0, x + dx * dt);
          y = Math.max(0, y + dy * dt);
          z = Math.max(0, z + dz * dt);
          if (!isFinite(x)) x = 0.5;
          if (!isFinite(y)) y = 1e-4;
          if (!isFinite(z)) z = 0.1;

          stepCounter++;
          if (stepCounter >= SAMPLE_EVERY) {
            stepCounter = 0;
            const h = histRef.current;
            const idx = h.n % HISTORY;
            h.x[idx] = x;
            h.y[idx] = y;
            h.z[idx] = z;
            h.n++;
          }
        }
        stateRef.current = { x, y, z };
      }

      // Draw
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(232,234,242,0.07)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        const yy = (H * i) / 4;
        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(W, yy);
        ctx.stroke();
      }

      const h = histRef.current;
      const n = h.n;
      const count = Math.min(n, HISTORY);
      if (count < 2) {
        raf = requestAnimationFrame(step);
        return;
      }
      const startIdx = (n - count + HISTORY) % HISTORY;

      const drawTrace = (arr: Float32Array, color: string) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const idx = (startIdx + i) % HISTORY;
          const v = compress(arr[idx]);
          const px = (i / (HISTORY - 1)) * W;
          const py = H - 4 - v * (H - 8);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      };

      drawTrace(h.z, TRACE_COLORS.z);
      drawTrace(h.y, TRACE_COLORS.y);
      drawTrace(h.x, TRACE_COLORS.x);

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const legend = useMemo(
    () => [
      { c: TRACE_COLORS.x, k: "x", v: "HBrO₂" },
      { c: TRACE_COLORS.y, k: "y", v: "Br⁻" },
      { c: TRACE_COLORS.z, k: "z", v: "Ce⁴⁺" },
    ],
    [],
  );

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
        {caption}
      </div>
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[360px_1fr]">
        <div className="hairline overflow-hidden rounded-xl border bg-ink-950">
          <canvas ref={canvasRef} className="block w-full" style={{ aspectRatio: `${W} / ${H}` }} />
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              <span>{epsilonLabel}</span>
              <span className="text-signal-rose">{epsilon.toFixed(3)}</span>
            </div>
            <input
              type="range"
              value={epsilon}
              min={0.01}
              max={0.12}
              step={0.001}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              className="w-full accent-signal-rose"
            />
          </div>
          <div>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              <span>{qLabel}</span>
              <span className="text-signal-rose">{q.toExponential(1)}</span>
            </div>
            <input
              type="range"
              value={Math.log10(q)}
              min={-5}
              max={-2}
              step={0.05}
              onChange={(e) => setQ(Math.pow(10, parseFloat(e.target.value)))}
              className="w-full accent-signal-rose"
            />
          </div>
          <div className="space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {legendLabel}
            </div>
            <ul className="space-y-1 font-mono text-[11px]">
              {legend.map((l) => (
                <li key={l.k} className="flex items-center gap-3">
                  <span
                    className="inline-block h-[2px] w-3 rounded"
                    style={{ backgroundColor: l.c }}
                  />
                  <span className="text-ink-200">
                    {l.k} · {l.v}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setResetTick((t) => t + 1)}
              className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
            >
              {resetLabel}
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
