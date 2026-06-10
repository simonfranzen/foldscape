"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";

// Live ρ slider with a small canvas trajectory rendering. RK4 integration of
// the Lorenz system. Drag the canvas to rotate the camera around the
// vertical (z) axis. Kept deliberately small so it can sit inline in the
// story page.

type Vec3 = [number, number, number];

const SIGMA = 10;
const BETA = 8 / 3;

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
}

export function LorenzInlineRho({ caption, rhoLabel, hint }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rho, setRho] = useState(28);
  const yawRef = useRef(0.6);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const dpr = useDpr();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let raf = 0;

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pre-integrate a buffer of points each frame; the buffer is reset when
    // rho changes (handled via dependency rebuild below).
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
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = "rgba(5, 6, 10, 0.18)";
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
        const r = Math.floor(125 + (255 - 125) * t);
        const g = Math.floor(243 + (122 - 243) * t);
        const b = Math.floor(255 + (182 - 255) * t);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.18 + 0.5 * t})`;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // Animated head marker — moves along the buffer to show motion.
      headT = (headT + 6) % pts.length;
      const head = pts[Math.floor(headT)];
      const [hx, hy] = project(head);
      ctx.fillStyle = "rgba(255, 209, 102, 0.95)";
      ctx.beginPath();
      ctx.arc(hx, hy, 2.4 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // Slow continuous yaw drift if user isn't dragging.
      if (!draggingRef.current) yawRef.current += 0.0028;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [rho, dpr]);

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
  };
  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
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
        className="hairline h-[220px] w-full cursor-grab touch-none rounded-md border bg-ink-950/80 active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
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
          onChange={(e) => setRho(parseFloat(e.target.value))}
          className="flex-1 accent-signal-rose"
        />
      </div>
      {hint && <p className="text-[11px] leading-relaxed text-ink-400">{hint}</p>}
    </div>
  );
}
