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
  // Set while prefers-reduced-motion is active so a drag can repaint the frozen
  // frame; null while the live animation loop runs.
  const repaintRef = useRef<(() => void) | null>(null);
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
      // A resize wipes the canvas; the animated loop redraws next frame, but the
      // frozen (reduced-motion) frame must be repainted explicitly.
      repaintRef.current?.();
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

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    // The Aizawa attractor lives roughly in [-1.7, 1.7]³. Build a projector for
    // the current yaw/canvas size; both the live loop and the frozen frame use it.
    const makeProject = () => {
      const W = canvas.width;
      const H = canvas.height;
      const yaw = yawRef.current;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const tilt = 0.45;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      const scale = Math.min(W, H) / 4.2;
      const ox = W / 2;
      const oy = H / 2 + scale * 0.1;
      return ([x, y, z]: Vec3): [number, number] => {
        const xr = cy * x - sy * y;
        const yr = sy * x + cy * y;
        const yt = ct * yr - st * z;
        const zt = st * yr + ct * z;
        const depth = 4 + zt;
        const k = 4 / depth;
        return [ox + xr * scale * k, oy - yt * scale * k];
      };
    };

    const drawSegments = (project: (p: Vec3) => [number, number]) => {
      ctx.lineWidth = 1.0 * dpr;
      ctx.lineCap = "round";
      for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = project(pts[i - 1]);
        const [bx, by] = project(pts[i]);
        const t = i / pts.length;
        const r = Math.floor(125 + (179 - 125) * t);
        const g = Math.floor(243 + (136 - 243) * t);
        ctx.strokeStyle = `rgba(${r}, ${g}, 255, ${0.18 + 0.55 * t})`;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
    };

    // Reduced motion: one frozen full-orbit frame, no fade trail, no travelling
    // head, no auto-yaw. Repainted on drag/resize via repaintRef.
    const paintStatic = () => {
      ctx.fillStyle = "rgb(6, 7, 13)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawSegments(makeProject());
    };

    let headT = 0;
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = "rgba(6, 7, 13, 0.22)";
      ctx.fillRect(0, 0, W, H);

      const project = makeProject();
      drawSegments(project);

      // Travelling head marker.
      // +2.2 per frame lands at ~0.45 laps/s through the 5000-pt orbit,
      // comfortably watchable while still showing the flow.
      headT = (headT + 2.2) % pts.length;
      const head = pts[Math.floor(headT)];
      const [hx, hy] = project(head);
      ctx.fillStyle = "rgba(255, 122, 182, 0.95)";
      ctx.beginPath();
      ctx.arc(hx, hy, 2.6 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // 0.0015 rad/frame is ~5°/s, a contemplative drift rather than a spin.
      if (!draggingRef.current) yawRef.current += 0.0015;
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduceMq.matches) {
        repaintRef.current = paintStatic;
        paintStatic();
      } else {
        repaintRef.current = null;
        raf = requestAnimationFrame(draw);
      }
    };
    start();
    reduceMq.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      reduceMq.removeEventListener("change", start);
      repaintRef.current = null;
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
    // No animation loop under reduced motion, so repaint on the drag itself.
    repaintRef.current?.();
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
        role="img"
        aria-label={caption ?? "Aizawa attractor"}
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
          aria-label={bLabel ?? "b"}
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
