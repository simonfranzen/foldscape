"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Vogel-model sunflower phyllotaxis renderer for the φ story page. Seeds are
// placed at (r, θ) = (c·√n, n·α). The user controls α from 137.0° to 138.0°
// in tenths of a degree — the golden angle 137.508° produces dense, gap-free
// packing; any other value reveals visible radial spokes or clumps.

interface Props {
  caption: string;
  angleLabel: string;
  seedsLabel: string;
  hint: string;
  goldenLabel: string;
}

const SIZE = 360;
const CENTER = SIZE / 2;
const GOLDEN_DEG = 137.507764;

export function PhiSunflowerSim({ caption, angleLabel, seedsLabel, hint, goldenLabel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();
  // Step in hundredths of a degree so 137.5077 (golden) is reachable exactly.
  const [angle, setAngle] = useState<number>(137.51);
  const [seedCount, setSeedCount] = useState<number>(640);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Ink background
    ctx.fillStyle = palette.canvas.bg;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Subtle disk halo
    const halo = ctx.createRadialGradient(CENTER, CENTER, 20, CENTER, CENTER, CENTER);
    halo.addColorStop(0, "rgba(255, 209, 102, 0.06)");
    halo.addColorStop(1, "rgba(255, 209, 102, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, CENTER - 2, 0, Math.PI * 2);
    ctx.fill();

    const alphaRad = (angle * Math.PI) / 180;
    // Choose c so the outermost seed sits near the disk boundary.
    const cScale = (CENTER - 8) / Math.sqrt(seedCount);
    const offGolden = Math.min(1, Math.abs(angle - GOLDEN_DEG) / 0.4);

    for (let n = 1; n <= seedCount; n++) {
      const r = cScale * Math.sqrt(n);
      const theta = n * alphaRad;
      const x = CENTER + r * Math.cos(theta);
      const y = CENTER + r * Math.sin(theta);
      // Outermost seeds slightly larger; far-from-golden draws warmer/rosier.
      const t = n / seedCount;
      const rad = 1.2 + 1.6 * t;
      // Lerp amber → rose as |angle − golden| grows.
      const r0 = 255;
      const g0 = 209 - 60 * offGolden;
      const b0 = 102 + 100 * offGolden;
      const alpha = 0.55 + 0.35 * t;
      ctx.fillStyle = `rgba(${r0 | 0}, ${g0 | 0}, ${b0 | 0}, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [angle, seedCount, dpr]);

  const diffDeg = angle - GOLDEN_DEG;
  const isGolden = Math.abs(diffDeg) < 0.005;

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>

      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="shrink-0">
          <canvas
            ref={canvasRef}
            className="hairline rounded-xl border bg-ink-950"
            aria-label="Sunflower phyllotaxis simulation"
          />
        </div>

        <div className="w-full flex-1 space-y-5">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor="phi-sun-angle"
                className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
              >
                {angleLabel}
              </label>
              <span className="font-mono text-sm text-signal-amber">{angle.toFixed(2)}°</span>
            </div>
            <input
              id="phi-sun-angle"
              type="range"
              min={137.0}
              max={138.0}
              step={0.01}
              value={angle}
              onChange={(e) => setAngle(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-ink-400">
              <span>137.00°</span>
              <button
                type="button"
                onClick={() => setAngle(137.51)}
                className={`hairline rounded border px-2 py-1 transition-colors ${
                  isGolden
                    ? "border-signal-amber/70 bg-signal-amber/10 text-signal-amber"
                    : "border-ink-700 text-ink-300 hover:border-signal-amber/40 hover:text-signal-amber"
                }`}
              >
                {goldenLabel}
              </button>
              <span>138.00°</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor="phi-sun-seeds"
                className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
              >
                {seedsLabel}
              </label>
              <span className="font-mono text-sm text-signal-amber">{seedCount}</span>
            </div>
            <input
              id="phi-sun-seeds"
              type="range"
              min={120}
              max={1400}
              step={20}
              value={seedCount}
              onChange={(e) => setSeedCount(parseInt(e.target.value, 10))}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3 font-mono text-[11px] leading-relaxed text-ink-200">
            <div>
              α − 360°/φ² ={" "}
              <span className="text-signal-amber">
                {diffDeg >= 0 ? "+" : ""}
                {diffDeg.toFixed(3)}°
              </span>
            </div>
            <div className="text-ink-300">
              360° / φ² = <span className="text-signal-amber">137.508°</span>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-ink-300">{hint}</p>
        </div>
      </div>
    </div>
  );
}
