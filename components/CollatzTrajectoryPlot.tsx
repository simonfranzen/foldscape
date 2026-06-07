"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Small inline Collatz trajectory plotter for the story page. The user
// types a starting integer; the canvas draws the hailstone orbit on a log
// scale, marking the stopping time and the peak value.

interface Props {
  caption: string;
  inputLabel: string;
  presetLabel: string;
  stepsLabel: string;
  peakLabel: string;
  hint: string;
  presets?: number[];
}

const W = 360;
const H = 220;
const PAD_L = 36;
const PAD_R = 12;
const PAD_T = 14;
const PAD_B = 24;

function collatzOrbit(seed: number, cap: number = 100000): number[] {
  const out: number[] = [];
  let n = seed;
  out.push(n);
  let guard = 0;
  while (n !== 1 && guard < cap) {
    n = n % 2 === 0 ? n / 2 : 3 * n + 1;
    out.push(n);
    guard += 1;
  }
  return out;
}

export function CollatzTrajectoryPlot({
  caption,
  inputLabel,
  presetLabel,
  stepsLabel,
  peakLabel,
  hint,
  presets = [27, 871, 6171, 77031],
}: Props) {
  const [seed, setSeed] = useState(27);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const orbit = useMemo(() => {
    const n = Number.isFinite(seed) && seed >= 1 ? Math.floor(seed) : 1;
    return collatzOrbit(n);
  }, [seed]);

  const peak = useMemo(() => {
    let v = 0;
    let i = 0;
    for (let k = 0; k < orbit.length; k++) {
      if (orbit[k] > v) {
        v = orbit[k];
        i = k;
      }
    }
    return { value: v, index: i };
  }, [orbit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "#06070d";
    ctx.fillRect(0, 0, W, H);

    const innerW = W - PAD_L - PAD_R;
    const innerH = H - PAD_T - PAD_B;
    const steps = Math.max(1, orbit.length - 1);
    const yMax = Math.log10(Math.max(2, peak.value)) + 0.1;
    const xAt = (i: number) => PAD_L + (i / steps) * innerW;
    const yAt = (v: number) => PAD_T + innerH - (Math.log10(Math.max(1, v)) / yMax) * innerH;

    // grid lines at powers of 10
    ctx.strokeStyle = "rgba(138,144,164,0.18)";
    ctx.lineWidth = 1;
    ctx.font = "9px ui-monospace, monospace";
    ctx.fillStyle = "#8a90a4";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let p = 0; p <= Math.ceil(yMax); p++) {
      const y = yAt(Math.pow(10, p));
      ctx.beginPath();
      ctx.moveTo(PAD_L, y);
      ctx.lineTo(W - PAD_R, y);
      ctx.stroke();
      ctx.fillText(`10^${p}`, PAD_L - 4, y);
    }

    // orbit line
    ctx.strokeStyle = "rgba(255,122,182,0.9)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let i = 0; i < orbit.length; i++) {
      const x = xAt(i);
      const y = yAt(orbit[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // orbit dots
    ctx.fillStyle = "#ff7ab6";
    for (let i = 0; i < orbit.length; i++) {
      ctx.beginPath();
      ctx.arc(xAt(i), yAt(orbit[i]), 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // peak marker
    const px = xAt(peak.index);
    const py = yAt(peak.value);
    ctx.strokeStyle = "#7df3ff";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#7df3ff";
    ctx.textAlign = "left";
    ctx.fillText(`peak ${peak.value}`, Math.min(W - PAD_R - 70, px + 6), py - 8);

    // stopping time marker (final descent to 1)
    const lastX = xAt(orbit.length - 1);
    const lastY = yAt(orbit[orbit.length - 1]);
    ctx.strokeStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3.4, 0, Math.PI * 2);
    ctx.stroke();
  }, [orbit, peak]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
        {caption}
      </div>
      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-12">
        <div className="flex justify-center md:col-span-7">
          <div className="hairline overflow-hidden rounded-xl border bg-ink-950">
            <canvas
              ref={canvasRef}
              style={{ width: W, height: H, display: "block", maxWidth: "100%" }}
              aria-label="Collatz trajectory"
            />
          </div>
        </div>
        <div className="space-y-4 md:col-span-5">
          <div className="space-y-2">
            <label className="block font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {inputLabel}
            </label>
            <input
              type="number"
              min={1}
              max={1_000_000_000}
              step={1}
              value={seed}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isFinite(v) && v >= 1) setSeed(Math.floor(v));
              }}
              className="hairline w-full rounded-md border bg-ink-950 px-3 py-2 font-mono text-sm text-ink-100 focus:border-signal-rose/60 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {presetLabel}
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSeed(p)}
                  className={`hairline rounded-md border px-2 py-1 font-mono text-[11px] transition-colors ${
                    seed === p
                      ? "border-signal-rose/70 bg-signal-rose/10 text-signal-rose"
                      : "text-ink-200 hover:border-ink-300/40 hover:text-ink-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
            <div className="hairline rounded-md border bg-ink-950/60 px-3 py-2">
              <div className="text-[9px] uppercase tracking-widest2 text-ink-300">{stepsLabel}</div>
              <div className="text-signal-rose">{orbit.length - 1}</div>
            </div>
            <div className="hairline rounded-md border bg-ink-950/60 px-3 py-2">
              <div className="text-[9px] uppercase tracking-widest2 text-ink-300">{peakLabel}</div>
              <div className="text-signal-cyan">{peak.value.toLocaleString()}</div>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-ink-300">{hint}</p>
        </div>
      </div>
    </div>
  );
}
