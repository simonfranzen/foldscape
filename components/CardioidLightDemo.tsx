"use client";

import { useEffect, useRef, useState } from "react";

// Inline demo for the cardioid story page. Shows a circular cup wall lit by
// a point light source sitting on the rim (the classical setup whose
// catacaustic is a true cardioid). As the slider raises the ray count, the
// envelope of reflected rays — the cardioid — emerges live on the surface.
//
// The math: with the source at angle 0 on the unit circle, each ray to a
// boundary point at angle α reflects to a chord whose family envelopes the
// cardioid r(θ) = a(1 − cos θ) in polar coordinates centred at the source.
// We draw the chords directly, then overlay the cardioid in amber.

interface Props {
  caption: string;
  rayCountLabel: string;
  envelopeLabel: string;
  hint: string;
}

const SIZE = 340;
const INK = "#06070d";
const WALL = "rgba(125, 243, 255, 0.45)";
const RAY = "rgba(255, 209, 102, 0.22)";
const CARDIOID = "#ffd166";
const SRC = "#ff7ab6";

export function CardioidLightDemo({ caption, rayCountLabel, envelopeLabel, hint }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rays, setRays] = useState(80);
  const [showEnvelope, setShowEnvelope] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      draw();
    };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.36;

      // The light source sits on the cup wall at the right.
      const sx = cx + R;
      const sy = cy;

      // Cup wall (circle).
      ctx.strokeStyle = WALL;
      ctx.lineWidth = 1.6 * dpr;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // Rays: from source to a boundary point at angle α, then reflected
      // chord. For a circle, the reflected ray hits the boundary again at
      // angle 2α − π (measured from the source). We draw the chord between
      // those two boundary points — that family envelopes the cardioid.
      ctx.strokeStyle = RAY;
      ctx.lineWidth = 0.7 * dpr;
      for (let i = 1; i < rays; i++) {
        const alpha = (i / rays) * Math.PI * 2;
        // First boundary hit (the chord from source to this point).
        const ax = cx + R * Math.cos(alpha);
        const ay = cy + R * Math.sin(alpha);
        // For a circle hit at angle α from centre by a chord from source on
        // the rim, the reflected chord meets the rim again at angle 2α
        // (rotating around the source). Equivalent: we draw the chord from
        // the hit point along the reflected direction back to the boundary.
        // Reflection: incident d = (ax−sx, ay−sy), normal n = (ax−cx, ay−cy)/R.
        const dx = ax - sx;
        const dy = ay - sy;
        const nx = (ax - cx) / R;
        const ny = (ay - cy) / R;
        const dn = dx * nx + dy * ny;
        const rx = dx - 2 * dn * nx;
        const ry = dy - 2 * dn * ny;
        // Solve |a + t r − c| = R for the second boundary intersection.
        const fx = ax - cx;
        const fy = ay - cy;
        const A = rx * rx + ry * ry;
        const B = 2 * (fx * rx + fy * ry);
        const C = fx * fx + fy * fy - R * R;
        const disc = B * B - 4 * A * C;
        if (disc < 0) continue;
        const t = (-B + Math.sqrt(disc)) / (2 * A);
        const ex = ax + t * rx;
        const ey = ay + t * ry;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ax, ay);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }

      // Cardioid envelope: in polar coordinates centred at the source, the
      // catacaustic is r(θ) = R(1 − cos θ), opening away from the source.
      // (Standard result for point source on a reflecting circle.) The cusp
      // sits at the source, the far tip on the opposite wall at distance 2R.
      if (showEnvelope) {
        ctx.strokeStyle = CARDIOID;
        ctx.lineWidth = 2.2 * dpr;
        ctx.beginPath();
        const steps = 360;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          const r = R * (1 - Math.cos(theta));
          // Source at (sx, sy); the cardioid opens toward −x (into the cup).
          const px = sx + r * Math.cos(theta + Math.PI);
          const py = sy + r * Math.sin(theta + Math.PI);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Source dot.
      ctx.fillStyle = SRC;
      ctx.beginPath();
      ctx.arc(sx, sy, 3.4 * dpr, 0, Math.PI * 2);
      ctx.fill();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [rays, showEnvelope]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>
      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-12">
        <div className="flex justify-center md:col-span-7">
          <div
            className="hairline overflow-hidden rounded-xl border bg-ink-950"
            style={{ width: "100%", maxWidth: SIZE }}
          >
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: SIZE, display: "block" }}
              aria-label="Cardioid as catacaustic of a circle"
            />
          </div>
        </div>
        <div className="space-y-4 md:col-span-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              <span>{rayCountLabel}</span>
              <span className="text-signal-amber">{rays}</span>
            </div>
            <input
              type="range"
              min={4}
              max={240}
              step={2}
              value={rays}
              onChange={(e) => setRays(Number(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-ink-300">
            <input
              type="checkbox"
              checked={showEnvelope}
              onChange={(e) => setShowEnvelope(e.target.checked)}
              className="accent-signal-amber"
            />
            <span>{envelopeLabel}</span>
          </label>
          <p className="text-[11px] leading-relaxed text-ink-300">{hint}</p>
        </div>
      </div>
    </div>
  );
}
