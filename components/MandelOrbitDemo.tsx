"use client";

import { useEffect, useRef, useState } from "react";
import { getDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Plots a tiny complex plane and animates the orbit of z₀ = 0 under
// zₙ₊₁ = zₙ² + c for a fixed c. Three regimes are interesting:
//  - c inside the set: orbit converges
//  - c near the boundary: orbit dances forever
//  - c outside: orbit escapes quickly

interface Props {
  c: [number, number];
  label: string;
  accent: string; // tailwind text colour class
  maxSteps?: number;
  bound?: number; // half-width of the plot in complex units
  speedMs?: number; // ms per step
}

const MAX_PLOT_RADIUS = 4.5;

export function MandelOrbitDemo({
  c,
  label,
  accent,
  maxSteps = 60,
  bound = 1.8,
  speedMs = 120,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reduced, setReduced] = useState(false);

  // Honour prefers-reduced-motion: draw one static frame, no rAF loop.
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let stepIndex = 0;
    const orbit: Array<[number, number]> = [[0, 0]];

    const resize = () => {
      const dpr = getDpr();
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const W = () => canvas.clientWidth;
    const H = () => canvas.clientHeight;
    const px = (x: number) => W() / 2 + (x / bound) * (Math.min(W(), H()) / 2);
    const py = (y: number) => H() / 2 - (y / bound) * (Math.min(W(), H()) / 2);

    const step = () => {
      const [zx, zy] = orbit[orbit.length - 1];
      const nx = zx * zx - zy * zy + c[0];
      const ny = 2 * zx * zy + c[1];
      if (Math.hypot(nx, ny) > MAX_PLOT_RADIUS) {
        // restart cycle
        orbit.length = 0;
        orbit.push([0, 0]);
        stepIndex = 0;
        return;
      }
      orbit.push([nx, ny]);
      stepIndex++;
      if (stepIndex >= maxSteps) {
        orbit.length = 0;
        orbit.push([0, 0]);
        stepIndex = 0;
      }
    };

    const draw = () => {
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W(), H());

      // faint axes
      ctx.strokeStyle = "rgba(138,144,164,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, H() / 2);
      ctx.lineTo(W(), H() / 2);
      ctx.moveTo(W() / 2, 0);
      ctx.lineTo(W() / 2, H());
      ctx.stroke();

      // unit circle for reference
      ctx.strokeStyle = "rgba(138,144,164,0.25)";
      ctx.beginPath();
      ctx.arc(px(0), py(0), (1 / bound) * (Math.min(W(), H()) / 2), 0, Math.PI * 2);
      ctx.stroke();

      // c marker
      ctx.fillStyle = palette.signal.amber;
      ctx.beginPath();
      ctx.arc(px(c[0]), py(c[1]), 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillStyle = "rgba(230,232,240,0.8)";
      ctx.fillText("c", px(c[0]) + 7, py(c[1]) - 7);

      // orbit polyline
      const grad = ctx.createLinearGradient(0, 0, W(), 0);
      grad.addColorStop(0, "rgba(179, 136, 255, 0.0)");
      grad.addColorStop(1, "rgba(179, 136, 255, 0.9)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i < orbit.length; i++) {
        const [x, y] = orbit[i];
        if (i === 0) ctx.moveTo(px(x), py(y));
        else ctx.lineTo(px(x), py(y));
      }
      ctx.stroke();

      // orbit dots
      for (let i = 0; i < orbit.length; i++) {
        const [x, y] = orbit[i];
        const t = i / Math.max(1, orbit.length - 1);
        ctx.fillStyle = `hsla(${200 + t * 100}, 80%, ${50 + t * 25}%, ${0.4 + t * 0.6})`;
        ctx.beginPath();
        ctx.arc(px(x), py(y), 2 + t * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // label
      ctx.fillStyle = "rgba(168,175,191,0.75)";
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillText(`step ${orbit.length - 1}`, 8, H() - 8);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw();
    });
    ro.observe(canvas);

    if (reduced) {
      // Build the orbit once (stopping at escape) and draw a single frame.
      for (let k = 0; k < maxSteps; k++) {
        const [zx, zy] = orbit[orbit.length - 1];
        const nx = zx * zx - zy * zy + c[0];
        const ny = 2 * zx * zy + c[1];
        if (Math.hypot(nx, ny) > MAX_PLOT_RADIUS) break;
        orbit.push([nx, ny]);
      }
      draw();
      return () => ro.disconnect();
    }

    const loop = (now: number) => {
      acc += now - last;
      last = now;
      while (acc >= speedMs) {
        acc -= speedMs;
        step();
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [c, maxSteps, bound, speedMs, reduced]);

  return (
    <div className="hairline space-y-2 rounded-2xl border bg-ink-950/40 p-4">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>{label}</div>
      <div className="hairline aspect-square w-full overflow-hidden rounded-md border bg-ink-950">
        <canvas ref={canvasRef} role="img" aria-label={label} className="block h-full w-full" />
      </div>
      <div className="font-mono text-[10px] text-ink-300">
        c = {c[0].toFixed(2)} {c[1] >= 0 ? "+" : "−"} {Math.abs(c[1]).toFixed(2)}i
      </div>
    </div>
  );
}
