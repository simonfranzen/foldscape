"use client";

import { useEffect, useRef, useState } from "react";

// Small 3D renderer of Gabriel's Horn (the solid of revolution of y = 1/x
// around the x-axis, truncated at x = X_max). Drag to rotate. The volume
// V(X) and surface area A(X) are computed live and displayed below the
// canvas. V tends to π as X → ∞; A grows without bound (≥ 2π · ln X).

interface Props {
  caption?: string;
  xMaxLabel?: string;
  volumeLabel?: string;
  areaLabel?: string;
  hint?: string;
}

// V(X) = π · (1 − 1/X), A(X) = 2π ∫₁^X (1/x) · √(1 + 1/x⁴) dx.
// We integrate the surface area with Simpson's rule because the integrand
// is smooth (√(1 + 1/x⁴) > 1 always).
function volumeUpTo(X: number): number {
  if (X <= 1) return 0;
  return Math.PI * (1 - 1 / X);
}

function surfaceUpTo(X: number): number {
  if (X <= 1) return 0;
  // Simpson's rule with adaptive step count — denser near x = 1 where the
  // integrand spikes. For our range [1, 50] a log-spaced grid is plenty.
  const N = 600;
  const a = 1;
  const b = X;
  const f = (x: number) => (1 / x) * Math.sqrt(1 + 1 / (x * x * x * x));
  const h = (b - a) / N;
  let s = f(a) + f(b);
  for (let i = 1; i < N; i++) {
    const x = a + i * h;
    s += (i % 2 === 0 ? 2 : 4) * f(x);
  }
  return (2 * Math.PI * (s * h)) / 3;
}

