"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";

// Twin double pendulum demo. Two identical systems integrated in lockstep,
// one starting at θ₁ = 120°, the other at θ₁ = 120° + 10⁻⁵°. For ~5 seconds
// they look indistinguishable. Then the chaos catches up and the two
// pendulums dance very different dances.

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
const SUBSTEPS = 6;
const TRAIL_MAX = 240;
const EPS_DEG = 1e-5;
const INIT_TH1_DEG = 120;
const INIT_TH2_DEG = -10;

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
  captionA?: string;
  captionB?: string;
  canvasLabelA?: string;
  canvasLabelB?: string;
  playLabel?: string;
  pauseLabel?: string;
  resetLabel?: string;
  timeLabel?: string;
  divergenceLabel?: string;
}

const INIT_TH1 = (INIT_TH1_DEG * Math.PI) / 180;
const INIT_TH2 = (INIT_TH2_DEG * Math.PI) / 180;
const INIT_TH1_B = INIT_TH1 + (EPS_DEG * Math.PI) / 180;

export function DoublePendulumTwin({
  captionA,
  captionB,
  canvasLabelA,
  canvasLabelB,
  playLabel,
  pauseLabel,
  resetLabel,
  timeLabel,
  divergenceLabel,
}: Props) {
  const canvasARef = useRef<HTMLCanvasElement | null>(null);
  const canvasBRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(true);
  const [resetTick, setResetTick] = useState(0);
  const [stats, setStats] = useState({ t: 0, dist: 0 });
  const dpr = useDpr();

  // Simulation state lives in refs so that toggling Pause (or any re-render)
  // freezes the experiment in place instead of restarting both pendulums from
  // t = 0. The rAF loop reads `runningRef` rather than depending on `running`,
  // and only the reset effect below re-seeds these.
  const aRef = useRef<State>({ th1: INIT_TH1, th2: INIT_TH2, w1: 0, w2: 0 });
  const bRef = useRef<State>({ th1: INIT_TH1_B, th2: INIT_TH2, w1: 0, w2: 0 });
  const simTRef = useRef(0);
  const lastStatsTRef = useRef(0);
  const trailARef = useRef<Array<[number, number]>>([]);
  const trailBRef = useRef<Array<[number, number]>>([]);
  const runningRef = useRef(true);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  // Respect prefers-reduced-motion: start paused and let the user opt in.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRunning(false);
    }
  }, []);

  // Re-seed both pendulums to the initial configuration on mount and on Reset
  // only. Pause/Play never runs this, so the divergence you were watching is
  // preserved across a pause.
  useEffect(() => {
    aRef.current = { th1: INIT_TH1, th2: INIT_TH2, w1: 0, w2: 0 };
    bRef.current = { th1: INIT_TH1_B, th2: INIT_TH2, w1: 0, w2: 0 };
    simTRef.current = 0;
    lastStatsTRef.current = 0;
    trailARef.current = [];
    trailBRef.current = [];
    setStats({ t: 0, dist: 0 });
  }, [resetTick]);

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
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cA);
    ro.observe(cB);

    const drawPendulum = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      s: State,
      trail: Array<[number, number]>,
      record: boolean,
      rodAColor: string,
      rodBColor: string,
      bobAColor: string,
      bobBColor: string,
      trailColor: string,
    ) => {
      const W = canvas.width;
      const H = canvas.height;

      // Soft fade.
      ctx.fillStyle = "rgba(6, 7, 13, 0.22)";
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H * 0.42;
      const scale = Math.min(W, H) / (2 * (L1 + L2) + 0.4);

      const x1 = cx + scale * L1 * Math.sin(s.th1);
      const y1 = cy + scale * L1 * Math.cos(s.th1);
      const x2 = x1 + scale * L2 * Math.sin(s.th2);
      const y2 = y1 + scale * L2 * Math.cos(s.th2);

      // Only extend the trail while running, otherwise a paused sim keeps
      // pushing the frozen tip and erodes the whole trail within seconds.
      if (record) {
        trail.push([x2, y2]);
        if (trail.length > TRAIL_MAX) trail.shift();
      }

      for (let i = 1; i < trail.length; i++) {
        const t = i / trail.length;
        const [ax, ay] = trail[i - 1];
        const [bx, by] = trail[i];
        ctx.strokeStyle = `${trailColor}${(0.08 + 0.5 * t).toFixed(3)})`;
        ctx.lineWidth = 1.1 * dpr;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // Pivot.
      ctx.fillStyle = "rgba(255, 209, 102, 0.9)";
      ctx.beginPath();
      ctx.arc(cx, cy, 2.6 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // Rods.
      ctx.lineCap = "round";
      ctx.strokeStyle = rodAColor;
      ctx.lineWidth = 1.4 * dpr;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      ctx.strokeStyle = rodBColor;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Bobs.
      ctx.fillStyle = bobAColor;
      ctx.beginPath();
      ctx.arc(x1, y1, 4 * dpr, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = bobBColor;
      ctx.beginPath();
      ctx.arc(x2, y2, 5 * dpr, 0, Math.PI * 2);
      ctx.fill();
    };

    // Advance by real elapsed time so the divergence clock ticks at the same
    // wall-clock rate on 60 Hz and 120 Hz displays.
    let last = performance.now();
    let acc = 0;

    const step = (now: number) => {
      const run = runningRef.current;
      if (run) {
        const dtReal = Math.min((now - last) / 1000, 0.05);
        acc += dtReal;
        let steps = Math.floor(acc / DT);
        const maxSteps = 4 * SUBSTEPS;
        if (steps > maxSteps) steps = maxSteps;
        acc -= steps * DT;
        for (let i = 0; i < steps; i++) {
          aRef.current = rk4(aRef.current, DT);
          bRef.current = rk4(bRef.current, DT);
          simTRef.current += DT;
        }
      }
      last = now;

      const a = aRef.current;
      const b = bRef.current;
      drawPendulum(
        ctxA,
        cA,
        a,
        trailARef.current,
        run,
        "rgba(125, 243, 255, 0.85)",
        "rgba(125, 243, 255, 0.85)",
        "rgba(125, 243, 255, 0.95)",
        "rgba(255, 209, 102, 0.95)",
        "rgba(255, 209, 102, ",
      );
      drawPendulum(
        ctxB,
        cB,
        b,
        trailBRef.current,
        run,
        "rgba(179, 136, 255, 0.85)",
        "rgba(179, 136, 255, 0.85)",
        "rgba(179, 136, 255, 0.95)",
        "rgba(255, 122, 182, 0.95)",
        "rgba(255, 122, 182, ",
      );

      if (run && simTRef.current - lastStatsTRef.current > 0.1) {
        lastStatsTRef.current = simTRef.current;
        const d1 = a.th1 - b.th1;
        const d2 = a.th2 - b.th2;
        const dw1 = a.w1 - b.w1;
        const dw2 = a.w2 - b.w2;
        const d = Math.sqrt(d1 * d1 + d2 * d2 + dw1 * dw1 + dw2 * dw2);
        setStats({ t: simTRef.current, dist: d });
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // Note: `running` is deliberately NOT a dependency. The loop reads it via
    // runningRef so pausing freezes the sim instead of tearing this down.
  }, [dpr]);

  const reset = () => {
    setResetTick((x) => x + 1);
  };

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5 md:p-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
            {captionA ?? "Pendulum A · θ₁ = 120°"}
          </div>
          <canvas
            ref={canvasARef}
            role="img"
            aria-label={canvasLabelA ?? captionA ?? "Pendulum A"}
            className="hairline mx-auto aspect-square w-full max-w-[280px] rounded-md border bg-ink-950/80"
          />
        </div>
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
            {captionB ?? "Pendulum B · θ₁ = 120° + 10⁻⁵°"}
          </div>
          <canvas
            ref={canvasBRef}
            role="img"
            aria-label={canvasLabelB ?? captionB ?? "Pendulum B"}
            className="hairline mx-auto aspect-square w-full max-w-[280px] rounded-md border bg-ink-950/80"
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
            {timeLabel ?? "t"} · <span className="text-ink-100">{stats.t.toFixed(2)}s</span>
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
