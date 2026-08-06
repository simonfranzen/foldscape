"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Live ρ slider with a small canvas trajectory rendering. RK4 integration of
// the Lorenz system. Drag the canvas (or use the arrow keys when focused) to
// rotate the camera around the vertical (z) axis. Kept deliberately small so
// it can sit inline in the story page.

type Vec3 = [number, number, number];

const SIGMA = 10;
const BETA = 8 / 3;

// Colours pulled from the shared palette so they follow a palette change
// instead of drifting as raw rgba literals.
const channels = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const withAlpha = (hex: string, a: number) => {
  const [r, g, b] = channels(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
const [C0R, C0G, C0B] = channels(palette.signal.cyan);
const [C1R, C1G, C1B] = channels(palette.signal.rose);
const BG_FADE = withAlpha(palette.canvas.bg, 0.18);
const BG_SOLID = palette.canvas.bg;
const HEAD_COLOR = withAlpha(palette.signal.amber, 0.95);

function deriv([x, y, z]: Vec3, rho: number): Vec3 {
  return [SIGMA * (y - x), x * (rho - z) - y, x * y - BETA * z];
}

function rk4(p: Vec3, rho: number, h: number): Vec3 {
  const k1 = deriv(p, rho);
  const p2: Vec3 = [p[0] + (h / 2) * k1[0], p[1] + (h / 2) * k1[1], p[2] + (h / 2) * k1[2]];
  const k2 = deriv(p2, rho);
  const p3: Vec3 = [p[0] + (h / 2) * k2[0], p[1] + (h / 2) * k2[1], p[2] + (h / 2) * k2[2]];
  const k3 = deriv(p3, rho);
  const p4: Vec3 = [p[0] + h * k3[0], p[1] + h * k3[1], p[2] + h * k3[2]];
  const k4 = deriv(p4, rho);
  return [
    p[0] + (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    p[1] + (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    p[2] + (h / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
  ];
}

interface Props {
  caption?: string;
  rhoLabel?: string;
  hint?: string;
  canvasLabel?: string;
}

export function LorenzInlineRho({ caption, rhoLabel, hint, canvasLabel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rho, setRho] = useState(28);
  const [reduced, setReduced] = useState(false);
  const yawRef = useRef(0.6);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  // When reduced-motion is on there is no rAF loop, so keyboard/drag rotation
  // re-renders through this stored function instead.
  const redrawRef = useRef<(() => void) | null>(null);
  const dpr = useDpr();

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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    let raf = 0;

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pre-integrate a buffer of points; the buffer is rebuilt when rho changes
    // (handled via dependency rebuild below).
    const N = 4000;
    const pts: Vec3[] = [];
    let p: Vec3 = [0.1, 0, 1];
    // Warm up so the trajectory settles on the attractor before we draw.
    for (let i = 0; i < 1000; i++) p = rk4(p, rho, 0.01);
    for (let i = 0; i < N; i++) {
      p = rk4(p, rho, 0.01);
      pts.push([...p] as Vec3);
    }

    let headT = 0;

    const paint = (fadeStyle: string) => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = fadeStyle;
      ctx.fillRect(0, 0, W, H);

      // Camera: yaw rotation around z, slight tilt.
      const yaw = yawRef.current;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const tilt = 0.35;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);

      // Auto-scale so attractor fits regardless of rho.
      const scale = Math.min(W, H) / 70;
      const ox = W / 2;
      const oy = H / 2 + scale * 8;

      const project = ([x, y, z]: Vec3): [number, number] => {
        const xr = cy * x - sy * y;
        const yr = sy * x + cy * y;
        const yt = ct * yr - st * (z - 25);
        const zt = st * yr + ct * (z - 25);
        const depth = 60 + zt; // for slight perspective
        const k = 60 / depth;
        return [ox + xr * scale * k, oy - yt * scale * k];
      };

      ctx.lineWidth = 1.1 * dpr;
      ctx.lineCap = "round";

      // Draw trajectory as gradient segments. Older points dimmer.
      for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = project(pts[i - 1]);
        const [bx, by] = project(pts[i]);
        const t = i / pts.length;
        const r = Math.floor(C0R + (C1R - C0R) * t);
        const g = Math.floor(C0G + (C1G - C0G) * t);
        const b = Math.floor(C0B + (C1B - C0B) * t);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.18 + 0.5 * t})`;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // Head marker showing motion (or a fixed point in reduced-motion mode).
      const head = pts[Math.floor(headT)];
      const [hx, hy] = project(head);
      ctx.fillStyle = HEAD_COLOR;
      ctx.beginPath();
      ctx.arc(hx, hy, 2.4 * dpr, 0, Math.PI * 2);
      ctx.fill();
    };

    // Reduced motion: render one static frame, no fade, no drift, no loop.
    // Rotation via drag/keys re-renders through redrawRef.
    if (reduced) {
      headT = 0;
      redrawRef.current = () => paint(BG_SOLID);
      redrawRef.current();
      return () => {
        redrawRef.current = null;
        ro.disconnect();
      };
    }

    redrawRef.current = null;
    const draw = () => {
      headT = (headT + 6) % pts.length;
      paint(BG_FADE);
      // Slow continuous yaw drift if user isn't dragging.
      if (!draggingRef.current) yawRef.current += 0.0028;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [rho, dpr, reduced]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    yawRef.current += dx * 0.01;
    redrawRef.current?.();
  };
  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (e.key === "ArrowLeft") {
      yawRef.current -= 0.12;
      e.preventDefault();
      redrawRef.current?.();
    } else if (e.key === "ArrowRight") {
      yawRef.current += 0.12;
      e.preventDefault();
      redrawRef.current?.();
    }
  };

  return (
    <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-5 md:p-6">
      {caption && (
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
          {caption}
        </div>
      )}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={canvasLabel ?? caption ?? "Lorenz attractor, drag or use arrow keys to rotate"}
        tabIndex={0}
        className="hairline h-[220px] w-full cursor-grab touch-none rounded-md border bg-ink-950/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-rose active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onKeyDown={onKeyDown}
      />
      <div className="flex items-center gap-4 pt-1">
        <div className="whitespace-nowrap font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          {rhoLabel ?? "ρ"} · <span className="text-signal-rose">{rho.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min={0.5}
          max={35}
          step={0.1}
          value={rho}
          aria-label={rhoLabel ?? "ρ"}
          onChange={(e) => setRho(parseFloat(e.target.value))}
          className="flex-1 accent-signal-rose"
        />
      </div>
      {hint && <p className="text-[11px] leading-relaxed text-ink-400">{hint}</p>}
    </div>
  );
}