export function GabrielsHornRenderer({ caption, xMaxLabel, volumeLabel, areaLabel, hint }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [xMax, setXMax] = useState(8);
  const yawRef = useRef(0.7);
  const pitchRef = useRef(0.25);
  const draggingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });

  const V = volumeUpTo(xMax);
  const A = surfaceUpTo(xMax);

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

    // Build a parametric mesh: x ∈ [1, xMax] log-spaced (so we get detail
    // near the flared mouth), θ ∈ [0, 2π]. Each vertex is (x, (1/x)cosθ,
    // (1/x)sinθ).
    const Nx = 48;
    const Nt = 32;
    const xs: number[] = [];
    const lnA = Math.log(1);
    const lnB = Math.log(xMax);
    for (let i = 0; i <= Nx; i++) {
      const t = i / Nx;
      xs.push(Math.exp(lnA + (lnB - lnA) * t));
    }

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      // Faint trail clear
      ctx.fillStyle = "rgba(5, 6, 10, 0.25)";
      ctx.fillRect(0, 0, W, H);

      const yaw = yawRef.current;
      const pitch = pitchRef.current;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);

      // Centre the horn in the canvas, scale so xMax fits.
      const scale = Math.min(W / (xMax + 2), H / 3.5);
      const ox = W * 0.18;
      const oy = H / 2;

      // 3D project: rotate yaw around y-axis, then pitch around x-axis.
      // Camera looks down +z. Slight perspective for depth.
      const project = (x: number, y: number, z: number): [number, number, number] => {
        // Translate so the horn body sits a bit forward.
        const xc = x - 1;
        // yaw around vertical (y) axis
        const xr = cy * xc + sy * z;
        const zr = -sy * xc + cy * z;
        // pitch around horizontal (x) axis
        const yr = cp * y - sp * zr;
        const zr2 = sp * y + cp * zr;
        const depth = 8 + zr2;
        const k = 8 / Math.max(0.2, depth);
        return [ox + xr * scale * k, oy - yr * scale * k, zr2];
      };

      // Draw circular cross-sections (rings) — gives a sense of the
      // shrinking radius.
      const ringStep = Math.max(2, Math.floor(Nx / 18));
      for (let i = 0; i <= Nx; i += ringStep) {
        const x = xs[i];
        const r = 1 / x;
        ctx.lineWidth = 0.8 * dpr;
        ctx.beginPath();
        for (let j = 0; j <= Nt; j++) {
          const theta = (j / Nt) * Math.PI * 2;
          const y = r * Math.cos(theta);
          const z = r * Math.sin(theta);
          const [px, py] = project(x, y, z);
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        const t = i / Nx;
        // Cyan near the mouth, violet deeper in.
        const cr = Math.floor(125 + (179 - 125) * t);
        const cg = Math.floor(243 + (136 - 243) * t);
        const cb = Math.floor(255 + (255 - 255) * t);
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.18 + 0.45 * (1 - t)})`;
        ctx.stroke();
      }

      // Longitudinal ribs.
      const ribs = 12;
      for (let j = 0; j < ribs; j++) {
        const theta = (j / ribs) * Math.PI * 2;
        ctx.lineWidth = 0.9 * dpr;
        ctx.beginPath();
        for (let i = 0; i <= Nx; i++) {
          const x = xs[i];
          const r = 1 / x;
          const y = r * Math.cos(theta);
          const z = r * Math.sin(theta);
          const [px, py] = project(x, y, z);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        // Highlight the front-facing ribs more.
        const facing = Math.cos(theta + yaw);
        const alpha = 0.18 + 0.4 * Math.max(0, facing);
        ctx.strokeStyle = `rgba(255, 209, 102, ${alpha})`;
        ctx.stroke();
      }

      // Axis indicator
      ctx.strokeStyle = "rgba(255, 122, 182, 0.35)";
      ctx.lineWidth = 0.8 * dpr;
      ctx.setLineDash([4 * dpr, 4 * dpr]);
      ctx.beginPath();
      const [ax0, ay0] = project(1, 0, 0);
      const [ax1, ay1] = project(xMax, 0, 0);
      ctx.moveTo(ax0, ay0);
      ctx.lineTo(ax1, ay1);
      ctx.stroke();
      ctx.setLineDash([]);

      // Cap the mouth at x = 1 (a disc of radius 1).
      ctx.strokeStyle = "rgba(125, 243, 255, 0.75)";
      ctx.lineWidth = 1.2 * dpr;
      ctx.beginPath();
      for (let j = 0; j <= 60; j++) {
        const theta = (j / 60) * Math.PI * 2;
        const y = Math.cos(theta);
        const z = Math.sin(theta);
        const [px, py] = project(1, y, z);
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Auto-spin if not dragging.
      if (!draggingRef.current) yawRef.current += 0.004;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [xMax]);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    lastRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastRef.current.x;
    const dy = e.clientY - lastRef.current.y;
    lastRef.current = { x: e.clientX, y: e.clientY };
    yawRef.current += dx * 0.01;
    pitchRef.current = Math.max(-0.9, Math.min(0.9, pitchRef.current + dy * 0.01));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
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
        className="hairline h-[280px] w-full cursor-grab touch-none rounded-md border bg-ink-950/80 active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
      <div className="flex items-center gap-4 pt-1">
        <div className="whitespace-nowrap font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          {xMaxLabel ?? "X_max"} · <span className="text-signal-rose">{xMax.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min={1}
          max={50}
          step={0.1}
          value={xMax}
          onChange={(e) => setXMax(parseFloat(e.target.value))}
          className="flex-1 accent-signal-rose"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="hairline rounded-md border bg-ink-950/60 p-3">
          <div className="mb-1 font-mono text-[9px] uppercase tracking-widest2 text-ink-300">
            {volumeLabel ?? "V(X)"}
          </div>
          <div className="math-italic text-xl text-signal-cyan">
            {V.toFixed(4)}{" "}
            <span className="font-mono text-[10px] text-ink-400">
              / π = {(V / Math.PI).toFixed(4)}
            </span>
          </div>
        </div>
        <div className="hairline rounded-md border bg-ink-950/60 p-3">
          <div className="mb-1 font-mono text-[9px] uppercase tracking-widest2 text-ink-300">
            {areaLabel ?? "A(X)"}
          </div>
          <div className="math-italic text-xl text-signal-rose">
            {A.toFixed(3)}{" "}
            <span className="font-mono text-[10px] text-ink-400">
              ≥ 2π ln X = {(2 * Math.PI * Math.log(xMax)).toFixed(3)}
            </span>
          </div>
        </div>
      </div>
      {hint && <p className="text-[11px] leading-relaxed text-ink-400">{hint}</p>}
    </div>
  );
}
