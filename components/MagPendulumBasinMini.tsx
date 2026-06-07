"use client";

import { useEffect, useRef, useState } from "react";

// Three magnets at the vertices of an equilateral triangle of radius 1.
// Colours: cyan, violet, amber — the palette mandated for the rose-accented
// magnetic-pendulum story page.
const MAGNETS = [
  { x: 0, y: -1, rgb: [125, 243, 255] }, // cyan
  { x: -Math.sin((Math.PI * 2) / 3), y: 0.5, rgb: [179, 136, 255] }, // violet
  { x: Math.sin((Math.PI * 2) / 3), y: 0.5, rgb: [255, 209, 102] }, // amber
];

// Lightweight version of the explorer's integrator. Same equation:
//   p̈ = − γ ṗ − ω² p − Σ k (p − mᵢ) / ((p − mᵢ)² + h²)^(3/2)
function settle(
  startX: number,
  startY: number,
  k: number,
  gamma: number,
  omega2: number,
  h: number,
  maxSteps: number,
): number {
  let x = startX;
  let y = startY;
  let vx = 0;
  let vy = 0;
  const dt = 0.03; // larger step for speed in low-res grid
  const settleR2 = 0.06;
  const settleV2 = 0.005;
  for (let step = 0; step < maxSteps; step++) {
    let ax = -gamma * vx - omega2 * x;
    let ay = -gamma * vy - omega2 * y;
    for (let i = 0; i < 3; i++) {
      const dx = x - MAGNETS[i].x;
      const dy = y - MAGNETS[i].y;
      const r2 = dx * dx + dy * dy + h * h;
      const r3 = r2 * Math.sqrt(r2);
      ax -= (k * dx) / r3;
      ay -= (k * dy) / r3;
    }
    vx += ax * dt;
    vy += ay * dt;
    x += vx * dt;
    y += vy * dt;
    if (!Number.isFinite(x) || !Number.isFinite(y) || x * x + y * y > 1e6) break;
    if ((step & 7) === 0) {
      for (let i = 0; i < 3; i++) {
        const dx = x - MAGNETS[i].x;
        const dy = y - MAGNETS[i].y;
        if (dx * dx + dy * dy < settleR2 && vx * vx + vy * vy < settleV2) return i;
      }
    }
  }
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < 3; i++) {
    const dx = x - MAGNETS[i].x;
    const dy = y - MAGNETS[i].y;
    const d2 = dx * dx + dy * dy;
    if (d2 < bestD) {
      bestD = d2;
      best = i;
    }
  }
  return best;
}

interface Props {
  caption: string;
  dampingLabel: string;
  strengthLabel: string;
  hint: string;
  computingLabel: string;
  readyLabel: string;
}

export function MagPendulumBasinMini({
  caption,
  dampingLabel,
  strengthLabel,
  hint,
  computingLabel,
  readyLabel,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [k, setK] = useState(0.4);
  const [gamma, setGamma] = useState(0.2);
  const [progress, setProgress] = useState(1);
  const [computing, setComputing] = useState(false);

  // Fixed for the inline mini — keeps the UI tight.
  const omega2 = 0.5;
  const h = 0.18;
  const span = 2.0;
  const R = 80; // ~6400 trajectories — runs in ~0.5–1s
  const maxSteps = 1500;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.floor(canvas.clientWidth * dpr);
    const H = Math.floor(canvas.clientHeight * dpr);
    canvas.width = W;
    canvas.height = H;

    setComputing(true);
    setProgress(0);

    const tmp = document.createElement("canvas");
    tmp.width = R;
    tmp.height = R;
    const tctx = tmp.getContext("2d");
    if (!tctx) return;
    const img = tctx.createImageData(R, R);

    // Solid background while computing.
    ctx.fillStyle = "#06070d";
    ctx.fillRect(0, 0, W, H);

    let cancelled = false;
    let row = 0;
    const sliceRows = 4;

    const drawOverlay = () => {
      // Re-paint upscaled basin, then magnets on top.
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tmp, 0, 0, W, H);
      for (let i = 0; i < 3; i++) {
        const m = MAGNETS[i];
        const px = ((m.x + span) / (2 * span)) * W;
        const py = ((m.y + span) / (2 * span)) * H;
        ctx.fillStyle = "rgba(6, 7, 13, 0.7)";
        ctx.beginPath();
        ctx.arc(px, py, 6 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgb(${m.rgb.join(",")})`;
        ctx.beginPath();
        ctx.arc(px, py, 4 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      if (cancelled) return;
      for (let s = 0; s < sliceRows && row < R; s++, row++) {
        for (let col = 0; col < R; col++) {
          const sx = ((col + 0.5) / R) * (2 * span) - span;
          const sy = ((row + 0.5) / R) * (2 * span) - span;
          const winner = settle(sx, sy, k, gamma, omega2, h, maxSteps);
          const c = MAGNETS[winner].rgb;
          const idx = (row * R + col) * 4;
          img.data[idx] = Math.floor(c[0] * 0.7);
          img.data[idx + 1] = Math.floor(c[1] * 0.7);
          img.data[idx + 2] = Math.floor(c[2] * 0.7);
          img.data[idx + 3] = 255;
        }
      }
      tctx.putImageData(img, 0, 0);
      drawOverlay();
      setProgress(row / R);
      if (row < R) {
        requestAnimationFrame(step);
      } else {
        setComputing(false);
      }
    };
    requestAnimationFrame(step);

    return () => {
      cancelled = true;
    };
  }, [k, gamma]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
          {caption}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
          {computing ? `${computingLabel} ${(progress * 100).toFixed(0)}%` : readyLabel}
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[1fr_220px]">
        <div className="hairline relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-xl border bg-ink-950">
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
        </div>

        <div className="space-y-4">
          <SliderRow
            label={strengthLabel}
            value={k}
            min={0.1}
            max={0.9}
            step={0.02}
            display={k.toFixed(2)}
            onChange={setK}
          />
          <SliderRow
            label={dampingLabel}
            value={gamma}
            min={0.05}
            max={0.5}
            step={0.01}
            display={gamma.toFixed(2)}
            onChange={setGamma}
          />
          <div className="flex items-center gap-2 pt-2">
            {MAGNETS.map((m, i) => (
              <span
                key={i}
                className="h-3 w-3 rounded-full"
                style={{ background: `rgb(${m.rgb.join(",")})` }}
                aria-hidden="true"
              />
            ))}
            <span className="font-mono text-[9px] uppercase tracking-widest2 text-ink-400">
              M1 · M2 · M3
            </span>
          </div>
        </div>
      </div>

      <p className="mx-auto max-w-xl text-center text-xs leading-relaxed text-ink-300">{hint}</p>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">{label}</div>
        <div className="font-mono text-[10px] text-ink-400">{display}</div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-signal-rose"
      />
    </div>
  );
}
