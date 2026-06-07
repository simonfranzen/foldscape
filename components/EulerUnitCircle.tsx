"use client";

import { useEffect, useRef, useState } from "react";

// Live unit-circle in the complex plane. Slider sets θ ∈ [0, 2π]. We draw
// the unit circle, the point e^(iθ) = (cos θ, sin θ), its projections onto
// the real and imaginary axes, and a small read-out. At θ ≈ π we flag
// "= -1" to highlight Euler's identity.

interface Props {
  /** Localised label shown above the canvas in mono uppercase. */
  caption: string;
  /** Localised "highlight when θ ≈ π" string (e.g. "Euler's identity"). */
  identityHint: string;
}

const SIZE = 360;
const TWO_PI = Math.PI * 2;

export function EulerUnitCircle({ caption, identityHint }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // θ starts at π/4 so the picture is immediately interesting on mount.
  const [theta, setTheta] = useState(Math.PI / 4);

  useEffect(() => {
    const cnv = canvasRef.current;
    if (!cnv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cnv.width = SIZE * dpr;
    cnv.height = SIZE * dpr;
    const ctx = cnv.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const R = SIZE * 0.36; // radius of the unit circle in canvas pixels

    // Background fill
    ctx.fillStyle = "#06070d";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Faint grid
    ctx.strokeStyle = "rgba(138,144,164,0.10)";
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue;
      const off = (i * R) / 2;
      ctx.beginPath();
      ctx.moveTo(cx + off, 8);
      ctx.lineTo(cx + off, SIZE - 8);
      ctx.moveTo(8, cy + off);
      ctx.lineTo(SIZE - 8, cy + off);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "rgba(138,144,164,0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(8, cy);
    ctx.lineTo(SIZE - 8, cy);
    ctx.moveTo(cx, 8);
    ctx.lineTo(cx, SIZE - 8);
    ctx.stroke();

    // Axis tick labels
    ctx.fillStyle = "#8a90a4";
    ctx.font = "10px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText("Re", SIZE - 18, cy - 6);
    ctx.fillText("Im", cx + 14, 18);
    ctx.fillText("1", cx + R, cy + 14);
    ctx.fillText("−1", cx - R, cy + 14);
    ctx.fillText("i", cx + 10, cy - R + 4);
    ctx.fillText("−i", cx + 14, cy + R + 4);
    ctx.fillText("0", cx - 10, cy + 14);

    // Unit circle
    ctx.strokeStyle = "rgba(255,209,102,0.40)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, TWO_PI);
    ctx.stroke();

    // Arc swept so far (0 → θ, counter-clockwise in math convention, which
    // is clockwise in screen-y-down. We flip y so math-up = canvas-up).
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, -theta, true);
    ctx.stroke();

    // Compute point on the unit circle.
    const px = cx + Math.cos(theta) * R;
    const py = cy - Math.sin(theta) * R;

    // Projections (cos θ on Re axis, sin θ on Im axis)
    ctx.strokeStyle = "rgba(125,243,255,0.55)";
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, cy);
    ctx.stroke();
    ctx.strokeStyle = "rgba(179,136,255,0.55)";
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(cx, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cos / sin component markers on the axes
    ctx.fillStyle = "#7df3ff";
    ctx.beginPath();
    ctx.arc(px, cy, 3, 0, TWO_PI);
    ctx.fill();
    ctx.fillStyle = "#b388ff";
    ctx.beginPath();
    ctx.arc(cx, py, 3, 0, TWO_PI);
    ctx.fill();

    // Radius line
    ctx.strokeStyle = "rgba(255,209,102,0.7)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();

    // Highlight if we're near θ = π (Euler's identity moment)
    const nearPi = Math.abs(theta - Math.PI) < 0.04;
    if (nearPi) {
      ctx.fillStyle = "rgba(255,122,182,0.18)";
      ctx.beginPath();
      ctx.arc(cx - R, cy, 14, 0, TWO_PI);
      ctx.fill();
    }

    // The moving point e^(iθ)
    ctx.fillStyle = nearPi ? "#ff7ab6" : "#ffd166";
    ctx.beginPath();
    ctx.arc(px, py, 5.5, 0, TWO_PI);
    ctx.fill();
    ctx.strokeStyle = "#06070d";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }, [theta]);

  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const nearPi = Math.abs(theta - Math.PI) < 0.04;
  const thetaLabel = theta.toFixed(3);
  const piRatio = (theta / Math.PI).toFixed(2);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          style={{ width: SIZE, height: SIZE }}
          className="hairline rounded-lg border"
          aria-label="Unit circle with point e^(i theta)"
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="w-10 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            θ
          </span>
          <input
            type="range"
            min={0}
            max={TWO_PI}
            step={0.001}
            value={theta}
            onChange={(e) => setTheta(parseFloat(e.target.value))}
            className="flex-1 accent-signal-amber"
            aria-label="theta slider"
          />
          <span className="w-24 text-right font-mono text-xs text-signal-amber">
            {thetaLabel} ({piRatio}π)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3">
            <div className="text-[10px] uppercase tracking-widest2 text-signal-cyan">
              cos θ · Re
            </div>
            <div className="text-base text-ink-100">{cos.toFixed(4)}</div>
          </div>
          <div className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3">
            <div className="text-[10px] uppercase tracking-widest2 text-signal-violet">
              sin θ · Im
            </div>
            <div className="text-base text-ink-100">{sin.toFixed(4)}</div>
          </div>
        </div>
        <div
          className={`hairline rounded-md border p-3 font-mono text-sm transition-colors ${
            nearPi
              ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
              : "bg-ink-950/60 text-ink-200"
          }`}
        >
          <span className="text-ink-400">e^(iθ) = </span>
          {cos.toFixed(3)}
          {sin >= 0 ? " + " : " − "}
          {Math.abs(sin).toFixed(3)}i
          {nearPi && <span className="ml-2 text-signal-rose">= −1 · {identityHint}</span>}
        </div>
      </div>
    </div>
  );
}
