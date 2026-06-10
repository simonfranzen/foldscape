"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";

// Live Aizawa attractor with drag-to-rotate and a slider for parameter `b`
// (the most visually expressive dial — drives the basket-handled torus
// shape). Small enough to sit inline in the story page.

type Vec3 = [number, number, number];

// Canonical Aizawa params. We only expose `b` via the slider; the rest stay
// at their reference values from the explorer.
const A_DEF = 0.95;
const C_DEF = 0.6;
const D_DEF = 3.5;
const E_DEF = 0.25;
const F_DEF = 0.1;

function step([x, y, z]: Vec3, b: number, dt: number): Vec3 {
  const dx = (z - b) * x - D_DEF * y;
  const dy = D_DEF * x + (z - b) * y;
  const dz =
    C_DEF + A_DEF * z - (z * z * z) / 3 - (x * x + y * y) * (1 + E_DEF * z) + F_DEF * z * x * x * x;
  return [x + dx * dt, y + dy * dt, z + dz * dt];
}

interface Props {
  caption?: string;
  bLabel?: string;
  hint?: string;
}

export function AizawaInlineMini({ caption, bLabel, hint }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [b, setB] = useState(0.7);
  const yawRef = useRef(0.7);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const dpr = useDpr();

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

    // Pre-integrate the attractor. Warm up so transients die off.
    const N = 5000;
    const pts: Vec3[] = [];
    let p: Vec3 = [0.1, 0, 0];
    const dt = 0.01;
    for (let i = 0; i < 2000; i++) p = step(p, b, dt);
    for (let i = 0; i < N; i++) {
      p = step(p, b, dt);
      pts.push([...p] as Vec3);
    }

    let headT = 0;
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = "rgba(6, 7, 13, 0.22)";
      ctx.fillRect(0, 0, W, H);

      const yaw = yawRef.current;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const tilt = 0.45;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);

      // The Aizawa attractor lives roughly in [-1.7, 1.7]³. Pick scale to fit.
      const scale = Math.min(W, H) / 4.2;
      const ox = W / 2;
      const oy = H / 2 + scale * 0.1;

      const project = ([x, y, z]: Vec3): [number, number] => {
        const xr = cy * x - sy * y;
        const yr = sy * x + cy * y;
        const yt = ct * yr - st * z;
        const zt = st * yr + ct * z;
        const depth = 4 + zt;
        const k = 4 / depth;
        return [ox + xr * scale * k, oy - yt * scale * k];
      };

      ctx.lineWidth = 1.0 * dpr;
      ctx.lineCap = "round";

      for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = project(pts[i - 1]);
        const [bx, by] = project(pts[i]);
        const t = i / pts.length;
        const r = Math.floor(125 + (179 - 125) * t);
        const g = Math.floor(243 + (136 - 243) * t);
        const bl = Math.floor(255 + (255 - 255) * t);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${0.18 + 0.55 * t})`;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // Travelling head marker.
      // Was +7 per frame — at 60fps that's 420 indices/s through a 5000-pt
      // orbit, ~1.4 laps per second, fast enough to look hectic. +2.2 lands
      // at ~0.45 laps/s — comfortably watchable while still showing the flow.
      headT = (headT + 2.2) % pts.length;
      const head = pts[Math.floor(headT)];
      const [hx, hy] = project(head);
      ctx.fillStyle = "rgba(255, 122, 182, 0.95)";
      ctx.beginPath();
      ctx.arc(hx, hy, 2.6 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // Was 0.003 — that's ~10°/s; halve it so the rotation feels closer
      // to a contemplative drift than a spin.
      if (!draggingRef.current) yawRef.current += 0.0015;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [b, dpr]);

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
        className="hairline mx-auto block h-[340px] w-full max-w-[340px] cursor-grab touch-none rounded-md border bg-ink-950/80 active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
      <div className="flex items-center gap-4 pt-1">
        <div className="whitespace-nowrap font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          {bLabel ?? "b"} · <span className="text-signal-rose">{b.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={0.3}
          max={1.2}
          step={0.01}
          value={b}
          onChange={(e) => setB(parseFloat(e.target.value))}
          className="flex-1 accent-signal-rose"
        />
      </div>
      {hint && <p className="text-[11px] leading-relaxed text-ink-400">{hint}</p>}
    </div>
  );
}
