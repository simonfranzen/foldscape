"use client";

import { useEffect, useRef, useState } from "react";

// Signature artefact for the Möbius page. A 2D parametric projection of a
// Möbius band, rendered as a chain of small ribbons coloured along the
// surface — a single continuous strip that ends up on the "other" side.
// An ant walks the strip continuously to show one-sidedness.

const W = 800;
const H = 320;

interface RibbonSeg {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  cx: number;
  cy: number;
  dx: number;
  dy: number;
  shade: number; // 0..1, used for fill darkness
  hueShift: number; // 0..1, used to colour from cyan -> violet across the loop
}

function buildStrip(phase: number): { segs: RibbonSeg[]; antT: number } {
  const N = 200;
  const R = 110; // band radius
  const w = 38; // band half-width (will twist)
  const cx = W / 2;
  const cy = H / 2;
  const segs: RibbonSeg[] = [];
  let prev: { ux: number; uy: number; vx: number; vy: number } | null = null;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const θ = t * Math.PI * 2;
    // Möbius half-twist: the cross-section angle is θ/2.
    const α = θ / 2 + phase;
    // Center line of the band (a circle), with a slight 3D->2D foreshortening.
    const ringX = cx + R * Math.cos(θ);
    const ringY = cy + R * Math.sin(θ) * 0.45; // vertical squash
    // Cross-section direction in the 2D projection: rotated by α
    const dx = Math.cos(α);
    const dy = Math.sin(α) * 0.45;
    const ux = ringX + w * dx;
    const uy = ringY + w * dy;
    const vx = ringX - w * dx;
    const vy = ringY - w * dy;
    if (prev) {
      const shade = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(α * 2));
      segs.push({
        ax: prev.ux,
        ay: prev.uy,
        bx: ux,
        by: uy,
        cx: vx,
        cy: vy,
        dx: prev.vx,
        dy: prev.vy,
        shade,
        hueShift: t,
      });
    }
    prev = { ux, uy, vx, vy };
  }
  return { segs, antT: ((phase / (Math.PI * 2)) * 2) % 1 };
}

function lerpColor(t: number): string {
  // cyan (125, 243, 255) -> violet (179, 136, 255) -> amber (255, 209, 102) -> cyan
  const stops = [
    [125, 243, 255],
    [179, 136, 255],
    [255, 209, 102],
    [125, 243, 255],
  ];
  const segs = stops.length - 1;
  const s = Math.min(segs - 1e-6, Math.max(0, t * segs));
  const i = Math.floor(s);
  const f = s - i;
  const a = stops[i];
  const b = stops[i + 1];
  const r = Math.round(a[0] + (b[0] - a[0]) * f);
  const g = Math.round(a[1] + (b[1] - a[1]) * f);
  const bl = Math.round(a[2] + (b[2] - a[2]) * f);
  return `rgb(${r}, ${g}, ${bl})`;
}

export function MobiusStripHero() {
  const [phase, setPhase] = useState(0);
  const [reduced, setReduced] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPhase((p) => p + dt * 0.18);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced]);

  const { segs, antT } = buildStrip(phase);

  // Ant position: walk the band's center circle at progress antT,
  // displaced by a sine across the cross-section so it appears to spiral.
  const θa = antT * Math.PI * 4; // ant goes twice around per surface trip
  const αa = θa / 2 + phase;
  const cx = W / 2;
  const cy = H / 2;
  const R = 110;
  const ringX = cx + R * Math.cos(θa);
  const ringY = cy + R * Math.sin(θa) * 0.45;
  const offset = 22 * Math.sin(θa);
  const ax = ringX + offset * Math.cos(αa);
  const ay = ringY + offset * Math.sin(αa) * 0.45;

  return (
    <figure
      className="hairline glass relative overflow-hidden rounded-2xl border"
      aria-label="A Möbius band: a single twisted ribbon. A walker tracing its surface returns from the other side."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
        {/* Band segments — paint back-to-front using the screen Y of the centre */}
        {segs
          .map((s, i) => {
            const midY = (s.ay + s.by + s.cy + s.dy) / 4;
            return { s, midY, i };
          })
          .sort((a, b) => a.midY - b.midY)
          .map(({ s, i }) => {
            const colour = lerpColor(s.hueShift);
            return (
              <polygon
                key={i}
                points={`${s.ax},${s.ay} ${s.bx},${s.by} ${s.cx},${s.cy} ${s.dx},${s.dy}`}
                fill={colour}
                opacity={0.32 + 0.55 * s.shade}
                stroke="rgba(5,6,10,0.45)"
                strokeWidth="0.4"
              />
            );
          })}

        {/* Ant marker — a tiny luminous dot tracing the surface */}
        <circle cx={ax} cy={ay} r="3.5" fill="#eaecf3" />
        <circle cx={ax} cy={ay} r="9" fill="#eaecf3" opacity="0.18" />

        {/* Caption */}
        <text
          x={W / 2}
          y={H - 14}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          letterSpacing="3.2"
          fill="rgba(234,236,243,0.5)"
        >
          ONE SIDE · ONE EDGE · ONE WALK HOME FROM THE OTHER SIDE
        </text>
      </svg>
    </figure>
  );
}
