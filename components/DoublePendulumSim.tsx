"use client";

import { useEffect, useRef, useState } from "react";

// A live double pendulum. RK4 integration of the standard equations of
// motion (Lagrangian formulation). Two sliders set the initial angles; the
// canvas draws the two rods, the two bobs, and a fading trail of the last
// 200 tip positions. Kept small (~360x360) so it can sit inline in the
// story page.

type State = {
  th1: number;
  th2: number;
  w1: number;
  w2: number;
};

const G = 9.81;
const L1 = 1.0;
const L2 = 1.0;
const M1 = 1.0;
const M2 = 1.0;
const DT = 1 / 240;
const SUBSTEPS = 4;
const TRAIL_MAX = 200;

function deriv(s: State): State {
  const { th1, th2, w1, w2 } = s;
  const d = th1 - th2;
  const sin_d = Math.sin(d);
  const cos_d = Math.cos(d);
  const den = 2 * M1 + M2 - M2 * Math.cos(2 * th1 - 2 * th2);

  const a1 =
    (-G * (2 * M1 + M2) * Math.sin(th1) -
      M2 * G * Math.sin(th1 - 2 * th2) -
      2 * sin_d * M2 * (w2 * w2 * L2 + w1 * w1 * L1 * cos_d)) /
    (L1 * den);

  const a2 =
    (2 *
      sin_d *
      (w1 * w1 * L1 * (M1 + M2) + G * (M1 + M2) * Math.cos(th1) + w2 * w2 * L2 * M2 * cos_d)) /
    (L2 * den);

  return { th1: w1, th2: w2, w1: a1, w2: a2 };
}

function add(a: State, b: State, h: number): State {
  return {
    th1: a.th1 + h * b.th1,
    th2: a.th2 + h * b.th2,
    w1: a.w1 + h * b.w1,
    w2: a.w2 + h * b.w2,
  };
}

function rk4(s: State, h: number): State {
  const k1 = deriv(s);
  const k2 = deriv(add(s, k1, h / 2));
  const k3 = deriv(add(s, k2, h / 2));
  const k4 = deriv(add(s, k3, h));
  return {
    th1: s.th1 + (h / 6) * (k1.th1 + 2 * k2.th1 + 2 * k3.th1 + k4.th1),
    th2: s.th2 + (h / 6) * (k1.th2 + 2 * k2.th2 + 2 * k3.th2 + k4.th2),
    w1: s.w1 + (h / 6) * (k1.w1 + 2 * k2.w1 + 2 * k3.w1 + k4.w1),
    w2: s.w2 + (h / 6) * (k1.w2 + 2 * k2.w2 + 2 * k3.w2 + k4.w2),
  };
}

interface Props {
  caption?: string;
  th1Label?: string;
  th2Label?: string;
  playLabel?: string;
  pauseLabel?: string;
  resetLabel?: string;
  hint?: string;
}

export function DoublePendulumSim({
  caption,
  th1Label,
  th2Label,
  playLabel,
  pauseLabel,
  resetLabel,
  hint,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<State>({ th1: Math.PI / 2, th2: Math.PI / 2, w1: 0, w2: 0 });
  const trailRef = useRef<Array<[number, number]>>([]);
  const [th1Deg, setTh1Deg] = useState(90);
  const [th2Deg, setTh2Deg] = useState(90);
  const [running, setRunning] = useState(true);
  const [tick, setTick] = useState(0);

  // Whenever the user moves the sliders, reset the simulation so the new
  // initial conditions take effect immediately.
  useEffect(() => {
    stateRef.current = {
      th1: (th1Deg * Math.PI) / 180,
      th2: (th2Deg * Math.PI) / 180,
      w1: 0,
      w2: 0,
    };
    trailRef.current = [];
  }, [th1Deg, th2Deg, tick]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      // Trailing fade.
      ctx.fillStyle = "rgba(6, 7, 13, 0.22)";
      ctx.fillRect(0, 0, W, H);

      if (running) {
        for (let i = 0; i < SUBSTEPS; i++) {
          stateRef.current = rk4(stateRef.current, DT);
        }
      }

      const { th1, th2 } = stateRef.current;
      const cx = W / 2;
      const cy = H * 0.42;
      const scale = Math.min(W, H) / (2 * (L1 + L2) + 0.4);

      const x1 = cx + scale * L1 * Math.sin(th1);
      const y1 = cy + scale * L1 * Math.cos(th1);
      const x2 = x1 + scale * L2 * Math.sin(th2);
      const y2 = y1 + scale * L2 * Math.cos(th2);

      // Trail of tip.
      const trail = trailRef.current;
      trail.push([x2, y2]);
      if (trail.length > TRAIL_MAX) trail.shift();

      // Draw trail (older = dimmer).
      for (let i = 1; i < trail.length; i++) {
        const t = i / trail.length;
        const [ax, ay] = trail[i - 1];
        const [bx, by] = trail[i];
        ctx.strokeStyle = `rgba(255, 122, 182, ${0.08 + 0.55 * t})`;
        ctx.lineWidth = 1.2 * dpr;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // Pivot.
      ctx.fillStyle = "rgba(255, 209, 102, 0.9)";
      ctx.beginPath();
      ctx.arc(cx, cy, 3 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // Rods.
      ctx.strokeStyle = "rgba(125, 243, 255, 0.85)";
      ctx.lineWidth = 1.6 * dpr;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      ctx.strokeStyle = "rgba(179, 136, 255, 0.85)";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Bobs.
      ctx.fillStyle = "rgba(125, 243, 255, 0.95)";
      ctx.beginPath();
      ctx.arc(x1, y1, 5 * dpr, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 122, 182, 0.95)";
      ctx.beginPath();
      ctx.arc(x2, y2, 6 * dpr, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [running]);

  const reset = () => setTick((x) => x + 1);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5 md:p-6">
      {caption && (
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
          {caption}
        </div>
      )}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="hairline aspect-square w-full max-w-[360px] rounded-md border bg-ink-950/80"
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-24 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {th1Label ?? "θ₁"} · <span className="text-signal-cyan">{th1Deg.toFixed(0)}°</span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={th1Deg}
            onChange={(e) => setTh1Deg(parseFloat(e.target.value))}
            className="flex-1 accent-signal-cyan"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {th2Label ?? "θ₂"} · <span className="text-signal-violet">{th2Deg.toFixed(0)}°</span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={th2Deg}
            onChange={(e) => setTh2Deg(parseFloat(e.target.value))}
            className="flex-1 accent-signal-violet"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
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
        {hint && (
          <p className="ml-auto max-w-[260px] text-[10px] leading-relaxed text-ink-400">{hint}</p>
        )}
      </div>
    </div>
  );
}
