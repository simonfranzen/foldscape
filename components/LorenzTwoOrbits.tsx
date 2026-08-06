"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Two trajectories starting ε = 1e-5 apart. We integrate both in lockstep
// and draw them on two small canvases. After a few seconds of simulated
// time they're on opposite wings of the butterfly — the visceral form of
// the butterfly effect.

type Vec3 = [number, number, number];

const SIGMA = 10;
const RHO = 28;
const BETA = 8 / 3;
const DT = 0.008;
const EPSILON = 1e-5;

// Trail / head colours from the shared palette so they follow a palette change
// instead of drifting as raw rgba literals.
const withAlpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
const STROKE_A = withAlpha(palette.signal.cyan, 0.55);
const STROKE_B = withAlpha(palette.signal.violet, 0.55);
const HEAD_A = withAlpha(palette.signal.amber, 1);
const HEAD_B = withAlpha(palette.signal.rose, 1);

function deriv([x, y, z]: Vec3): Vec3 {
  return [SIGMA * (y - x), x * (RHO - z) - y, x * y - BETA * z];
}

function rk4(p: Vec3, h: number): Vec3 {
  const k1 = deriv(p);
  const p2: Vec3 = [p[0] + (h / 2) * k1[0], p[1] + (h / 2) * k1[1], p[2] + (h / 2) * k1[2]];
  const k2 = deriv(p2);
  const p3: Vec3 = [p[0] + (h / 2) * k2[0], p[1] + (h / 2) * k2[1], p[2] + (h / 2) * k2[2]];
  const k3 = deriv(p3);
  const p4: Vec3 = [p[0] + h * k3[0], p[1] + h * k3[1], p[2] + h * k3[2]];
  const k4 = deriv(p4);
  return [
    p[0] + (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    p[1] + (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    p[2] + (h / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
  ];
}

interface Props {
  captionA?: string;
  captionB?: string;
  canvasLabelA?: string;
  canvasLabelB?: string;
  playLabel?: string;
  pauseLabel?: string;
  resetLabel?: string;
  divergenceLabel?: string;
  timeLabel?: string;
}

const INIT_A: Vec3 = [0.1, 0, 1];
const INIT_B: Vec3 = [0.1 + EPSILON, 0, 1];

export function LorenzTwoOrbits({
  captionA,
  captionB,
  canvasLabelA,
  canvasLabelB,
  playLabel,
  pauseLabel,
  resetLabel,
  divergenceLabel,
  timeLabel,
}: Props) {
  const canvasARef = useRef<HTMLCanvasElement | null>(null);
  const canvasBRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(true);
  const [resetTick, setResetTick] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [stats, setStats] = useState({ t: 0, dist: EPSILON });
  const dpr = useDpr();

  // Simulation state lives in refs so toggling Pause (or any re-render) freezes
  // the experiment in place instead of wiping both canvases and restarting from
  // t = 0. The rAF loop reads `runningRef`; only Reset re-seeds these.
  const aRef = useRef<Vec3>([...INIT_A] as Vec3);
  const bRef = useRef<Vec3>([...INIT_B] as Vec3);
  const prevARef = useRef<Vec3>([...INIT_A] as Vec3);
  const prevBRef = useRef<Vec3>([...INIT_B] as Vec3);
  const simTRef = useRef(0);
  const lastStatsTRef = useRef(0);
  const runningRef = useRef(true);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  // Track prefers-reduced-motion and re-subscribe so a system-setting change
  // swaps between the animated loop and a single static frame.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const cA = canvasARef.current;
    const cB = canvasBRef.current;
    if (!cA || !cB) return;
    const ctxA = cA.getContext("2d", { alpha: true });
    const ctxB = cB.getContext("2d", { alpha: true });
    if (!ctxA || !ctxB) return;
    let raf = 0;

    const resize = () => {
      [cA, cB].forEach((c) => {
        c.width = Math.floor(c.clientWidth * dpr);
        c.height = Math.floor(c.clientHeight * dpr);
      });
      // Wipe.
      for (const ctx of [ctxA, ctxB]) {
        ctx.fillStyle = palette.canvas.bg;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cA);
    ro.observe(cB);

    // Project x-z plane (typical Lorenz view).
    const project = (canvas: HTMLCanvasElement, [x, , z]: Vec3): [number, number] => {
      const W = canvas.width;
      const H = canvas.height;
      const sx = W / 60;
      const sz = H / 60;
      return [W / 2 + x * sx, H - 10 - z * sz];
    };

    const drawSegment = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      from: Vec3,
      to: Vec3,
      color: string,
    ) => {
      const [ax, ay] = project(canvas, from);
      const [bx, by] = project(canvas, to);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.0 * dpr;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    };

    const drawHead = (
      ctx: CanvasRenderingContext2D,
      c: HTMLCanvasElement,
      p: Vec3,
      color: string,
    ) => {
      const [hx, hy] = project(c, p);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(hx, hy, 2.6 * dpr, 0, Math.PI * 2);
      ctx.fill();
    };

    // Reduced motion: draw one static, pre-integrated frame of both orbits so
    // the divergence is still legible, and skip the rAF loop entirely.
    if (reduced) {
      let a: Vec3 = [...INIT_A] as Vec3;
      let b: Vec3 = [...INIT_B] as Vec3;
      let t = 0;
      const STATIC_STEPS = 3000;
      for (let i = 0; i < STATIC_STEPS; i++) {
        const pa = a;
        const pb = b;
        a = rk4(a, DT);
        b = rk4(b, DT);
        t += DT;
        drawSegment(ctxA, cA, pa, a, STROKE_A);
        drawSegment(ctxB, cB, pb, b, STROKE_B);
      }
      drawHead(ctxA, cA, a, HEAD_A);
      drawHead(ctxB, cB, b, HEAD_B);
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      const dz = a[2] - b[2];
      setStats({ t, dist: Math.sqrt(dx * dx + dy * dy + dz * dz) });
      return () => {
        ro.disconnect();
      };
    }

    const step = () => {
      if (runningRef.current) {
        // Run multiple sub-steps per frame so the trajectory draws fast enough
        // to feel "live".
        for (let i = 0; i < 8; i++) {
          prevARef.current = aRef.current;
          prevBRef.current = bRef.current;
          aRef.current = rk4(aRef.current, DT);
          bRef.current = rk4(bRef.current, DT);
          simTRef.current += DT;

          drawSegment(ctxA, cA, prevARef.current, aRef.current, STROKE_A);
          drawSegment(ctxB, cB, prevBRef.current, bRef.current, STROKE_B);
        }

        // Head markers, redrawn each frame.
        drawHead(ctxA, cA, aRef.current, HEAD_A);
        drawHead(ctxB, cB, bRef.current, HEAD_B);

        // Update stats ~10 Hz
        if (simTRef.current - lastStatsTRef.current > 0.1) {
          lastStatsTRef.current = simTRef.current;
          const dx = aRef.current[0] - bRef.current[0];
          const dy = aRef.current[1] - bRef.current[1];
          const dz = aRef.current[2] - bRef.current[2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          setStats({ t: simTRef.current, dist: d });
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // `running` is intentionally NOT a dependency: the loop reads runningRef so
    // pausing freezes the drawn trajectories instead of tearing this down.
  }, [resetTick, dpr, reduced]);

  const reset = () => {
    aRef.current = [...INIT_A] as Vec3;
    bRef.current = [...INIT_B] as Vec3;
    prevARef.current = [...INIT_A] as Vec3;
    prevBRef.current = [...INIT_B] as Vec3;
    simTRef.current = 0;
    lastStatsTRef.current = 0;
    setStats({ t: 0, dist: EPSILON });
    setResetTick((x) => x + 1);
  };

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5 md:p-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
            {captionA ?? "Trajectory A · x₀ = 0.1"}
          </div>
          <canvas
            ref={canvasARef}
            role="img"
            aria-label={canvasLabelA ?? captionA ?? "Trajectory A"}
            className="hairline h-[220px] w-full rounded-md border bg-ink-950/80"
          />
        </div>
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
            {captionB ?? "Trajectory B · x₀ = 0.1 + 10⁻⁵"}
          </div>
          <canvas
            ref={canvasBRef}
            role="img"
            aria-label={canvasLabelB ?? captionB ?? "Trajectory B"}
            className="hairline h-[220px] w-full rounded-md border bg-ink-950/80"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          disabled={reduced}
          className="hairline rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-signal-rose transition-colors hover:border-signal-rose/60 disabled:cursor-not-allowed disabled:opacity-40"
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
            {timeLabel ?? "t"} · <span className="text-ink-100">{stats.t.toFixed(2)}</span>
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
