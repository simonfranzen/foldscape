"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

const TAU = Math.PI * 2;

const SPECIAL_ANGLES: Array<{ theta: number; label: string; z: string }> = [
  { theta: 0, label: "0", z: "1" },
  { theta: Math.PI / 2, label: "π/2", z: "i" },
  { theta: Math.PI, label: "π", z: "−1" },
  { theta: (3 * Math.PI) / 2, label: "3π/2", z: "−i" },
  { theta: TAU, label: "2π", z: "1" },
];

export default function EulerExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.euler;
  const planeRef = useRef<HTMLCanvasElement | null>(null);
  const stripRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  const [theta, setTheta] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(0.6); // radians per second
  // Tick — incremented when Reset is pressed, used to clear the trail
  const [resetTick, setResetTick] = useState(0);

  const thetaRef = useRef(theta);
  thetaRef.current = theta;
  const runningRef = useRef(running);
  runningRef.current = running;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // Animate θ when running
  useEffect(() => {
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = (now - prev) / 1000;
      prev = now;
      if (runningRef.current) {
        let next = thetaRef.current + speedRef.current * dt;
        // Wrap to [0, 2π] so the slider stays in range
        if (next > TAU) next -= TAU;
        if (next < 0) next += TAU;
        setTheta(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Complex plane canvas
  useEffect(() => {
    const canvas = planeRef.current;
    if (!canvas) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.36;

      // Grid (faint)
      ctx.strokeStyle = "rgba(138,144,164,0.08)";
      ctx.lineWidth = 1;
      const gridStep = R / 2;
      for (let gx = cx - 4 * gridStep; gx <= W; gx += gridStep) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = cy - 4 * gridStep; gy <= H; gy += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      // Axes
      ctx.strokeStyle = "rgba(200, 205, 220, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, H);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = "rgba(200, 205, 220, 0.65)";
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillText("Re", W - 22, cy - 6);
      ctx.fillText("Im", cx + 6, 14);

      // Tick labels at ±1
      ctx.fillStyle = "rgba(138,144,164,0.7)";
      ctx.fillText("1", cx + R + 4, cy - 4);
      ctx.fillText("−1", cx - R - 18, cy - 4);
      ctx.fillText("i", cx + 6, cy - R + 2);
      ctx.fillText("−i", cx + 6, cy + R + 12);

      // Unit circle
      ctx.strokeStyle = "rgba(255, 209, 102, 0.35)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.stroke();

      // Trail — the swept arc from 0 → θ
      const t = thetaRef.current;
      ctx.strokeStyle = "rgba(255, 209, 102, 0.85)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      // canvas y is inverted, so we draw the arc clockwise on screen but
      // counter-clockwise in math coords by negating the angle
      ctx.arc(cx, cy, R, 0, -t, true);
      ctx.stroke();

      // Radius line from origin to point
      const px = cx + R * Math.cos(t);
      const py = cy - R * Math.sin(t);
      ctx.strokeStyle = "rgba(125, 243, 255, 0.85)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Projection lines to axes (cos, sin)
      ctx.strokeStyle = "rgba(255, 122, 182, 0.35)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, cy);
      ctx.moveTo(px, py);
      ctx.lineTo(cx, py);
      ctx.stroke();
      ctx.setLineDash([]);

      // The moving point — extra glow when at θ = π (the identity moment)
      const distFromPi = Math.abs(((t - Math.PI + Math.PI * 3) % TAU) - Math.PI);
      const atPi = distFromPi < 0.02;
      const glowR = atPi ? 16 : 8;
      const grad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
      grad.addColorStop(0, atPi ? "rgba(255, 122, 182, 0.95)" : "rgba(255, 209, 102, 0.95)");
      grad.addColorStop(1, "rgba(255, 209, 102, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, glowR, 0, TAU);
      ctx.fill();
      ctx.fillStyle = atPi ? palette.signal.rose : palette.signal.amber;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, TAU);
      ctx.fill();

      // Labels overlay: θ in radians + degrees, cos, sin
      const cosT = Math.cos(t);
      const sinT = Math.sin(t);
      const lines = [
        `θ = ${t.toFixed(3)} rad  ·  ${((t * 180) / Math.PI).toFixed(1)}°`,
        `cos θ = ${cosT.toFixed(4)}`,
        `sin θ = ${sinT.toFixed(4)}`,
        `z = e^(iθ) = ${cosT.toFixed(3)} ${sinT >= 0 ? "+" : "−"} ${Math.abs(sinT).toFixed(3)} i`,
      ];
      ctx.fillStyle = "rgba(5, 6, 10, 0.7)";
      ctx.fillRect(12, H - 92, 290, 80);
      ctx.fillStyle = atPi ? palette.signal.rose : palette.signal.amber;
      ctx.font = "12px ui-monospace, monospace";
      for (let i = 0; i < lines.length; i++) {
        ctx.fillStyle =
          i === 0 ? (atPi ? palette.signal.rose : palette.signal.amber) : "rgba(225, 228, 240, 0.9)";
        ctx.fillText(lines[i], 20, H - 70 + i * 16);
      }

      // Big "Euler's identity moment" banner when at θ = π
      if (atPi) {
        ctx.fillStyle = "rgba(255, 122, 182, 0.12)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = palette.signal.rose;
        ctx.font = "bold 18px ui-monospace, monospace";
        const msg = "e^(iπ) + 1 = 0";
        const mw = ctx.measureText(msg).width;
        ctx.fillText(msg, cx - mw / 2, 32);
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);

    let raf = 0;
    const loop = () => {
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [resetTick, dpr]);

  // Strip canvas — cos θ and sin θ over [0, 2π]
  useEffect(() => {
    const canvas = stripRef.current;
    if (!canvas) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const padL = 28;
      const padR = 12;
      const padT = 12;
      const padB = 18;
      const innerW = W - padL - padR;
      const innerH = H - padT - padB;
      const midY = padT + innerH / 2;

      // Zero axis
      ctx.strokeStyle = "rgba(200, 205, 220, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, midY);
      ctx.lineTo(padL + innerW, midY);
      ctx.stroke();

      // Vertical gridlines at 0, π/2, π, 3π/2, 2π
      ctx.strokeStyle = "rgba(138,144,164,0.18)";
      ctx.fillStyle = "rgba(138,144,164,0.7)";
      ctx.font = "10px ui-monospace, monospace";
      const ticks: Array<[number, string]> = [
        [0, "0"],
        [Math.PI / 2, "π/2"],
        [Math.PI, "π"],
        [(3 * Math.PI) / 2, "3π/2"],
        [TAU, "2π"],
      ];
      for (const [v, label] of ticks) {
        const x = padL + (v / TAU) * innerW;
        ctx.beginPath();
        ctx.moveTo(x, padT);
        ctx.lineTo(x, padT + innerH);
        ctx.stroke();
        ctx.fillText(label, x - 8, H - 4);
      }

      // ±1 labels
      ctx.fillText("1", 6, padT + 8);
      ctx.fillText("0", 6, midY + 4);
      ctx.fillText("−1", 2, padT + innerH);

      const samples = 240;
      const plot = (fn: (x: number) => number, stroke: string) => {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let i = 0; i <= samples; i++) {
          const tt = (i / samples) * TAU;
          const x = padL + (tt / TAU) * innerW;
          const y = midY - fn(tt) * (innerH / 2);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };
      // cos θ — amber
      plot(Math.cos, "rgba(255, 209, 102, 0.9)");
      // sin θ — cyan
      plot(Math.sin, "rgba(125, 243, 255, 0.9)");

      // Cursor at current θ
      const t = thetaRef.current;
      const cxLine = padL + (t / TAU) * innerW;
      ctx.strokeStyle = "rgba(255, 122, 182, 0.85)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(cxLine, padT);
      ctx.lineTo(cxLine, padT + innerH);
      ctx.stroke();
      // Dots on each curve at θ
      ctx.fillStyle = palette.signal.amber;
      ctx.beginPath();
      ctx.arc(cxLine, midY - Math.cos(t) * (innerH / 2), 3, 0, TAU);
      ctx.fill();
      ctx.fillStyle = palette.signal.cyan;
      ctx.beginPath();
      ctx.arc(cxLine, midY - Math.sin(t) * (innerH / 2), 3, 0, TAU);
      ctx.fill();

      // Legend
      ctx.fillStyle = "rgba(255, 209, 102, 0.9)";
      ctx.fillText("cos θ", padL + 6, padT + 12);
      ctx.fillStyle = "rgba(125, 243, 255, 0.9)";
      ctx.fillText("sin θ", padL + 54, padT + 12);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);

    let raf = 0;
    const loop = () => {
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [resetTick, dpr]);

  const reset = () => {
    setTheta(0);
    setResetTick((n) => n + 1);
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              Complex plane · unit circle
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              e^(iθ) = cos θ + i sin θ
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={planeRef} className="block h-full w-full" />
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            cos θ and sin θ · θ ∈ [0, 2π]
          </div>
          <div className="hairline h-40 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={stripRef} className="block h-full w-full" />
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Angle θ
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-teal">{theta.toFixed(3)} rad</span>
              <span className="text-ink-300">{((theta * 180) / Math.PI).toFixed(1)}°</span>
            </div>
            <input
              type="range"
              value={theta}
              min={0}
              max={TAU}
              step={0.01}
              onChange={(e) => setTheta(parseFloat(e.target.value))}
              className="w-full accent-signal-teal"
            />
            <div className="grid grid-cols-5 gap-2">
              {SPECIAL_ANGLES.map((a2) => {
                const active = Math.abs(theta - a2.theta) < 0.02;
                return (
                  <button
                    key={a2.label}
                    onClick={() => setTheta(a2.theta)}
                    className={`rounded-md border px-1 py-2 text-center transition-colors ${
                      active
                        ? "border-signal-teal/60 bg-signal-teal/10 text-signal-teal"
                        : "hairline text-ink-200 hover:border-signal-teal/40 hover:text-ink-100"
                    }`}
                  >
                    <div className="font-mono text-[11px]">{a2.label}</div>
                    <div className="mt-0.5 font-mono text-[9px] text-ink-400">z = {a2.z}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex gap-2">
              <button
                onClick={() => setRunning((v) => !v)}
                className={`flex-1 rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                  running
                    ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                    : "border-signal-teal/60 bg-signal-teal/10 text-signal-teal"
                }`}
              >
                {running ? "❚❚ Pause" : "▶ Play"}
              </button>
              <button
                onClick={reset}
                className="hairline flex-1 rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
              >
                ⟳ Reset
              </button>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Speed · rad/s
            </div>
            <input
              type="range"
              value={speed}
              min={0.05}
              max={3}
              step={0.05}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-signal-teal"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">
              {speed.toFixed(2)} rad/s
            </div>
          </div>

          <div className="hairline space-y-2 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              The identity moment
            </div>
            <p className="text-sm leading-relaxed text-ink-200">
              At θ = π the point lands exactly at z = −1. Adding 1 gives 0:
              <span className="mt-2 block font-mono text-signal-teal">e^(iπ) + 1 = 0</span>
            </p>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
