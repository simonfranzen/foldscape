"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

type WaveType = "square" | "sawtooth" | "triangle";

const WAVE_LABEL: Record<WaveType, string> = {
  square: "Square",
  sawtooth: "Sawtooth",
  triangle: "Triangle",
};

// Returns the k-th sine coefficient for the target waveform.
// All waveforms are pure-sine series in t ∈ [0,1).
function coeff(wave: WaveType, k: number): number {
  if (wave === "square") {
    // 4/π · Σ sin((2m−1)·2πt) / (2m−1)
    if (k % 2 === 0) return 0;
    return 4 / Math.PI / k;
  }
  if (wave === "sawtooth") {
    // 2/π · Σ (−1)^(k+1) · sin(k·2πt) / k
    return ((2 / Math.PI) * (k % 2 === 0 ? -1 : 1)) / k;
  }
  // triangle: 8/π² · Σ (−1)^m · sin((2m+1)·2πt) / (2m+1)²
  if (k % 2 === 0) return 0;
  const m = (k - 1) / 2;
  return ((8 / (Math.PI * Math.PI)) * (m % 2 === 0 ? 1 : -1)) / (k * k);
}

function target(wave: WaveType, t: number): number {
  const u = ((t % 1) + 1) % 1;
  if (wave === "square") return u < 0.5 ? 1 : -1;
  if (wave === "sawtooth") return 2 * (u - Math.floor(u + 0.5));
  // triangle, peak ±1
  return 4 * Math.abs(u - 0.5) - 1;
}

function partial(wave: WaveType, N: number, t: number): number {
  let s = 0;
  for (let k = 1; k <= N; k++) {
    const a = coeff(wave, k);
    if (a === 0) continue;
    s += a * Math.sin(k * 2 * Math.PI * t);
  }
  return s;
}

interface Props {
  caption?: string;
  height?: number;
}

export function FourierHarmonicBuilder({ caption, height = 180 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wave, setWave] = useState<WaveType>("square");
  const [N, setN] = useState(5);
  const dpr = useDpr();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (canvas.width !== Math.floor(W * dpr) || canvas.height !== Math.floor(H * dpr)) {
        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // baseline / midline
      ctx.strokeStyle = "rgba(138,144,164,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();

      const Y = (v: number) => H / 2 - (v / 1.4) * (H / 2 - 12);
      const X = (t: number) => t * W;
      const STEPS = 480;

      // Target — faint white
      ctx.strokeStyle = "rgba(232,235,245,0.32)";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS;
        const y = Y(target(wave, t));
        if (i === 0) ctx.moveTo(X(t), y);
        else ctx.lineTo(X(t), y);
      }
      ctx.stroke();

      // Individual harmonics — violet, dim
      ctx.strokeStyle = "rgba(179,136,255,0.30)";
      ctx.lineWidth = 0.9;
      for (let k = 1; k <= N; k++) {
        const a = coeff(wave, k);
        if (a === 0) continue;
        ctx.beginPath();
        for (let i = 0; i <= STEPS; i++) {
          const t = i / STEPS;
          const y = Y(a * Math.sin(k * 2 * Math.PI * t));
          if (i === 0) ctx.moveTo(X(t), y);
          else ctx.lineTo(X(t), y);
        }
        ctx.stroke();
      }

      // Partial sum — amber, bright
      ctx.strokeStyle = palette.signal.amber;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS;
        const y = Y(partial(wave, N, t));
        if (i === 0) ctx.moveTo(X(t), y);
        else ctx.lineTo(X(t), y);
      }
      ctx.stroke();
    };

    render();
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    });
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [wave, N, dpr]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5">
      {caption && (
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
          {caption}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(WAVE_LABEL) as WaveType[]).map((w) => (
          <button
            key={w}
            onClick={() => setWave(w)}
            className={`rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
              wave === w
                ? "border-signal-amber/70 bg-signal-amber/10 text-signal-amber"
                : "hairline text-ink-300 hover:text-ink-100"
            }`}
          >
            {WAVE_LABEL[w]}
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        style={{ height }}
        className="hairline block w-full rounded-lg border"
      />
      <div className="flex items-center gap-4">
        <label className="shrink-0 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          N = <span className="text-signal-amber">{N}</span>
        </label>
        <input
          type="range"
          min={1}
          max={30}
          value={N}
          onChange={(e) => setN(parseInt(e.target.value))}
          className="w-full accent-signal-amber"
        />
      </div>
      <p className="text-[11px] leading-relaxed text-ink-400">
        White: the target. Violet: each individual harmonic. Amber: their sum. Push N up and the
        corners sharpen — but the overshoot at the discontinuities never quite goes away (Gibbs
        phenomenon, ≈ 8.95%).
      </p>
    </div>
  );
}
