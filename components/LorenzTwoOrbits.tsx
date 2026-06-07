"use client";

import { useEffect, useRef, useState } from "react";

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
  playLabel?: string;
  pauseLabel?: string;
  resetLabel?: string;
  divergenceLabel?: string;
  timeLabel?: string;
}

export function LorenzTwoOrbits({
  captionA,
  captionB,
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
  const [stats, setStats] = useState({ t: 0, dist: EPSILON });

  useEffect(() => {
    const cA = canvasARef.current;
    const cB = canvasBRef.current;
    if (!cA || !cB) return;
    const ctxA = cA.getContext("2d", { alpha: true })!;
    const ctxB = cB.getContext("2d", { alpha: true })!;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      [cA, cB].forEach((c) => {
        c.width = Math.floor(c.clientWidth * dpr);
        c.height = Math.floor(c.clientHeight * dpr);
      });
      // Wipe.
      for (const ctx of [ctxA, ctxB]) {
        ctx.fillStyle = "#06070d";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cA);
    ro.observe(cB);

    let a: Vec3 = [0.1, 0, 1];
    let b: Vec3 = [0.1 + EPSILON, 0, 1];
    let prevA: Vec3 = [...a] as Vec3;
    let prevB: Vec3 = [...b] as Vec3;
    let simT = 0;

    // Project x-z plane (typical Lorenz view).
    const project = (canvas: HTMLCanvasElement, [x, , z]: Vec3): [number, number] => {
      const W = canvas.width;
      const H = canvas.height;
      const sx = W / 60;
      const sz = H / 60;
      return [W / 2 + x * sx, H - 10 - z * sz];
    };

    let lastStatsT = 0;

    const step = () => {
      if (running) {
        // Run multiple sub-steps per frame so the trajectory draws fast enough
        // to feel "live".
        for (let i = 0; i < 8; i++) {
          prevA = a;
          prevB = b;
          a = rk4(a, DT);
          b = rk4(b, DT);
          simT += DT;

          // Draw segment on A
          {
            const [ax, ay] = project(cA, prevA);
            const [bx, by] = project(cA, a);
            ctxA.strokeStyle = "rgba(125, 243, 255, 0.55)";
            ctxA.lineWidth = 1.0 * dpr;
            ctxA.beginPath();
            ctxA.moveTo(ax, ay);
            ctxA.lineTo(bx, by);
            ctxA.stroke();
          }
          // Draw segment on B
          {
            const [ax, ay] = project(cB, prevB);
            const [bx, by] = project(cB, b);
            ctxB.strokeStyle = "rgba(179, 136, 255, 0.55)";
            ctxB.lineWidth = 1.0 * dpr;
            ctxB.beginPath();
            ctxB.moveTo(ax, ay);
            ctxB.lineTo(bx, by);
            ctxB.stroke();
          }
        }

        // Head markers, redrawn each frame.
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
        drawHead(ctxA, cA, a, "rgba(255, 209, 102, 1)");
        drawHead(ctxB, cB, b, "rgba(255, 122, 182, 1)");

        // Update stats ~10 Hz
        if (simT - lastStatsT > 0.1) {
          lastStatsT = simT;
          const dx = a[0] - b[0];
          const dy = a[1] - b[1];
          const dz = a[2] - b[2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          setStats({ t: simT, dist: d });
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [running, resetTick]);

  const reset = () => {
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
            className="hairline h-[220px] w-full rounded-md border bg-ink-950/80"
          />
        </div>
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
            {captionB ?? "Trajectory B · x₀ = 0.1 + 10⁻⁵"}
          </div>
          <canvas
            ref={canvasBRef}
            className="hairline h-[220px] w-full rounded-md border bg-ink-950/80"
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
